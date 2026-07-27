"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import type { EntityDef } from "@/lib/admin/entities";
import { Button } from "@/components/ui/button";
import { FieldRenderer } from "./FieldRenderer";

export type FormValues = Record<string, unknown>;

/** Seeds a blank record from the field definitions. */
export function emptyValues(entity: EntityDef): FormValues {
  const values: FormValues = { published: true };
  for (const field of entity.fields) {
    switch (field.kind) {
      case "switch":
        values[field.name] = false;
        break;
      case "number":
        values[field.name] = 0;
        break;
      case "taglist":
      case "paragraphs":
      case "skills":
        values[field.name] = [];
        break;
      case "select":
        values[field.name] = field.options?.[0]?.value ?? "";
        break;
      case "image":
        values[field.name] = null;
        break;
      default:
        values[field.name] = "";
    }
  }
  return values;
}

/** Maps a database row onto form values, coercing JSON columns to arrays. */
export function valuesFromRow(
  entity: EntityDef,
  row: Record<string, unknown>,
): FormValues {
  const values: FormValues = { published: row.published !== false };

  for (const field of entity.fields) {
    const raw = row[field.name];

    switch (field.kind) {
      case "taglist":
      case "paragraphs":
      case "skills":
        values[field.name] = Array.isArray(raw) ? raw : [];
        break;
      case "switch":
        values[field.name] = Boolean(raw);
        break;
      case "number":
        values[field.name] = typeof raw === "number" ? raw : 0;
        break;
      case "image":
        values[field.name] = (raw as string | null) ?? null;
        break;
      case "date":
        values[field.name] = typeof raw === "string" ? raw.slice(0, 10) : "";
        break;
      default:
        values[field.name] = (raw as string | null) ?? "";
    }
  }

  return values;
}

export function EntityForm({
  entity,
  values,
  setValues,
  fieldErrors,
  onSubmit,
  onCancel,
  submitting,
  submitLabel,
}: {
  entity: EntityDef;
  values: FormValues;
  setValues: (values: FormValues) => void;
  fieldErrors: Record<string, string>;
  onSubmit: () => void;
  onCancel?: () => void;
  submitting: boolean;
  submitLabel: string;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="space-y-6"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {entity.fields.map((field) => (
          <FieldRenderer
            key={field.name}
            field={field}
            value={values[field.name]}
            error={fieldErrors[field.name]}
            onChange={(next) => setValues({ ...values, [field.name]: next })}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
        <Button type="submit" variant="brand" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Saving
            </>
          ) : (
            submitLabel
          )}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

/** Small hook shared by the manager and the singleton editor. */
export function useFormState(initial: FormValues) {
  const [values, setValues] = useState<FormValues>(initial);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  return {
    values,
    setValues,
    fieldErrors,
    setFieldErrors,
    submitting,
    setSubmitting,
    reset(next: FormValues) {
      setValues(next);
      setFieldErrors({});
      setSubmitting(false);
    },
  };
}
