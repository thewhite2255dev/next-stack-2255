import { cn } from "@/lib/utils";
import { TriangleAlert } from "lucide-react";

interface FormErrorProps extends React.HTMLAttributes<HTMLElement> {
  message?: string;
}

export default function FormError({
  message,
  className,
  ...props
}: FormErrorProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "flex items-center space-x-3 rounded-md bg-destructive p-3 text-sm text-destructive-foreground",
        className,
      )}
      {...props}
    >
      <TriangleAlert className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
}
