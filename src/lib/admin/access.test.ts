import { describe, expect, it } from "vitest";
import {
  authorizeAdminAction,
  canAccessAdmin,
  canManageSuperSettings,
  canReviewQueues,
} from "./access";

describe("admin role access", () => {
  it("grants admin area access to admin and super only", () => {
    expect(canAccessAdmin("super")).toBe(true);
    expect(canAccessAdmin("admin")).toBe(true);
    expect(canAccessAdmin("user")).toBe(false);
    expect(canAccessAdmin("guest")).toBe(false);
  });

  it("lets admins and supers review queues", () => {
    expect(canReviewQueues("admin")).toBe(true);
    expect(canReviewQueues("super")).toBe(true);
    expect(canReviewQueues("user")).toBe(false);
  });

  it("restricts super settings to super admins only", () => {
    expect(canManageSuperSettings("super")).toBe(true);
    expect(canManageSuperSettings("admin")).toBe(false);
    expect(canManageSuperSettings("user")).toBe(false);
  });
});

describe("authorizeAdminAction", () => {
  it("lets a regular admin process tips and moderation queues", () => {
    expect(authorizeAdminAction("admin", "tip.approve")).toBe(true);
    expect(authorizeAdminAction("admin", "tip.reject")).toBe(true);
    expect(authorizeAdminAction("admin", "moderation.restore")).toBe(true);
    expect(authorizeAdminAction("admin", "moderation.remove")).toBe(true);
  });

  it("blocks a regular admin from admin-application review and super settings", () => {
    expect(authorizeAdminAction("admin", "application.approve")).toBe(false);
    expect(authorizeAdminAction("admin", "application.demote")).toBe(false);
    expect(authorizeAdminAction("admin", "settings.update")).toBe(false);
  });

  it("lets a super admin perform every admin action", () => {
    expect(authorizeAdminAction("super", "application.approve")).toBe(true);
    expect(authorizeAdminAction("super", "application.demote")).toBe(true);
    expect(authorizeAdminAction("super", "settings.update")).toBe(true);
    expect(authorizeAdminAction("super", "tip.approve")).toBe(true);
  });

  it("blocks non-admins from every action", () => {
    expect(authorizeAdminAction("user", "tip.approve")).toBe(false);
    expect(authorizeAdminAction("guest", "moderation.restore")).toBe(false);
  });
});
