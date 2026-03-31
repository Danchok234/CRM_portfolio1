"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SentimentBadge } from "@/components/sentiment-badge";
import { fetchSearchContacts, fetchAllContacts } from "@/lib/actions";
import type { Contact } from "@/lib/types";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 20;

  useEffect(() => {
    const load = async () => {
      const res = search.trim()
        ? await fetchSearchContacts(search.trim(), page, limit)
        : await fetchAllContacts(page, limit);
      setContacts(res.contacts);
      setTotal(res.total);
    };
    load();
  }, [page, search]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Contacts</h1>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by phone or name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full rounded-lg border border-border bg-card py-2 pl-10 pr-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Last Call</th>
              <th className="px-4 py-3 font-medium">Last Sentiment</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr
                key={c.id}
                onClick={() => router.push(`/contacts/${c.id}`)}
                className="cursor-pointer border-b border-border/50 transition-colors hover:bg-secondary/50"
              >
                <td className="px-4 py-3 font-mono text-card-foreground">
                  {c.phone}
                </td>
                <td className="px-4 py-3 text-card-foreground">
                  {c.name ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      c.status === "new"
                        ? "inline-flex rounded-full bg-blue-500/15 px-2.5 py-0.5 text-xs font-medium text-blue-400"
                        : c.status === "active"
                          ? "inline-flex rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400"
                          : "inline-flex rounded-full bg-gray-500/15 px-2.5 py-0.5 text-xs font-medium text-gray-400"
                    }
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {c.last_call_at
                    ? formatDate(c.last_call_at)
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <SentimentBadge sentiment={c.last_sentiment} />
                </td>
              </tr>
            ))}
            {contacts.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No contacts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
