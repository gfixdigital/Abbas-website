import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-line bg-bg-soft text-muted",
        brand: "border-brand/25 bg-brand/8 text-brand",
        accent: "border-accent/30 bg-accent/10 text-[#8a5a06] dark:text-accent",
        outline: "border-line-strong bg-transparent text-ink",
        success: "border-success/25 bg-success/10 text-success",
        danger: "border-danger/25 bg-danger/10 text-danger",
        mono: "border-line bg-transparent font-mono uppercase tracking-[0.12em] text-muted",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
