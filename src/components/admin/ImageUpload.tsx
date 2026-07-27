"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Uploads straight to the public `media` bucket and hands the resulting public
 * URL back to the form. Also accepts a pasted URL, which is how the existing
 * ImageKit assets from the GFix site are referenced.
 */
export function ImageUpload({
  value,
  onChange,
  label,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  label: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function upload(file: File) {
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      toast.error("Choose an image file, or a PDF for the CV.");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("That file is larger than 5 MB. Please compress it first.");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "bin";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

      const { error } = await supabase.storage
        .from("media")
        .upload(path, file, { cacheControl: "31536000", upsert: false });

      if (error) {
        toast.error(
          error.message.includes("Bucket not found")
            ? "The media storage area is not set up yet. Run the database setup files first."
            : "That upload did not work. Please try again.",
        );
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("media").getPublicUrl(path);

      onChange(publicUrl);
      toast.success("Uploaded.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const isPdf = value?.toLowerCase().endsWith(".pdf");

  return (
    <div className="space-y-3">
      {value ? (
        <div className="flex items-start gap-4 rounded-xl border border-line bg-bg p-3">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-bg-soft">
            {isPdf ? (
              <span className="grid h-full w-full place-items-center font-mono text-[10px] uppercase tracking-wider text-muted">
                PDF
              </span>
            ) : (
              <Image
                src={value}
                alt={`${label} preview`}
                fill
                sizes="80px"
                className="object-cover"
                unoptimized
              />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-[11px] text-muted">{value}</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <Button
                type="button"
                variant="subtle"
                size="sm"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
              >
                Replace
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChange(null)}
                className="text-danger hover:bg-danger/[0.07]"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            "flex w-full items-center justify-center gap-2.5 rounded-xl border border-dashed border-line-strong bg-bg px-4 py-7",
            "text-sm text-muted transition-colors hover:border-brand hover:text-brand disabled:opacity-60",
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Uploading
            </>
          ) : (
            <>
              <ImagePlus className="h-4 w-4" aria-hidden="true" />
              Choose a file from your computer
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="sr-only"
        aria-label={`Upload ${label}`}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
        }}
      />

      <div>
        <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          Or paste a web address
        </p>
        <Input
          type="url"
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value || null)}
          placeholder="https://..."
        />
      </div>
    </div>
  );
}
