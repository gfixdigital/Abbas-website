import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { profile } from "@/content";

export const runtime = "edge";

/**
 * Dynamic Open Graph card.
 * /api/og?title=…&eyebrow=…&meta=…
 *
 * Uses the brand gradient and the dual-track rule so shared links look like
 * they came from this site.
 */
export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get("title") ?? profile.tagline;
  const eyebrow = searchParams.get("eyebrow") ?? profile.company;
  const meta = searchParams.get("meta") ?? `${profile.title} · Swat, Pakistan`;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0B0F19 0%, #1a2332 100%)",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top rule with the two track colours */}
        <div style={{ display: "flex", height: 4, width: "100%" }}>
          <div style={{ flex: 2, background: "#0066FF" }} />
          <div style={{ flex: 1, background: "#f59e0b" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 20,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#3385ff",
              marginBottom: 28,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: title.length > 60 ? 60 : 76,
              fontWeight: 700,
              lineHeight: 1.06,
              letterSpacing: "-0.035em",
              color: "#ffffff",
              maxWidth: 980,
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.14)",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "linear-gradient(135deg, #0047b3 0%, #0066FF 50%, #3385ff 100%)",
                color: "#fff",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              MA
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 26, fontWeight: 600, color: "#fff" }}>
                {profile.name}
              </div>
              <div style={{ display: "flex", fontSize: 18, color: "rgba(255,255,255,0.55)" }}>
                {meta}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", fontSize: 18, color: "rgba(255,255,255,0.45)" }}>
            abbas.gfixdigital.com
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
