import type { ReactNode } from "react";
import { getPostHogConfig } from "@/lib/posthog/config";

// Observability boundary. PostHog only activates when both the public key and
// host are configured; by default it is a no-op. The posthog-js init with
// session-replay masking and feature flags is wired here once the project
// exists. See docs/setup/observability-posthog.md.
export function PostHogProvider({ children }: { children: ReactNode }) {
  const config = getPostHogConfig({
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  });

  return (
    <>
      {config.enabled ? <div data-posthog-enabled hidden aria-hidden="true" /> : null}
      {children}
    </>
  );
}
