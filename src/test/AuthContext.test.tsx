import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { AuthProvider } from "../context/AuthContext";

vi.mock("../services/api", () => ({
  getMe: () => Promise.reject(new Error("no auth")),
}));

describe("AuthProvider", () => {
  it("renders children after loading", async () => {
    render(
      <AuthProvider>
        <div>test</div>
      </AuthProvider>,
    );
    await waitFor(() => {
      expect(screen.getByText("test")).toBeInTheDocument();
    });
  });
});
