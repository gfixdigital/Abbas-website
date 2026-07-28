import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full",
    "text-sm font-medium transition-all duration-300 outline-none",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4",
  ),
  {
    variants: {
      variant: {
        default:
          "bg-ink text-ink-inverse hover:bg-brand hover:shadow-[0_10px_30px_-8px_rgba(0,102,255,0.55)]",
        brand:
          "bg-brand text-white hover:bg-brand-navy hover:shadow-[0_10px_30px_-8px_rgba(0,102,255,0.6)]",
        accent:
          "bg-accent text-[#1a1204] hover:bg-accent-soft hover:shadow-[0_10px_30px_-8px_rgba(245,158,11,0.55)]",
        outline:
          "border border-line-strong bg-transparent text-ink hover:border-brand hover:text-brand",
        ghost: "text-ink hover:bg-bg-soft",
        subtle: "bg-bg-soft text-ink hover:bg-line",
        danger: "bg-danger text-white hover:brightness-110",
        link: "text-brand underline-offset-4 hover:underline rounded-none px-0",
        glass:
          "border border-white/15 bg-white/10 text-white backdrop-blur-md hover:bg-white/18",
      },
      size: {
        sm: "h-9 px-4 text-[13px]",
        default: "h-11 px-6",
        lg: "h-13 px-8 text-[15px]",
        icon: "h-10 w-10 p-0",
        "icon-sm": "h-8 w-8 p-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
