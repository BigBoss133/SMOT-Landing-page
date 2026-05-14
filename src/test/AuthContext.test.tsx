import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthProvider } from "../context/AuthContext";

describe("AuthProvider", () => {
  it("renders children", () => {
    render(
      <AuthProvider>
        <div>test</div>
      </AuthProvider>,
    );
    expect(screen.getByText("test")).toBeInTheDocument();
  });
});
