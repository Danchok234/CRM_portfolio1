export interface InboundCall {
  id: string;
  twilio_call_sid: string;
  caller_phone: string;
  recording_url: string | null;
  call_status: string;
  duration_seconds: number;
  created_at: string;
  contact_id: string | null;
}

export interface CallAnalytics {
  id: string;
  call_id: string;
  full_transcript: string | null;
  sentiment_score: "Positive" | "Neutral" | "Negative";
  executive_summary: string | null;
  extracted_keywords: string[];
  requires_follow_up: boolean;
  created_at: string;
}

export interface Contact {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
  company: string | null;
  status: "new" | "active" | "closed";
  last_call_id: string | null;
  last_sentiment: string | null;
  last_call_at: string | null;
  created_at: string;
}

export interface FollowUp {
  id: string;
  contact_id: string;
  call_id: string;
  notes: string | null;
  due_date: string;
  done: boolean;
  created_at: string;
}

export interface CallWithAnalytics extends InboundCall {
  call_analytics: CallAnalytics | null;
}

export interface ContactWithCalls extends Contact {
  inbound_calls: CallWithAnalytics[];
}

export interface FollowUpWithContact extends FollowUp {
  contacts: Contact | null;
}
