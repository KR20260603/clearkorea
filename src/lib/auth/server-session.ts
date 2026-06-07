import type { AppSessionIdentity } from "./app-entry";

export type SessionClient = {
  auth: { getUser(): PromiseLike<{ data: { user: { id: string } | null } }> };
};

export async function readServerSession(
  client: SessionClient | null,
): Promise<AppSessionIdentity | null> {
  if (!client) {
    return null;
  }
  const { data } = await client.auth.getUser();
  return data.user ? { authUserId: data.user.id } : null;
}
