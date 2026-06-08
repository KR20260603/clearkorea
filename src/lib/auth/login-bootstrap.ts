import { generateNickname } from "../nickname/generate-nickname";
import type { ProviderIdentityDetails } from "./provider-identity";
import type { UserProfileWriter } from "./profile-repository";
import type { UserRoleRepository } from "./role-repository";
import { syncRoleOnLogin, type RoleSyncResult } from "./role-sync";

type BootstrapEnv = Readonly<Record<string, string | undefined>>;

export type LoginBootstrapResult = {
  readonly created: boolean;
  readonly role: RoleSyncResult;
};

// Runs once per login (from the OAuth callback) with a trusted service-role
// client. It guarantees a public.users row exists for the linked member, then
// reconciles the managed role against the provider-qualified allowlists.
export async function bootstrapUserOnLogin(input: {
  readonly authUserId: string;
  readonly identity: ProviderIdentityDetails;
  readonly profiles: UserProfileWriter;
  readonly roles: UserRoleRepository;
  readonly nickname?: string;
  readonly env?: BootstrapEnv;
}): Promise<LoginBootstrapResult> {
  let created = false;
  if (!(await input.profiles.hasProfile(input.authUserId))) {
    created = await input.profiles.createProfile({
      authUserId: input.authUserId,
      nickname: input.nickname ?? generateNickname(input.authUserId),
      oauthProvider: input.identity.columnProvider,
      oauthSubject: input.identity.subject,
    });
  }

  const role = await syncRoleOnLogin({
    authUserId: input.authUserId,
    identity: {
      provider: input.identity.resolverProvider,
      subject: input.identity.subject,
    },
    repository: input.roles,
    env: input.env,
  });

  return { created, role };
}
