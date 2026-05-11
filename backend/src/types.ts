export interface User {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export interface License {
  id: string;
  user_id: string;
  key: string;
  plan: 'monthly' | 'annual';
  status: 'active' | 'expired' | 'cancelled';
  created_at: string;
  expires_at: string;
  trial_used: boolean;
}

export interface Payment {
  id: string;
  user_id: string;
  license_id: string;
  stripe_session_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'refunded';
  created_at: string;
}

export interface LicenseStatus {
  valid: boolean;
  blocked: boolean;
  grace: boolean;
  plan?: string;
  expires_at?: string;
  grace_until?: string;
}
