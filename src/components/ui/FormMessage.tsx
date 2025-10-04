import { cn } from "@/lib/utils";

export type FormMessageProps = {
  message?: string | null;
  className?: string;
};

export function FormMessage({ message, className }: FormMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <p className={cn("text-sm text-red-600", className)} role="alert">
      {message}
    </p>
  );
}
