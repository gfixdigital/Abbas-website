"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { EntityDef } from "@/lib/admin/entities";
import { createRecord, updateRecord } from "@/app/admin/actions";
import {
  EntityForm,
  emptyValues,
  useFormState,
  valuesFromRow,
} from "./EntityForm";

/** Editor for one-row tables: profile and site settings. */
export function SingletonEditor({
  entity,
  row,
}: {
  entity: EntityDef;
  row: Record<string, unknown> | null;
}) {
  const router = useRouter();
  const form = useFormState(
    row ? valuesFromRow(entity, row) : emptyValues(entity),
  );

  async function save() {
    form.setFieldErrors({});
    form.setSubmitting(true);

    const result = row?.id
      ? await updateRecord(entity.key, String(row.id), form.values)
      : await createRecord(entity.key, form.values);

    form.setSubmitting(false);

    if (!result.ok) {
      if (result.fieldErrors) form.setFieldErrors(result.fieldErrors);
      toast.error(result.error);
      return;
    }

    toast.success("Saved. Your site is updated.");
    router.refresh();
  }

  return (
    <div className="max-w-3xl rounded-[var(--radius)] border border-line bg-bg-elevated p-6 sm:p-8">
      <EntityForm
        entity={entity}
        values={form.values}
        setValues={form.setValues}
        fieldErrors={form.fieldErrors}
        onSubmit={save}
        submitting={form.submitting}
        submitLabel="Save changes"
      />
    </div>
  );
}
