"use client";

import { useEffect, useState, use } from "react";
import { fetchCallById } from "@/lib/actions";
import { SentimentBadge } from "@/components/sentiment-badge";
import type { CallWithAnalytics } from "@/lib/types";
import { Phone, Clock, AlertCircle } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default function CallDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [call, setCall] = useState<CallWithAnalytics | null>(null);

  useEffect(() => {
    fetchCallById(id).then(setCall);
  }, [id]);

  if (!call) {
    return <div className="text-muted-foreground">Loading...</div>;
  }

  const analytics = call.call_analytics;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Call Details</h1>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Caller</p>
              <p className="font-mono text-card-foreground">
                {call.caller_phone}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Date</p>
            <p className="text-card-foreground">
              {formatDateTime(call.created_at)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="text-card-foreground">
                {Math.floor(call.duration_seconds / 60)}m{" "}
                {call.duration_seconds % 60}s
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Status</p>
            <p className="text-card-foreground">{call.call_status}</p>
          </div>
        </div>
      </div>

      {analytics && (
        <>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <h2 className="text-lg font-semibold text-card-foreground">
                Analysis
              </h2>
              <SentimentBadge sentiment={analytics.sentiment_score} />
              {analytics.requires_follow_up && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/15 px-2.5 py-0.5 text-xs font-medium text-yellow-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Requires Follow-up
                </span>
              )}
            </div>

            {analytics.executive_summary && (
              <div className="mb-4">
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                  Executive Summary
                </h3>
                <p className="text-sm leading-relaxed text-card-foreground">
                  {analytics.executive_summary}
                </p>
              </div>
            )}

            {analytics.extracted_keywords &&
              analytics.extracted_keywords.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                    Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analytics.extracted_keywords.map((kw) => (
                      <span
                        key={kw}
                        className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {analytics.full_transcript && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-3 text-lg font-semibold text-card-foreground">
                Transcript
              </h2>
              <div className="max-h-96 overflow-y-auto rounded-lg bg-secondary p-4">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed text-card-foreground">
                  {analytics.full_transcript}
                </pre>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
