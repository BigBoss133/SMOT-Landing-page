const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options?.headers },
    credentials: "include",
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export function register(email: string, password: string) {
  return request<{ user: { id: string; email: string } }>(
    "/auth/register",
    { method: "POST", body: JSON.stringify({ email, password }) }
  );
}

export function login(email: string, password: string) {
  return request<{ user: { id: string; email: string } }>(
    "/auth/login",
    { method: "POST", body: JSON.stringify({ email, password }) }
  );
}

export function getMe() {
  return request<{ id: string; email: string }>("/auth/me");
}

export function logout() {
  return request<{ ok: boolean }>("/auth/logout", { method: "POST" });
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

export function getLicenseStatus() {
  return request<LicenseStatus>("/license/status");
}

export function createCheckout(plan: "monthly" | "annual") {
  return request<{ url: string }>("/payments/create-checkout", {
    method: "POST",
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

export function getPaymentHistory() {
  return request<{ payments: Payment[] }>("/payments/history");
}
