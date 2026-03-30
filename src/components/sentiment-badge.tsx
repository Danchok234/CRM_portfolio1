import { cn } from "@/lib/utils";

interface SentimentBadgeProps {
  sentiment: "Positive" | "Neutral" | "Negative" | string | null;
}

export function SentimentBadge({ sentiment }: SentimentBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        sentiment === "Positive" && "bg-emerald-500/15 text-emerald-400",
        sentiment === "Neutral" && "bg-yellow-500/15 text-yellow-400",
        sentiment === "Negative" && "bg-red-500/15 text-red-400",
        !sentiment && "bg-gray-500/15 text-gray-400"
      )}
    >
      {sentiment ?? "N/A"}
    </span>
  );
}
