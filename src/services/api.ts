const BASE = "http://localhost:3000/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

export function register(email: string, password: string) {
  return request<{ token: string; user: { id: string; email: string } }>(
    "/auth/register",
    { method: "POST", body: JSON.stringify({ email, password }) }
  );
}

export function login(email: string, password: string) {
  return request<{ token: string; user: { id: string; email: string } }>(
    "/auth/login",
    { method: "POST", body: JSON.stringify({ email, password }) }
  );
}

export function getMe(token: string) {
  return request<{ id: string; email: string }>("/auth/me", {
    headers: authHeaders(token),
  });
}

export interface LicenseStatus {
  valid: boolean;
  plan: string;
  status: string;
  expires_at: string;
  grace_until: string | null;
  blocked: boolean;
  days_left: number;
  key: string;
}

export function getLicenseStatus(token: string) {
  return request<LicenseStatus>("/license/status", {
    headers: authHeaders(token),
  });
}

export function createCheckout(token: string, plan: "monthly" | "annual") {
  return request<{ url: string }>("/payments/create-checkout", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ plan }),
  });
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
}

export function getPaymentHistory(token: string) {
  return request<{ payments: Payment[] }>("/payments/history", {
    headers: authHeaders(token),
  });
}
