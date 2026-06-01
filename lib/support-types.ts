export interface SupportRequest {
  id: string;
  user_id: string;
  type: string;
  subject: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  user_name?: string;
  user_email?: string;
  reply_count?: number;
  latest_reply_at?: string;
}

export interface SupportReply {
  id: string;
  request_id: string;
  user_id: string;
  message: string;
  created_at: string;
  user_name?: string;
  user_role?: string;
}

export const SUPPORT_TYPES = [
  { value: "financial_assistance", label: "Financial Assistance" },
  { value: "general_support", label: "General Support" },
  { value: "other", label: "Other" },
] as const;
