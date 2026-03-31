"use client";

import { useEffect, useState } from "react";
import { fetchFollowUps, doMarkFollowUpDone } from "@/lib/actions";
import type { FollowUpWithContact } from "@/lib/types";
import { Check } from "lucide-react";
import { formatDate } from "@/lib/utils";

type Filter = "pending" | "completed" | "all";

export default function FollowUpsPage() {
  const [followUps, setFollowUps] = useState<FollowUpWithContact[]>([]);
  const [filter, setFilter] = useState<Filter>("pending");

  const load = async () => {
    const data = await fetchFollowUps(filter);
    setFollowUps(data);
  };

  useEffect(() => {
    load();
  }, [filter]);

  const handleMarkDone = async (id: string) => {
    await doMarkFollowUpDone(id);
    load();
  };

  const isOverdue = (dueDate: string, done: boolean) => {
    if (done) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Follow-ups</h1>

      <div className="flex gap-2">
        {(["pending", "completed", "all"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={
              filter === f
                ? "rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                : "rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
            }
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Notes</th>
              <th className="px-4 py-3 font-medium">Due Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {followUps.map((fu) => (
              <tr
                key={fu.id}
                className={
                  isOverdue(fu.due_date, fu.done)
                    ? "border-b border-border/50 bg-red-500/5"
                    : "border-b border-border/50"
                }
              >
                <td className="px-4 py-3 font-mono text-card-foreground">
                  {fu.contacts?.phone ?? "Unknown"}
                </td>
                <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">
                  {fu.notes ?? "—"}
                </td>
                <td
                  className={
                    isOverdue(fu.due_date, fu.done)
                      ? "px-4 py-3 font-medium text-red-400"
                      : "px-4 py-3 text-muted-foreground"
                  }
                >
                  {formatDate(fu.due_date)}
                  {isOverdue(fu.due_date, fu.done) && (
                    <span className="ml-2 text-xs">Overdue</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      fu.done
                        ? "inline-flex rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400"
                        : "inline-flex rounded-full bg-yellow-500/15 px-2.5 py-0.5 text-xs font-medium text-yellow-400"
                    }
                  >
                    {fu.done ? "Done" : "Pending"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {!fu.done && (
                    <button
                      onClick={() => handleMarkDone(fu.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-500/25"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Mark Done
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {followUps.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No follow-ups found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
