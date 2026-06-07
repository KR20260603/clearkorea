import { resolveRoleForIdentity, type ProviderIdentity } from "./role-resolver";
import type { UserRoleRepository } from "./role-repository";
import type { AppRole, ManagedRole } from "./roles";

type RoleSyncEnv = Readonly<Record<string, string | undefined>>;

export type RoleSyncResult = {
  readonly previousRole: AppRole | null;
  readonly nextRole: ManagedRole;
  readonly changed: boolean;
};

export async function syncRoleOnLogin(input: {
  readonly authUserId: string;
  readonly identity: ProviderIdentity;
  readonly repository: UserRoleRepository;
  readonly env?: RoleSyncEnv;
}): Promise<RoleSyncResult> {
  const nextRole = resolveRoleForIdentity(input.identity, input.env);
  const previousRole = await input.repository.getRole(input.authUserId);

  if (previousRole === nextRole) {
    return { previousRole, nextRole, changed: false };
  }

  await input.repository.setRole(input.authUserId, nextRole);
  return { previousRole, nextRole, changed: true };
}
