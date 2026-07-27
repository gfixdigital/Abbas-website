"use client";

import { GripVertical, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { FieldDef } from "@/lib/admin/entities";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "./ImageUpload";

export type FieldValue = unknown;

export function FieldRenderer({
  field,
  value,
  error,
  onChange,
}: {
  field: FieldDef;
  value: FieldValue;
  error?: string;
  onChange: (value: FieldValue) => void;
}) {
  const id = `field-${field.name}`;
  const describedBy = [
    field.help ? `${id}-help` : null,
    error ? `${id}-error` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cn(field.half ? "sm:col-span-1" : "sm:col-span-2")}>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <Label htmlFor={id}>
          {field.label}
          {!field.optional && field.kind !== "switch" && (
            <span className="ml-1 text-danger" aria-hidden="true">
              *
            </span>
          )}
        </Label>
        {field.optional && (
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
            Optional
          </span>
        )}
      </div>

      {field.help && (
        <p id={`${id}-help`} className="mb-2.5 text-xs leading-relaxed text-muted">
          {field.help}
        </p>
      )}

      <Control
        id={id}
        field={field}
        value={value}
        onChange={onChange}
        invalid={Boolean(error)}
        describedBy={describedBy || undefined}
      />

      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

function Control({
  id,
  field,
  value,
  onChange,
  invalid,
  describedBy,
}: {
  id: string;
  field: FieldDef;
  value: FieldValue;
  onChange: (value: FieldValue) => void;
  invalid: boolean;
  describedBy?: string;
}) {
  switch (field.kind) {
    case "textarea":
    case "richtext":
      return (
        <Textarea
          id={id}
          rows={field.kind === "richtext" ? 10 : 4}
          value={(value as string) ?? ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          aria-invalid={invalid}
          aria-describedby={describedBy}
        />
      );

    case "switch":
      return (
        <div className="flex items-center gap-3">
          <Switch
            id={id}
            checked={Boolean(value)}
            onCheckedChange={onChange}
            aria-describedby={describedBy}
          />
          <span className="text-sm text-muted">
            {value ? "Yes" : "No"}
          </span>
        </div>
      );

    case "select":
      return (
        <select
          id={id}
          value={(value as string) ?? ""}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className={selectClass}
        >
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );

    case "image":
      return (
        <ImageUpload
          value={(value as string | null) ?? null}
          onChange={onChange}
          label={field.label}
        />
      );

    case "taglist":
      return (
        <TagListEditor
          id={id}
          value={Array.isArray(value) ? (value as string[]) : []}
          onChange={onChange}
        />
      );

    case "paragraphs":
      return (
        <ParagraphsEditor
          value={Array.isArray(value) ? (value as string[]) : []}
          onChange={onChange}
        />
      );

    case "skills":
      return (
        <SkillsEditor
          value={
            Array.isArray(value)
              ? (value as { name: string; level: number }[])
              : []
          }
          onChange={onChange}
        />
      );

    case "number":
      return (
        <Input
          id={id}
          type="number"
          value={(value as number | string) ?? ""}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={invalid}
          aria-describedby={describedBy}
        />
      );

    case "date":
      return (
        <Input
          id={id}
          type="date"
          value={((value as string) ?? "").slice(0, 10)}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={invalid}
          aria-describedby={describedBy}
        />
      );

    default:
      return (
        <Input
          id={id}
          type={field.kind === "email" ? "email" : field.kind === "url" ? "url" : "text"}
          value={(value as string) ?? ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          aria-invalid={invalid}
          aria-describedby={describedBy}
        />
      );
  }
}

const selectClass = cn(
  "flex h-11 w-full appearance-none rounded-xl border border-line bg-bg px-4 py-2 text-sm text-ink",
  "transition-colors focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/18",
  "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 12 12%22 fill=%22none%22 stroke=%22%235b6071%22 stroke-width=%221.6%22><path d=%22M2 4.5 6 8.5 10 4.5%22 stroke-linecap=%22round%22/></svg>')] bg-[length:12px] bg-[position:right_1rem_center] bg-no-repeat pr-10",
);

/* -------------------------------------------------------------------------- */
/* Tag list                                                                   */
/* -------------------------------------------------------------------------- */

function TagListEditor({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  function add() {
    const trimmed = draft.trim();
    if (!trimmed || value.includes(trimmed)) {
      setDraft("");
      return;
    }
    onChange([...value, trimmed]);
    setDraft("");
  }

  return (
    <div>
      {value.length > 0 && (
        <ul className="mb-2.5 flex flex-wrap gap-2">
          {value.map((item) => (
            <li key={item}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg-soft py-1 pl-3 pr-1.5 text-[13px] text-ink">
                {item}
                <button
                  type="button"
                  onClick={() => onChange(value.filter((entry) => entry !== item))}
                  aria-label={`Remove ${item}`}
                  className="grid h-5 w-5 place-items-center rounded-full text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <Input
          id={id}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              add();
            }
          }}
          placeholder="Type and press Enter"
        />
        <Button type="button" variant="subtle" onClick={add} className="shrink-0">
          Add
        </Button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Paragraphs                                                                 */
/* -------------------------------------------------------------------------- */

function ParagraphsEditor({
  value,
  onChange,
}: {
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const rows = value.length > 0 ? value : [""];

  function update(index: number, next: string) {
    const copy = [...rows];
    copy[index] = next;
    onChange(copy);
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= rows.length) return;
    const copy = [...rows];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    onChange(copy);
  }

  return (
    <div className="space-y-3">
      {rows.map((paragraph, index) => (
        <div key={index} className="rounded-xl border border-line bg-bg p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              Paragraph {index + 1}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label={`Move paragraph ${index + 1} up`}
                className="grid h-7 w-7 place-items-center rounded-lg text-muted transition-colors hover:bg-bg-soft hover:text-ink disabled:opacity-30"
              >
                <span aria-hidden="true">↑</span>
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === rows.length - 1}
                aria-label={`Move paragraph ${index + 1} down`}
                className="grid h-7 w-7 place-items-center rounded-lg text-muted transition-colors hover:bg-bg-soft hover:text-ink disabled:opacity-30"
              >
                <span aria-hidden="true">↓</span>
              </button>
              <button
                type="button"
                onClick={() => onChange(rows.filter((_, i) => i !== index))}
                disabled={rows.length === 1}
                aria-label={`Delete paragraph ${index + 1}`}
                className="grid h-7 w-7 place-items-center rounded-lg text-muted transition-colors hover:bg-danger/10 hover:text-danger disabled:opacity-30"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <Textarea
            rows={4}
            value={paragraph}
            onChange={(event) => update(index, event.target.value)}
            aria-label={`Paragraph ${index + 1}`}
            className="border-0 bg-transparent px-0 focus-visible:ring-0"
          />
        </div>
      ))}

      <Button
        type="button"
        variant="subtle"
        size="sm"
        onClick={() => onChange([...rows, ""])}
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        Add paragraph
      </Button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Skills                                                                     */
/* -------------------------------------------------------------------------- */

function SkillsEditor({
  value,
  onChange,
}: {
  value: { name: string; level: number }[];
  onChange: (value: { name: string; level: number }[]) => void;
}) {
  function update(index: number, patch: Partial<{ name: string; level: number }>) {
    const copy = [...value];
    copy[index] = { ...copy[index], ...patch };
    onChange(copy);
  }

  return (
    <div className="space-y-3">
      {value.map((skill, index) => (
        <div
          key={index}
          className="flex flex-wrap items-end gap-3 rounded-xl border border-line bg-bg p-3"
        >
          <GripVertical
            className="mb-2.5 h-4 w-4 shrink-0 text-line-strong"
            aria-hidden="true"
          />

          <div className="min-w-[9rem] flex-1">
            <label
              htmlFor={`skill-name-${index}`}
              className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-muted"
            >
              Skill
            </label>
            <Input
              id={`skill-name-${index}`}
              value={skill.name}
              onChange={(event) => update(index, { name: event.target.value })}
            />
          </div>

          <div className="w-full sm:w-52">
            <label
              htmlFor={`skill-level-${index}`}
              className="mb-1.5 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-muted"
            >
              Strength
              <span className="tabular-nums">{skill.level}</span>
            </label>
            <input
              id={`skill-level-${index}`}
              type="range"
              min={0}
              max={100}
              step={1}
              value={skill.level}
              onChange={(event) =>
                update(index, { level: Number(event.target.value) })
              }
              className="h-11 w-full accent-[var(--brand-blue)]"
            />
          </div>

          <button
            type="button"
            onClick={() => onChange(value.filter((_, i) => i !== index))}
            aria-label={`Remove ${skill.name || `skill ${index + 1}`}`}
            className="mb-1 grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-danger/10 hover:text-danger"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      ))}

      <Button
        type="button"
        variant="subtle"
        size="sm"
        onClick={() => onChange([...value, { name: "", level: 80 }])}
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        Add skill
      </Button>
    </div>
  );
}
