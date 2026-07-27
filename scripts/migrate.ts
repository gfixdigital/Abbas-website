/**
 * Applies the SQL files in supabase/migrations over a direct Postgres
 * connection.
 *
 *   npm run db:migrate
 *
 * Why this exists: Supabase has no API for schema changes. The REST endpoint
 * (PostgREST) cannot run DDL, and the dashboard's SQL editor needs a browser
 * session. A direct Postgres connection is the only programmatic route.
 *
 * Each file runs inside its own transaction, so a failure rolls the whole file
 * back. That matters most for 0002_rls.sql, which drops every existing policy
 * before recreating them: pasted into the SQL editor, a mid-file error would
 * leave the tables with RLS on and no policies at all, silently breaking reads.
 * Here it either fully applies or does nothing.
 *
 * Connection: set SUPABASE_DB_URL in .env.local. Get it from
 * Supabase dashboard > Project Settings > Database > Connection string > URI,
 * then replace [YOUR-PASSWORD] with the database password.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { config } from "dotenv";
import { Client } from "pg";

config({ path: ".env.local" });

const MIGRATIONS_DIR = join(process.cwd(), "supabase", "migrations");

function resolveConnectionString(): string {
  const direct = process.env.SUPABASE_DB_URL?.trim();
  if (direct) return direct;

  // Assemble it from the project ref and a separate password. Supplying the
  // password on its own is safer than a URI: passwords routinely contain "@",
  // ":" and "/", which terminate the userinfo section of a URI early and
  // produce a confusing "host not found" instead of an obvious parse error.
  const password = process.env.SUPABASE_DB_PASSWORD?.trim();
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  if (password && projectUrl) {
    const ref = new URL(projectUrl).hostname.split(".")[0];
    const region = process.env.SUPABASE_DB_REGION?.trim();

    if (region) {
      // Pooler, session mode. Port 5432 rather than 6543 because migrations
      // need real transactions and DDL, which transaction mode does not
      // reliably support.
      return `postgresql://postgres.${ref}:${encodeURIComponent(password)}@aws-0-${region}.pooler.supabase.com:5432/postgres`;
    }

    // Direct connection. IPv6-only on newer projects, hence the region option.
    return `postgresql://postgres:${encodeURIComponent(password)}@db.${ref}.supabase.co:5432/postgres`;
  }

  console.error(
    [
      "No database connection configured.",
      "",
      "Add ONE of these to .env.local:",
      "",
      "  SUPABASE_DB_URL=postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres",
      "",
      "or, preferably (handles passwords containing @ : / correctly):",
      "",
      "  SUPABASE_DB_PASSWORD=your-database-password",
      "  SUPABASE_DB_REGION=ap-southeast-1   # optional, uses the IPv4 pooler",
      "",
      "Find it in the Supabase dashboard for the project that owns",
      `  ${projectUrl ?? "<your project>"}`,
      "under Project Settings > Database.",
      "",
      "Use the Connection Pooling URI (port 6543) if your network has no IPv6.",
    ].join("\n"),
  );
  process.exit(1);
}

async function run() {
  const connectionString = resolveConnectionString();

  const files = readdirSync(MIGRATIONS_DIR)
    .filter((name) => name.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.error(`No .sql files found in ${MIGRATIONS_DIR}`);
    process.exit(1);
  }

  // Redact the password before printing anything.
  let display = connectionString;
  try {
    const parsed = new URL(connectionString);
    parsed.password = "***";
    display = parsed.toString();
  } catch {
    display = "(unparseable connection string)";
  }

  const client = new Client({
    connectionString,
    // Supabase requires TLS. Certificate verification is relaxed because the
    // direct-connection host presents a cert that is not in Node's default
    // trust store. Set SUPABASE_DB_SSL_STRICT=1 once you have supplied a CA.
    ssl:
      process.env.SUPABASE_DB_SSL_STRICT === "1"
        ? { rejectUnauthorized: true }
        : { rejectUnauthorized: false },
    // Fail fast rather than hanging on an unreachable host.
    connectionTimeoutMillis: 20_000,
    statement_timeout: 120_000,
  });

  console.log(`Connecting to ${display}\n`);

  try {
    await client.connect();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Could not connect: ${message}\n`);

    if (/ENOTFOUND|EAI_AGAIN/.test(message)) {
      console.error(
        "That host did not resolve. Direct connections are IPv6-only on newer\n" +
          "Supabase projects. Use the Connection Pooling URI instead, which is\n" +
          "IPv4 and looks like:\n" +
          "  postgresql://postgres.REF:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres",
      );
    } else if (/password authentication failed/i.test(message)) {
      console.error(
        "The password was rejected. Reset it under Project Settings > Database\n" +
          "> Database password, then update .env.local.",
      );
    }
    process.exit(1);
  }

  const { rows } = await client.query<{ db: string; version: string }>(
    "select current_database() as db, version() as version",
  );
  console.log(`Connected to "${rows[0]?.db}"`);
  console.log(`${rows[0]?.version?.split(",")[0] ?? "unknown version"}\n`);

  let failed = false;

  for (const file of files) {
    const sql = readFileSync(join(MIGRATIONS_DIR, file), "utf8");
    process.stdout.write(`Applying ${file} ... `);

    try {
      // One transaction per file: all of it, or none of it.
      await client.query("begin");
      await client.query(sql);
      await client.query("commit");
      console.log("done");
    } catch (error) {
      await client.query("rollback").catch(() => {});
      failed = true;
      const message = error instanceof Error ? error.message : String(error);
      console.log("FAILED");
      console.error(`\n  ${file} was rolled back. Nothing from it was applied.`);
      console.error(`  ${message}\n`);
      break;
    }
  }

  if (!failed) {
    // Report what the schema now looks like, so the result is verifiable
    // rather than merely claimed.
    const { rows: tables } = await client.query<{ table_name: string }>(
      `select table_name from information_schema.tables
       where table_schema = 'public' and table_type = 'BASE TABLE'
       order by table_name`,
    );
    const { rows: policies } = await client.query<{ count: string }>(
      "select count(*)::text as count from pg_policies where schemaname = 'public'",
    );

    console.log(`\nPublic tables (${tables.length}):`);
    console.log(
      tables.map((t) => `  ${t.table_name}`).join("\n") || "  (none)",
    );
    console.log(`\nRLS policies on public schema: ${policies[0]?.count ?? "?"}`);
    console.log("\nSchema is up to date. Next: npm run db:seed");
  }

  await client.end();
  if (failed) process.exit(1);
}

run().catch((error: unknown) => {
  console.error(
    `\nMigration run failed: ${error instanceof Error ? error.message : error}`,
  );
  process.exit(1);
});
