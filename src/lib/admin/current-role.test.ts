import { describe, expect, it } from "vitest";
import { resolveCurrentAdmin, type AdminRoleClient } from "./current-role";

function fakeClient(user: { id: string } | null, role: string | null): AdminRoleClient {
  return {
    auth: { getUser: async () => ({ data: { user } }) },
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({
            data: role ? { role: role as never } : null,
            error: null,
          }),
        }),
      }),
    }),
  };
}

describe("resolveCurrentAdmin", () => {
  it("returns user with no session when the client is null (deferred integration)", async () => {
    expect(await resolveCurrentAdmin(null)).toEqual({ role: "user", authUserId: null });
  });

  it("returns user when there is no authenticated session", async () => {
    expect(await resolveCurrentAdmin(fakeClient(null, "super"))).toEqual({
      role: "user",
      authUserId: null,
    });
  });

  it("returns the stored role for an authenticated admin", async () => {
    expect(await resolveCurrentAdmin(fakeClient({ id: "u1" }, "super"))).toEqual({
      role: "super",
      authUserId: "u1",
    });
  });

  it("defaults to user when the account has no role row", async () => {
    expect(await resolveCurrentAdmin(fakeClient({ id: "u2" }, null))).toEqual({
      role: "user",
      authUserId: "u2",
    });
  });
});
