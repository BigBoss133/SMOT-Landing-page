import { describe, it, expect } from "vitest";

describe("App", () => {
  it("should pass a smoke test", () => {
    expect(1 + 1).toBe(2);
  });

  it("should have proper environment", () => {
    expect(typeof window).toBe("object");
  });
});