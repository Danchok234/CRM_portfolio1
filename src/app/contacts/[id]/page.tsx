"use client";

import { useEffect, useState, use } from "react";
import { fetchContactById, doUpdateContact } from "@/lib/actions";
import { CallsTable } from "@/components/calls-table";
import { SentimentBadge } from "@/components/sentiment-badge";
import { ContactSentimentChart } from "./sentiment-chart";
import type { ContactWithCalls } from "@/lib/types";
import { Save } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [contact, setContact] = useState<ContactWithCalls | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContactById(id).then((c) => {
      if (c) {
        setContact(c);
        setName(c.name ?? "");
        setEmail(c.email ?? "");
        setCompany(c.company ?? "");
      }
    });
  }, [id]);

  if (!contact) {
    return <div className="text-muted-foreground">Loading...</div>;
  }

  const handleSave = async () => {
    setSaving(true);
    await doUpdateContact(id, { name, email, company });
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-card-foreground">
              {contact.phone}
            </h1>
            <div className="mt-2 flex items-center gap-3">
              <span
                className={
                  contact.status === "new"
                    ? "inline-flex rounded-full bg-blue-500/15 px-2.5 py-0.5 text-xs font-medium text-blue-400"
                    : contact.status === "active"
                      ? "inline-flex rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400"
                      : "inline-flex rounded-full bg-gray-500/15 px-2.5 py-0.5 text-xs font-medium text-gray-400"
                }
              >
                {contact.status}
              </span>
              <SentimentBadge sentiment={contact.last_sentiment} />
              <span className="text-sm text-muted-foreground">
                Since {formatDate(contact.created_at)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Company
            </label>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {contact.inbound_calls.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-sm font-semibold text-card-foreground">
            Sentiment Trend
          </h2>
          <ContactSentimentChart calls={contact.inbound_calls} />
        </div>
      )}

      <div>
        <h2 className="mb-4 text-lg font-semibold">Call History</h2>
        <CallsTable calls={contact.inbound_calls} />
      </div>
    </div>
  );
}
