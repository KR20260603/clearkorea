"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { canAccessAdmin } from "@/lib/admin/access";
import { adminOriginForHost } from "@/lib/routing/subdomain";
import type { AppRole } from "@/lib/auth/roles";
import { SignOutButton } from "./sign-out-button";

function adminHrefForRole(role: AppRole | null): string | null {
  if (!role || !canAccessAdmin(role) || typeof window === "undefined") {
    return null;
  }
  return (
    adminOriginForHost(window.location.host, {
      NEXT_PUBLIC_ADMIN_ORIGIN: process.env.NEXT_PUBLIC_ADMIN_ORIGIN,
    }) ?? "/admin"
  );
}

export function AccountControls() {
  const [role, setRole] = useState<AppRole | null>(null);

  useEffect(() => {
    if (typeof fetch === "undefined") {
      return;
    }
    let active = true;
    fetch("/api/me", { credentials: "include" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { role?: AppRole } | null) => {
        if (active && data?.role) {
          setRole(data.role);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const adminHref = adminHrefForRole(role);

  return (
    <div className="flex items-center justify-end gap-2">
      {adminHref ? (
        <Link
          href={adminHref}
          className="inline-flex h-[clamp(2.25rem,7svh,2.75rem)] items-center justify-center rounded-full border border-civic-red/60 bg-civic-red/10 px-4 text-[clamp(0.7rem,1.7svh,0.875rem)] font-semibold text-white transition hover:border-civic-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <ShieldCheck aria-hidden="true" className="mr-1.5 h-4 w-4" />
          Admin
        </Link>
      ) : null}
      <SignOutButton />
    </div>
  );
}
