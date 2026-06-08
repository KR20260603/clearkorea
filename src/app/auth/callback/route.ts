import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { resolveCallbackRedirect } from "@/lib/auth/auth-flow";
import { bootstrapUserOnLogin } from "@/lib/auth/login-bootstrap";
import { extractProviderIdentity } from "@/lib/auth/provider-identity";
import {
  createSupabaseUserProfileWriter,
  type ProfileClient,
} from "@/lib/auth/profile-repository";
import {
  createSupabaseUserRoleRepository,
  type ServiceRoleClient,
} from "@/lib/auth/role-repository";
import { originFromRequest } from "@/lib/routing/request-origin";
import { resolveCookieDomain } from "@/lib/supabase/cookie-domain";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role-client";

async function bootstrapLinkedMember(
  sessionClient: SupabaseClient,
): Promise<void> {
  try {
    const { data } = await sessionClient.auth.getUser();
    if (!data.user) {
      return;
    }

    const identity = extractProviderIdentity(data.user);
    if (!identity) {
      return;
    }

    const service = createServiceRoleSupabaseClient();
    if (service.status !== "configured") {
      return;
    }

    await bootstrapUserOnLogin({
      authUserId: data.user.id,
      identity,
      profiles: createSupabaseUserProfileWriter(
        service.client as unknown as ProfileClient,
      ),
      roles: createSupabaseUserRoleRepository(
        service.client as unknown as ServiceRoleClient,
      ),
    });
  } catch (error) {
    console.error(
      "login bootstrap failed",
      error instanceof Error ? error.message : "unknown error",
    );
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = originFromRequest(request);
  const cookieDomain = resolveCookieDomain(request.headers.get("host"));
  const cookieStore = await cookies();

  const { client } = createServerSupabaseClient(
    {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        for (const { name, value, options } of cookiesToSet) {
          cookieStore.set(name, value, options);
        }
      },
    },
    process.env,
    cookieDomain,
  );

  const redirectPath = await resolveCallbackRedirect({
    code: url.searchParams.get("code"),
    exchanger: client,
  });

  if (redirectPath === "/" && client) {
    await bootstrapLinkedMember(client);
  }

  return NextResponse.redirect(new URL(redirectPath, origin));
}
