export const dynamic = 'force-dynamic'

import {
  getSentimentOverTime,
  getCallVolumeByDay,
  getKeywordFrequency,
  getDashboardStats,
} from "@/lib/queries";
import { AnalyticsCharts } from "./analytics-charts";

export default async function AnalyticsPage() {
  const [sentimentData, volumeData, keywordData, stats] = await Promise.all([
    getSentimentOverTime(),
    getCallVolumeByDay(),
    getKeywordFrequency(),
    getDashboardStats(),
  ]);

  const totalFollowUps = stats.pendingFollowUps;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>

      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">Pending Follow-up Rate</p>
        <p className="mt-1 text-3xl font-bold text-card-foreground">
          {totalFollowUps}
        </p>
        <p className="text-xs text-muted-foreground">
          open follow-ups requiring action
        </p>
      </div>

      <AnalyticsCharts
        sentimentData={sentimentData}
        volumeData={volumeData}
        keywordData={keywordData}
      />
    </div>
  );
}
