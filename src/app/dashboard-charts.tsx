"use client";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatWeekday } from "@/lib/utils";

const SENTIMENT_COLORS: Record<string, string> = {
  Positive: "#34d399",
  Neutral: "#facc15",
  Negative: "#f87171",
};

interface DashboardChartsProps {
  sentimentData: { date: string; Positive: number; Neutral: number; Negative: number }[];
  volumeData: { date: string; calls: number }[];
}

export function DashboardCharts({ sentimentData, volumeData }: DashboardChartsProps) {
  const sentimentTotals = sentimentData.reduce(
    (acc, d) => ({
      Positive: acc.Positive + d.Positive,
      Neutral: acc.Neutral + d.Neutral,
      Negative: acc.Negative + d.Negative,
    }),
    { Positive: 0, Neutral: 0, Negative: 0 }
  );

  const pieData = Object.entries(sentimentTotals).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <>
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-sm font-semibold text-card-foreground">
          Sentiment Distribution
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              dataKey="value"
              label={({ name, percent }: { name?: string; percent?: number }) =>
                `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`
              }
            >
              {pieData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={SENTIMENT_COLORS[entry.name]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a2e",
                border: "1px solid #333",
                borderRadius: "8px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-sm font-semibold text-card-foreground">
          Call Volume (Last 7 Days)
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={volumeData}>
            <XAxis
              dataKey="date"
              tick={{ fill: "#888", fontSize: 12 }}
              tickFormatter={(v) => formatWeekday(v)}
            />
            <YAxis tick={{ fill: "#888", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a2e",
                border: "1px solid #333",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="calls" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
