import { getSupabase } from "./supabase";
import type {
  CallWithAnalytics,
  ContactWithCalls,
  FollowUpWithContact,
} from "./types";

function normalizeCallRow(row: Record<string, unknown>): CallWithAnalytics {
  return {
    ...row,
    call_analytics: Array.isArray(row.call_analytics)
      ? (row.call_analytics as Record<string, unknown>[])[0] ?? null
      : row.call_analytics ?? null,
  } as CallWithAnalytics;
}

export async function getDashboardStats() {
  const supabase = getSupabase();
  const [callsRes, analyticsRes, followUpsRes, contactsRes] = await Promise.all(
    [
      supabase
        .from("inbound_calls")
        .select("id", { count: "exact", head: true }),
      supabase.from("call_analytics").select("sentiment_score"),
      supabase
        .from("follow_ups")
        .select("id", { count: "exact", head: true })
        .eq("done", false),
      supabase
        .from("contacts")
        .select("id", { count: "exact", head: true })
        .eq("status", "new"),
    ]
  );

  const totalCalls = callsRes.count ?? 0;
  const sentiments = analyticsRes.data ?? [];
  const positiveCount = sentiments.filter(
    (s) => s.sentiment_score === "Positive"
  ).length;
  const positivePercent =
    sentiments.length > 0
      ? Math.round((positiveCount / sentiments.length) * 100)
      : 0;
  const pendingFollowUps = followUpsRes.count ?? 0;
  const newContacts = contactsRes.count ?? 0;

  return { totalCalls, positivePercent, pendingFollowUps, newContacts };
}

export async function getRecentCalls(
  limit = 10
): Promise<CallWithAnalytics[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("inbound_calls")
    .select("*, call_analytics(*)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getRecentCalls:", error.message);
    return [];
  }

  return (data ?? []).map(normalizeCallRow);
}

export async function getAllCalls(
  page = 1,
  limit = 20,
  sentimentFilter?: string,
  dateFrom?: string,
  dateTo?: string
) {
  const supabase = getSupabase();
  let query = supabase
    .from("inbound_calls")
    .select("*, call_analytics(*)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (dateFrom) query = query.gte("created_at", dateFrom);
  if (dateTo) query = query.lte("created_at", dateTo);

  const { data, error, count } = await query;
  if (error) {
    console.error("getAllCalls:", error.message);
    return { calls: [] as CallWithAnalytics[], total: 0 };
  }

  let calls = (data ?? []).map(normalizeCallRow);

  if (sentimentFilter && sentimentFilter !== "all") {
    calls = calls.filter(
      (c) => c.call_analytics?.sentiment_score === sentimentFilter
    );
  }

  return { calls, total: count ?? 0 };
}

export async function getCallById(
  id: string
): Promise<CallWithAnalytics | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("inbound_calls")
    .select("*, call_analytics(*)")
    .eq("id", id)
    .single();

  if (error) return null;
  return normalizeCallRow(data);
}

export async function getAllContacts(page = 1, limit = 20) {
  const supabase = getSupabase();
  const { data, error, count } = await supabase
    .from("contacts")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) {
    console.error("getAllContacts:", error.message);
    return { contacts: [], total: 0 };
  }
  return { contacts: data ?? [], total: count ?? 0 };
}

export async function getContactById(
  id: string
): Promise<ContactWithCalls | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("contacts")
    .select("*, inbound_calls(*, call_analytics(*))")
    .eq("id", id)
    .single();

  if (error) return null;

  return {
    ...data,
    inbound_calls: (data.inbound_calls ?? []).map(
      (call: Record<string, unknown>) => normalizeCallRow(call)
    ),
  } as ContactWithCalls;
}

export async function updateContact(
  id: string,
  fields: { name?: string; email?: string; company?: string }
) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("contacts")
    .update(fields)
    .eq("id", id);
  if (error) console.error("updateContact:", error.message);
}

export async function getFollowUps(
  doneFilter?: "pending" | "completed" | "all"
): Promise<FollowUpWithContact[]> {
  const supabase = getSupabase();
  let query = supabase
    .from("follow_ups")
    .select("*, contacts(*)")
    .order("due_date", { ascending: true });

  if (doneFilter === "pending") query = query.eq("done", false);
  if (doneFilter === "completed") query = query.eq("done", true);

  const { data, error } = await query;
  if (error) {
    console.error("getFollowUps:", error.message);
    return [];
  }
  return (data ?? []) as FollowUpWithContact[];
}

export async function markFollowUpDone(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("follow_ups")
    .update({ done: true })
    .eq("id", id);
  if (error) console.error("markFollowUpDone:", error.message);
}

export async function getSentimentOverTime() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("call_analytics")
    .select("sentiment_score, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getSentimentOverTime:", error.message);
    return [];
  }

  const grouped: Record<string, { Positive: number; Neutral: number; Negative: number }> = {};
  for (const row of data ?? []) {
    const date = new Date(row.created_at).toISOString().split("T")[0];
    if (!grouped[date])
      grouped[date] = { Positive: 0, Neutral: 0, Negative: 0 };
    const sentiment = row.sentiment_score as "Positive" | "Neutral" | "Negative";
    grouped[date][sentiment]++;
  }

  return Object.entries(grouped).map(([date, counts]) => ({
    date,
    ...counts,
  }));
}

export async function getCallVolumeByDay() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("inbound_calls")
    .select("created_at")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getCallVolumeByDay:", error.message);
    return [];
  }

  const grouped: Record<string, number> = {};
  for (const row of data ?? []) {
    const date = new Date(row.created_at).toISOString().split("T")[0];
    grouped[date] = (grouped[date] || 0) + 1;
  }

  const entries = Object.entries(grouped);
  const last7 = entries.slice(-7);
  return last7.map(([date, count]) => ({ date, calls: count }));
}

export async function getKeywordFrequency() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("call_analytics")
    .select("extracted_keywords");

  if (error) {
    console.error("getKeywordFrequency:", error.message);
    return [];
  }

  const freq: Record<string, number> = {};
  for (const row of data ?? []) {
    const keywords = row.extracted_keywords as string[] | null;
    if (!keywords) continue;
    for (const kw of keywords) {
      freq[kw] = (freq[kw] || 0) + 1;
    }
  }

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([keyword, count]) => ({ keyword, count }));
}

export async function searchContacts(query: string, page = 1, limit = 20) {
  const supabase = getSupabase();
  const { data, error, count } = await supabase
    .from("contacts")
    .select("*", { count: "exact" })
    .or(`phone.ilike.%${query}%,name.ilike.%${query}%`)
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) {
    console.error("searchContacts:", error.message);
    return { contacts: [], total: 0 };
  }
  return { contacts: data ?? [], total: count ?? 0 };
}
