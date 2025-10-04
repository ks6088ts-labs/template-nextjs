import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "danger" | "ghost";

type BaseProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export type ButtonProps = BaseProps & {
  variant?: Variant;
};

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-500",
  secondary:
    "bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:outline-slate-300",
  danger:
    "bg-red-600 text-white hover:bg-red-500 focus-visible:outline-red-500",
  ghost:
    "bg-transparent text-slate-900 hover:bg-slate-100 focus-visible:outline-slate-300",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, type = "button", variant = "primary", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-70",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = "Button";
