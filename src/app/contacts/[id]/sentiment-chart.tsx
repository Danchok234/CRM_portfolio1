"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { CallWithAnalytics } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const SENTIMENT_MAP: Record<string, number> = {
  Positive: 3,
  Neutral: 2,
  Negative: 1,
};

interface ContactSentimentChartProps {
  calls: CallWithAnalytics[];
}

export function ContactSentimentChart({ calls }: ContactSentimentChartProps) {
  const data = calls
    .filter((c) => c.call_analytics?.sentiment_score)
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
    .map((c) => ({
      date: formatDate(c.created_at),
      sentiment: SENTIMENT_MAP[c.call_analytics!.sentiment_score] ?? 2,
      label: c.call_analytics!.sentiment_score,
    }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <XAxis dataKey="date" tick={{ fill: "#888", fontSize: 12 }} />
        <YAxis
          domain={[0.5, 3.5]}
          ticks={[1, 2, 3]}
          tickFormatter={(v) =>
            v === 3 ? "Positive" : v === 2 ? "Neutral" : "Negative"
          }
          tick={{ fill: "#888", fontSize: 11 }}
          width={70}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1a1a2e",
            border: "1px solid #333",
            borderRadius: "8px",
          }}
          formatter={(_: unknown, __: unknown, entry: { payload?: { label?: string } }) => [
            entry.payload?.label,
            "Sentiment",
          ]}
        />
        <Line
          type="monotone"
          dataKey="sentiment"
          stroke="#6366f1"
          strokeWidth={2}
          dot={{ fill: "#6366f1", r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
