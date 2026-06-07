import { describe, expect, it } from "vitest";
import { buildAdminApplication } from "./admin-application";

const validForm = {
  name: "Hong Gildong",
  region: "Seoul",
  contact: "contact@channel.example",
  intro: "Long-time civic volunteer focused on transparency.",
  reason: "I want to help verify reports and rally updates.",
};

describe("buildAdminApplication", () => {
  it("builds a pending application for a linked Kakao/Naver user", () => {
    const result = buildAdminApplication("user-uuid-1", validForm);

    expect(result.kind).toBe("ready");
    if (result.kind !== "ready") return;
    expect(result.insert).toMatchObject({
      user_id: "user-uuid-1",
      status: "pending",
      name: "Hong Gildong",
      region: "Seoul",
    });
  });

  it("rejects an application without a linked user id", () => {
    expect(buildAdminApplication("", validForm).kind).toBe("invalid");
    expect(buildAdminApplication("   ", validForm).kind).toBe("invalid");
  });

  it("rejects an application with an empty or whitespace field", () => {
    expect(buildAdminApplication("user-1", { ...validForm, name: "   " }).kind).toBe(
      "invalid",
    );
    expect(buildAdminApplication("user-1", { ...validForm, reason: "" }).kind).toBe(
      "invalid",
    );
  });

  it("trims surrounding whitespace from accepted fields", () => {
    const result = buildAdminApplication("user-1", {
      ...validForm,
      name: "  Hong Gildong  ",
    });

    expect(result.kind).toBe("ready");
    if (result.kind !== "ready") return;
    expect(result.insert.name).toBe("Hong Gildong");
  });
});
