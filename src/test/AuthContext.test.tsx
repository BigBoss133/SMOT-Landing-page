import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "../context/AuthContext";

const mockGetMe = vi.fn();
const mockLogin = vi.fn();
const mockRegister = vi.fn();
const mockLogout = vi.fn();

vi.mock("../services/api", () => ({
  getMe: (...args: unknown[]) => mockGetMe(...args),
  login: (...args: unknown[]) => mockLogin(...args),
  register: (...args: unknown[]) => mockRegister(...args),
  logout: (...args: unknown[]) => mockLogout(...args),
}));

function TestConsumer() {
  const { user, isAuthenticated, login, register, logout } = useAuth();
  return (
    <div>
      <span data-testid="auth-status">{isAuthenticated ? "logged-in" : "logged-out"}</span>
      <span data-testid="user-email">{user?.email ?? "none"}</span>
      <button data-testid="btn-login" onClick={() => login("a@b.com", "pass")}>Login</button>
      <button data-testid="btn-register" onClick={() => register("new@b.com", "pass")}>Register</button>
      <button data-testid="btn-logout" onClick={() => logout()}>Logout</button>
    </div>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(cleanup);

describe("AuthProvider", () => {
  it("renders children after loading", async () => {
    mockGetMe.mockRejectedValue(new Error("no auth"));

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent("logged-out");
    });
  });

  it("shows authenticated when getMe succeeds", async () => {
    mockGetMe.mockResolvedValue({ id: "1", email: "a@b.com" });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent("logged-in");
      expect(screen.getByTestId("user-email")).toHaveTextContent("a@b.com");
    });
  });

  it("login sets user", async () => {
    mockGetMe.mockRejectedValue(new Error("no auth"));
    mockLogin.mockResolvedValue({ user: { id: "2", email: "a@b.com" } });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );
    await waitFor(() => expect(screen.getByTestId("auth-status")).toHaveTextContent("logged-out"));

    await userEvent.click(screen.getByTestId("btn-login"));
    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent("logged-in");
      expect(screen.getByTestId("user-email")).toHaveTextContent("a@b.com");
    });
  });

  it("logout clears user", async () => {
    mockGetMe.mockResolvedValue({ id: "1", email: "a@b.com" });
    mockLogout.mockResolvedValue({ ok: true });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );
    await waitFor(() => expect(screen.getByTestId("auth-status")).toHaveTextContent("logged-in"));

    await userEvent.click(screen.getByTestId("btn-logout"));
    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent("logged-out");
      expect(screen.getByTestId("user-email")).toHaveTextContent("none");
    });
  });

  it("register sets user", async () => {
    mockGetMe.mockRejectedValue(new Error("no auth"));
    mockRegister.mockResolvedValue({ user: { id: "3", email: "new@b.com" } });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );
    await waitFor(() => expect(screen.getByTestId("auth-status")).toHaveTextContent("logged-out"));

    await userEvent.click(screen.getByTestId("btn-register"));
    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent("logged-in");
      expect(screen.getByTestId("user-email")).toHaveTextContent("new@b.com");
    });
  });
});
