import { cn } from "@/lib/utils";
import { CircleCheck } from "lucide-react";

interface FormSuccessProps extends React.HTMLAttributes<HTMLElement> {
  message?: string;
}

export default function FormSuccess({
  message,
  className,
  ...props
}: FormSuccessProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "flex items-center space-x-3 rounded-md bg-success p-3 text-sm text-success-foreground",
        className,
      )}
      {...props}
    >
      <CircleCheck className="size-4" />
      <span>{message}</span>
    </div>
  );
}
