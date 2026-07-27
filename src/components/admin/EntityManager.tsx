"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  createRecord,
  deleteRecord,
  reorderRecords,
  togglePublished,
  updateRecord,
} from "@/app/admin/actions";
import type { EntityDef } from "@/lib/admin/entities";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { AdminHeader } from "./AdminHeader";
import {
  EntityForm,
  emptyValues,
  useFormState,
  valuesFromRow,
  type FormValues,
} from "./EntityForm";

type Row = Record<string, unknown>;

export function EntityManager({
  entity,
  rows: initialRows,
}: {
  entity: EntityDef;
  rows: Row[];
}) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Row | null>(null);
  const [, startTransition] = useTransition();

  // Server data wins whenever the route revalidates.
  useEffect(() => setRows(initialRows), [initialRows]);

  const form = useFormState(emptyValues(entity));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function openCreate() {
    form.reset(emptyValues(entity));
    setCreating(true);
  }

  function openEdit(row: Row) {
    form.reset(valuesFromRow(entity, row));
    setEditing(row);
  }

  function closeDialog() {
    setCreating(false);
    setEditing(null);
  }

  async function save() {
    form.setFieldErrors({});
    form.setSubmitting(true);

    const result = editing?.id
      ? await updateRecord(entity.key, String(editing.id), form.values)
      : await createRecord(entity.key, form.values);

    form.setSubmitting(false);

    if (!result.ok) {
      if (result.fieldErrors) form.setFieldErrors(result.fieldErrors);
      toast.error(result.error);
      return;
    }

    toast.success(editing ? "Changes saved." : `${entity.singular} added.`);
    closeDialog();
    router.refresh();
  }

  async function confirmDelete() {
    if (!deleting?.id) return;
    const id = String(deleting.id);
    const snapshot = rows;

    // Optimistic removal, rolled back if the server rejects it.
    setRows((current) => current.filter((row) => String(row.id) !== id));
    setDeleting(null);

    const result = await deleteRecord(entity.key, id);
    if (!result.ok) {
      setRows(snapshot);
      toast.error(result.error);
      return;
    }

    toast.success(`${entity.singular} deleted.`);
    router.refresh();
  }

  async function onToggle(row: Row, next: boolean) {
    const id = String(row.id);
    const snapshot = rows;

    setRows((current) =>
      current.map((item) =>
        String(item.id) === id ? { ...item, published: next } : item,
      ),
    );

    const result = await togglePublished(entity.key, id, next);
    if (!result.ok) {
      setRows(snapshot);
      toast.error(result.error);
      return;
    }

    toast.success(next ? "Now visible on the site." : "Hidden from the site.");
    startTransition(() => router.refresh());
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = rows.findIndex((row) => String(row.id) === active.id);
    const newIndex = rows.findIndex((row) => String(row.id) === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const snapshot = rows;
    const reordered = arrayMove(rows, oldIndex, newIndex);
    setRows(reordered);

    void reorderRecords(
      entity.key,
      reordered.map((row) => String(row.id)),
    ).then((result) => {
      if (!result.ok) {
        setRows(snapshot);
        toast.error(result.error);
        return;
      }
      startTransition(() => router.refresh());
    });
  }

  const listFields = entity.fields.filter((field) => field.inList);

  return (
    <>
      <AdminHeader
        title={entity.label}
        description={entity.description}
        action={
          <Button variant="brand" onClick={openCreate}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add {entity.singular.toLowerCase()}
          </Button>
        }
      />

      <div className="p-5 sm:p-8 lg:p-10">
        {rows.length === 0 ? (
          <div className="rounded-[var(--radius)] border border-dashed border-line-strong bg-bg-elevated p-12 text-center">
            <h2 className="font-display text-lg font-semibold tracking-tight text-ink">
              Nothing here yet
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
              Add your first {entity.singular.toLowerCase()} and it will appear on
              the site straight away.
            </p>
            <Button variant="brand" className="mt-6" onClick={openCreate}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add {entity.singular.toLowerCase()}
            </Button>
          </div>
        ) : (
          <>
            {entity.orderable && rows.length > 1 && (
              <p className="mb-4 font-mono text-[11px] text-muted">
                Drag the handle on the left to change the order they appear in.
              </p>
            )}

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
            >
              <SortableContext
                items={rows.map((row) => String(row.id))}
                strategy={verticalListSortingStrategy}
              >
                <ul className="space-y-2.5">
                  {rows.map((row) => (
                    <SortableRow
                      key={String(row.id)}
                      id={String(row.id)}
                      disabled={!entity.orderable}
                    >
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <p className="truncate text-sm font-medium text-ink">
                          {String(row[entity.titleField] ?? "Untitled")}
                        </p>
                        {entity.subtitleField && (
                          <p className="truncate text-[13px] text-muted">
                            {String(row[entity.subtitleField] ?? "")}
                          </p>
                        )}
                        {listFields.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            {listFields
                              .filter(
                                (field) =>
                                  field.name !== entity.titleField &&
                                  field.name !== entity.subtitleField,
                              )
                              .map((field) => {
                                const value = row[field.name];
                                if (value === null || value === undefined || value === "")
                                  return null;
                                return (
                                  <Badge key={field.name}>
                                    {String(value)}
                                  </Badge>
                                );
                              })}
                          </div>
                        )}
                      </div>

                      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                        <label className="flex items-center gap-2">
                          <span className="hidden font-mono text-[10px] uppercase tracking-[0.12em] text-muted sm:inline">
                            Visible
                          </span>
                          <Switch
                            checked={row.published !== false}
                            onCheckedChange={(next) => void onToggle(row, next)}
                            aria-label={`${row.published !== false ? "Hide" : "Show"} ${String(row[entity.titleField] ?? "this item")} on the site`}
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => openEdit(row)}
                          aria-label={`Edit ${String(row[entity.titleField] ?? "item")}`}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-brand hover:text-brand"
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleting(row)}
                          aria-label={`Delete ${String(row[entity.titleField] ?? "item")}`}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-danger hover:text-danger"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </SortableRow>
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          </>
        )}
      </div>

      {/* Create / edit */}
      <Dialog
        open={creating || editing !== null}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? `Edit ${entity.singular.toLowerCase()}` : `Add ${entity.singular.toLowerCase()}`}
            </DialogTitle>
            <DialogDescription>
              Fields marked with a red star are required. Everything saves to the
              live site when you press save.
            </DialogDescription>
          </DialogHeader>

          <FormShell
            entity={entity}
            values={form.values}
            setValues={form.setValues}
            fieldErrors={form.fieldErrors}
            submitting={form.submitting}
            onSubmit={save}
            onCancel={closeDialog}
            submitLabel={editing ? "Save changes" : `Add ${entity.singular.toLowerCase()}`}
          />
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete this {entity.singular.toLowerCase()}?</DialogTitle>
            <DialogDescription>
              <strong className="font-medium text-ink">
                {String(deleting?.[entity.titleField] ?? "")}
              </strong>{" "}
              will be removed from your site permanently. This cannot be undone.
              If you only want to take it off the site for now, turn the Visible
              switch off instead.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleting(null)}>
              Keep it
            </Button>
            <Button variant="danger" onClick={() => void confirmDelete()}>
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Delete permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/** Adds the visibility switch to the shared form. */
function FormShell({
  entity,
  values,
  setValues,
  fieldErrors,
  submitting,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  entity: EntityDef;
  values: FormValues;
  setValues: (values: FormValues) => void;
  fieldErrors: Record<string, string>;
  submitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
}) {
  return (
    <div className="space-y-6">
      <label className="flex items-center justify-between gap-4 rounded-xl border border-line bg-bg-soft px-4 py-3">
        <span>
          <span className="block text-sm font-medium text-ink">
            Visible on the site
          </span>
          <span className="mt-0.5 block text-xs text-muted">
            Turn this off to save it without showing it publicly.
          </span>
        </span>
        <Switch
          checked={values.published !== false}
          onCheckedChange={(next) => setValues({ ...values, published: next })}
        />
      </label>

      <EntityForm
        entity={entity}
        values={values}
        setValues={setValues}
        fieldErrors={fieldErrors}
        onSubmit={onSubmit}
        onCancel={onCancel}
        submitting={submitting}
        submitLabel={submitLabel}
      />
    </div>
  );
}

function SortableRow({
  id,
  disabled,
  children,
}: {
  id: string;
  disabled: boolean;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id, disabled });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-4 rounded-[var(--radius)] border border-line bg-bg-elevated p-4",
        isDragging && "z-10 shadow-[var(--shadow-md)]",
      )}
    >
      {!disabled && (
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label="Reorder this item"
          className="grid h-8 w-6 shrink-0 cursor-grab place-items-center rounded text-line-strong transition-colors hover:text-muted active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
      {children}
    </li>
  );
}
