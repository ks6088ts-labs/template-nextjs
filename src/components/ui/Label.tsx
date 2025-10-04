import type { DetailedHTMLProps, LabelHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type BaseProps = DetailedHTMLProps<
  LabelHTMLAttributes<HTMLLabelElement>,
  HTMLLabelElement
>;

export type LabelProps = Omit<BaseProps, "children" | "htmlFor"> & {
  htmlFor: string;
  children: ReactNode;
};

export function Label({ className, htmlFor, children, ...props }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("block text-sm font-medium text-slate-700", className)}
      {...props}
    >
      {children}
    </label>
  );
}
