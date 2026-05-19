import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const ORIGINAL_VITE_API_URL = import.meta.env.VITE_API_URL;

beforeEach(() => {
  vi.restoreAllMocks();
});

afterEach(() => {
  vi.stubEnv("VITE_API_URL", ORIGINAL_VITE_API_URL);
});

describe("API service", () => {
  it("register sends POST with email and password", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ user: { id: "1", email: "test@test.com" } }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const { register } = await import("../services/api");
    const result = await register("test@test.com", "password123");

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/auth/register",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "test@test.com", password: "password123" }),
      }),
    );
    expect(result.user.email).toBe("test@test.com");
  });

  it("login sends POST and returns user", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ user: { id: "1", email: "a@b.com" } }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const { login } = await import("../services/api");
    const result = await login("a@b.com", "pass");

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/auth/login",
      expect.objectContaining({ method: "POST" }),
    );
    expect(result.user.email).toBe("a@b.com");
  });

  it("getMe returns user data", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: "1", email: "a@b.com" }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const { getMe } = await import("../services/api");
    const result = await getMe();

    expect(mockFetch).toHaveBeenCalledWith("/api/auth/me", expect.any(Object));
    expect(result.email).toBe("a@b.com");
  });

  it("logout returns ok", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const { logout } = await import("../services/api");
    const result = await logout();

    expect(result.ok).toBe(true);
  });

  it("getLicenseStatus returns license data", async () => {
    const mockData = {
      valid: true,
      plan: "monthly",
      status: "active",
      expires_at: "2026-06-13",
      grace_until: null,
      blocked: false,
      days_left: 28,
      key: "XXXX-XXXX-XXXX-XXXX",
    };
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });
    vi.stubGlobal("fetch", mockFetch);

    const { getLicenseStatus } = await import("../services/api");
    const result = await getLicenseStatus();

    expect(result.valid).toBe(true);
    expect(result.plan).toBe("monthly");
    expect(result.key).toMatch(/^[A-Z0-9-]+$/);
  });

  it("createCheckout returns URL", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ url: "https://checkout.stripe.com/test" }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const { createCheckout } = await import("../services/api");
    const result = await createCheckout("monthly");

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/payments/create-checkout",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ plan: "monthly" }),
      }),
    );
    expect(result.url).toContain("stripe.com");
  });

  it("getPaymentHistory returns payments", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        payments: [
          { id: "p1", amount: 999, currency: "eur", status: "completed", created_at: "2026-05-01" },
        ],
      }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const { getPaymentHistory } = await import("../services/api");
    const result = await getPaymentHistory();

    expect(result.payments).toHaveLength(1);
    expect(result.payments[0].amount).toBe(999);
  });

  it("throws on HTTP error", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Email già registrata" }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const { register } = await import("../services/api");
    await expect(register("dup@test.com", "pass")).rejects.toThrow("Email già registrata");
  });

  it("includes credentials in requests", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const { logout } = await import("../services/api");
    await logout();

    const callArgs = mockFetch.mock.calls[0];
    expect(callArgs[0]).toBe("/api/auth/logout");
    expect(callArgs[1].credentials).toBe("include");
    expect(callArgs[1].method).toBe("POST");
  });
});
