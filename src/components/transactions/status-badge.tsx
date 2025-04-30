
import { cn } from "@/lib/utils";
import { getStatusColor } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusLower = status.toLowerCase();
  
  const getBgColor = () => {
    if (statusLower === "success") return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    if (statusLower === "failed" || statusLower === "failure") return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    if (statusLower === "pending") return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    return "bg-gray-100 text-gray-800 dark:bg-gray-800/60 dark:text-gray-400";
  };
  
  return (
    <span 
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
        getBgColor(),
        className
      )}
    >
      {statusLower}
    </span>
  );
}
