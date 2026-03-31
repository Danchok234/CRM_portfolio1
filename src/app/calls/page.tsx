export const dynamic = 'force-dynamic'

"use client";

import { useEffect, useState } from "react";
import { fetchAllCalls } from "@/lib/actions";
import { CallsTable } from "@/components/calls-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CallWithAnalytics } from "@/lib/types";

export default function CallsPage() {
  const [calls, setCalls] = useState<CallWithAnalytics[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sentiment, setSentiment] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const limit = 20;

  useEffect(() => {
    const load = async () => {
      const res = await fetchAllCalls(
        page,
        limit,
        sentiment,
        dateFrom || undefined,
        dateTo || undefined
      );
      setCalls(res.calls);
      setTotal(res.total);
    };
    load();
  }, [page, sentiment, dateFrom, dateTo]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Call Log</h1>

      <div className="flex flex-wrap items-center gap-4">
        <select
          value={sentiment}
          onChange={(e) => {
            setSentiment(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Sentiments</option>
          <option value="Positive">Positive</option>
          <option value="Neutral">Neutral</option>
          <option value="Negative">Negative</option>
        </select>

        <input
          type="date"
          value={dateFrom}
          onChange={(e) => {
            setDateFrom(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="From"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => {
            setDateTo(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="To"
        />
      </div>

      <CallsTable calls={calls} />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
