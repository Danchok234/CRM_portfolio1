import { Phone, SmilePlus, Bell, UserPlus } from "lucide-react";
import { KpiCard } from "@/components/kpi-card";
import { CallsTable } from "@/components/calls-table";
import {
  getDashboardStats,
  getRecentCalls,
  getSentimentOverTime,
  getCallVolumeByDay,
} from "@/lib/queries";
import { DashboardCharts } from "./dashboard-charts";

export default async function DashboardPage() {
  const [stats, recentCalls, sentimentData, volumeData] = await Promise.all([
    getDashboardStats(),
    getRecentCalls(10),
    getSentimentOverTime(),
    getCallVolumeByDay(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Calls"
          value={stats.totalCalls}
          icon={Phone}
          trend="neutral"
        />
        <KpiCard
          title="Positive Sentiment"
          value={`${stats.positivePercent}%`}
          icon={SmilePlus}
          trend={stats.positivePercent >= 50 ? "up" : "down"}
        />
        <KpiCard
          title="Pending Follow-ups"
          value={stats.pendingFollowUps}
          icon={Bell}
          trend={stats.pendingFollowUps > 0 ? "down" : "up"}
        />
        <KpiCard
          title="New Contacts"
          value={stats.newContacts}
          icon={UserPlus}
          trend="up"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCharts
          sentimentData={sentimentData}
          volumeData={volumeData}
        />
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Recent Calls</h2>
        <CallsTable calls={recentCalls} />
      </div>
    </div>
  );
}
