"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatMonthDay, formatWeekday } from "@/lib/utils";

interface AnalyticsChartsProps {
  sentimentData: {
    date: string;
    Positive: number;
    Neutral: number;
    Negative: number;
  }[];
  volumeData: { date: string; calls: number }[];
  keywordData: { keyword: string; count: number }[];
}

export function AnalyticsCharts({
  sentimentData,
  volumeData,
  keywordData,
}: AnalyticsChartsProps) {
  const tooltipStyle = {
    backgroundColor: "#1a1a2e",
    border: "1px solid #333",
    borderRadius: "8px",
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-sm font-semibold text-card-foreground">
          Sentiment Over Time
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sentimentData}>
            <XAxis
              dataKey="date"
              tick={{ fill: "#888", fontSize: 12 }}
              tickFormatter={(v) => formatMonthDay(v)}
            />
            <YAxis tick={{ fill: "#888", fontSize: 12 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            <Line
              type="monotone"
              dataKey="Positive"
              stroke="#34d399"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="Neutral"
              stroke="#facc15"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="Negative"
              stroke="#f87171"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-sm font-semibold text-card-foreground">
          Call Volume by Day
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={volumeData}>
            <XAxis
              dataKey="date"
              tick={{ fill: "#888", fontSize: 12 }}
              tickFormatter={(v) =>
                formatWeekday(v)
              }
            />
            <YAxis tick={{ fill: "#888", fontSize: 12 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="calls" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
        <h3 className="mb-4 text-sm font-semibold text-card-foreground">
          Top Keywords
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={keywordData} layout="vertical">
            <XAxis type="number" tick={{ fill: "#888", fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="keyword"
              tick={{ fill: "#888", fontSize: 12 }}
              width={120}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
