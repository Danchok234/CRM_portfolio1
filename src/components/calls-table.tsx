"use client";

import { useRouter } from "next/navigation";
import { SentimentBadge } from "./sentiment-badge";
import { AlertCircle } from "lucide-react";
import type { CallWithAnalytics } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface CallsTableProps {
  calls: CallWithAnalytics[];
}

export function CallsTable({ calls }: CallsTableProps) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-muted-foreground">
            <th className="px-4 py-3 font-medium">Phone</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Sentiment</th>
            <th className="px-4 py-3 font-medium">Summary</th>
            <th className="px-4 py-3 font-medium">Follow-up</th>
          </tr>
        </thead>
        <tbody>
          {calls.map((call) => (
            <tr
              key={call.id}
              onClick={() => router.push(`/calls/${call.id}`)}
              className="cursor-pointer border-b border-border/50 transition-colors hover:bg-secondary/50"
            >
              <td className="px-4 py-3 font-mono text-card-foreground">
                {call.caller_phone}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatDate(call.created_at)}
              </td>
              <td className="px-4 py-3">
                <SentimentBadge
                  sentiment={call.call_analytics?.sentiment_score ?? null}
                />
              </td>
              <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">
                {call.call_analytics?.executive_summary ?? "—"}
              </td>
              <td className="px-4 py-3">
                {call.call_analytics?.requires_follow_up && (
                  <AlertCircle className="h-4 w-4 text-yellow-400" />
                )}
              </td>
            </tr>
          ))}
          {calls.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-8 text-center text-muted-foreground"
              >
                No calls found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
