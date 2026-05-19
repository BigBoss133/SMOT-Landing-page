import { describe, it, expect, vi, beforeEach } from 'vitest';
import { login, register, getMe, createCheckout, getLicenseStatus } from '../services/api';

describe('api', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('login', () => {
    it('sends POST to /auth/login with credentials', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ user: { id: '1', email: 'test@test.com' } }),
      });
      vi.stubGlobal('fetch', mockFetch);

      await login('test@test.com', 'password123');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
        })
      );
    });

    it('throws on non-2xx response', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'Credenziali non valide' }),
      });
      vi.stubGlobal('fetch', mockFetch);

      await expect(login('bad@test.com', 'wrong')).rejects.toThrow('Credenziali non valide');
    });
  });

  describe('register', () => {
    it('sends POST to /auth/register', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ user: { id: '2', email: 'new@test.com' } }),
      });
      vi.stubGlobal('fetch', mockFetch);

      await register('new@test.com', 'password123');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/register'),
        expect.objectContaining({ method: 'POST' })
      );
    });
  });

  describe('getMe', () => {
    it('sends GET to /auth/me with credentials', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: '1', email: 'test@test.com' }),
      });
      vi.stubGlobal('fetch', mockFetch);

      await getMe();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/me'),
        expect.objectContaining({ credentials: 'include' })
      );
    });
  });

  describe('createCheckout', () => {
    it('sends POST to /payments/create-checkout', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ url: 'https://checkout.stripe.com/session' }),
      });
      vi.stubGlobal('fetch', mockFetch);

      await createCheckout('monthly');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/payments/create-checkout'),
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
        })
      );
    });
  });

  describe('getLicenseStatus', () => {
    it('sends GET to /license/status with credentials', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ valid: true, plan: 'monthly', status: 'active', expires_at: '', grace_until: null, blocked: false, days_left: 30, key: 'SMOT-XXXX' }),
      });
      vi.stubGlobal('fetch', mockFetch);

      await getLicenseStatus();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/license/status'),
        expect.objectContaining({ credentials: 'include' })
      );
    });
  });
});