import type { Metadata } from "next";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { canAccessAdmin } from "@/lib/admin/access";
import { readAdminContext } from "@/lib/admin/admin-request";

export const metadata: Metadata = {
  title: "ClearKorea Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const { admin } = await readAdminContext();

  if (!canAccessAdmin(admin.role)) {
    return (
      <main className="grid min-h-svh place-items-center bg-civic-bg px-6 text-center text-white">
        <section className="max-w-md">
          <ShieldAlert aria-hidden="true" className="mx-auto h-9 w-9 text-civic-red" />
          <h1 className="mt-4 text-2xl font-black">Admin access only</h1>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-zinc-400">
            This area is restricted to ClearKorea admins linked through Kakao or
            Naver. Your account does not have admin access.
          </p>
          <Link
            href="/app"
            className="mt-6 inline-flex items-center justify-center rounded-full border border-white/20 bg-black/30 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/45"
          >
            Back to the app
          </Link>
        </section>
      </main>
    );
  }

  return <AdminDashboard role={admin.role} />;
}
