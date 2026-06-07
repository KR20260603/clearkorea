import { describe, expect, it } from "vitest";
import { readServerSession } from "./server-session";

describe("readServerSession", () => {
  it("returns null when there is no client (deferred)", async () => {
    expect(await readServerSession(null)).toBeNull();
  });

  it("returns null when there is no authenticated user", async () => {
    const client = { auth: { getUser: async () => ({ data: { user: null } }) } };
    expect(await readServerSession(client)).toBeNull();
  });

  it("returns the auth user id when a session exists", async () => {
    const client = { auth: { getUser: async () => ({ data: { user: { id: "u-9" } } }) } };
    expect(await readServerSession(client)).toEqual({ authUserId: "u-9" });
  });
});
