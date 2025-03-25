export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  company_name?: string;
  created_at: string;
  updated_at: string;
  role: 'admin' | 'user';
  status: 'active' | 'suspended' | 'pending';
}

export interface CreditBalance {
  id: string;
  user_id: string;
  balance: number;  // Balance in paise (1 INR = 100 paise)
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;  // Amount in paise
  type: 'credit' | 'debit';
  description: string;
  service: 'whatsapp' | 'email' | 'sms';
  reference_id?: string;  // For tracking specific campaign/message
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export interface ServiceRate {
  service: 'whatsapp' | 'email' | 'sms';
  rate: number;  // Cost in paise per message/email
  bulk_rates?: {
    threshold: number;
    rate: number;
  }[];
}

export interface UserSession {
  id: string;
  user_id: string;
  created_at: string;
  last_active_at: string;
  ip_address: string;
  user_agent: string;
  is_active: boolean;
} 