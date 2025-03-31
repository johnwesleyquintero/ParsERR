import { cn } from "@/lib/utils";

interface ErrorBadgeProps {
  type: string;
  className?: string;
}

export function ErrorBadge({ type, className }: ErrorBadgeProps) {
  const colors = {
    error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    warning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    "syntax error":
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  };

  return (
    <span
      className={cn(
        "px-2 py-1 rounded-full text-xs font-medium",
        colors[type as keyof typeof colors] || colors.other,
        className,
      )}
    >
      {type}
    </span>
  );
}
