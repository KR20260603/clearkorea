import { LogIn, ShieldCheck } from "lucide-react";
import { getAuthEntryChoices } from "@/lib/auth/auth-entry";
import { ShellFrame } from "@/app/shell-frame";
import type { ProviderId } from "@/lib/auth/providers/types";

const providerButtonStyles: Record<ProviderId, string> = {
  kakao: "bg-[#FEE500] text-[#191600] hover:brightness-95",
  naver: "bg-[#03C75A] text-white hover:brightness-110",
};

export default function AuthStartPage() {
  const choices = getAuthEntryChoices();

  return (
    <main className="isolate relative h-svh overflow-hidden bg-civic-bg px-[clamp(1rem,5vw,5rem)] py-[clamp(0.5rem,2svh,1.5rem)] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_18%,rgba(0,71,160,0.18),transparent_55%),radial-gradient(circle_at_50%_120%,rgba(205,46,58,0.16),transparent_60%)]" />

      <ShellFrame>
        <section className="mx-auto grid min-h-0 w-full max-w-[26rem] flex-1 content-center gap-[clamp(0.875rem,3svh,1.75rem)] py-[clamp(0.5rem,2svh,1.5rem)]">
          <div className="min-w-0">
            <p className="mb-[clamp(0.375rem,1.4svh,0.875rem)] inline-flex rounded-full border border-white/15 bg-black/25 px-4 py-1.5 text-[clamp(0.66rem,1.6svh,0.8125rem)] font-semibold tracking-wide text-zinc-200">
              Enter the square
            </p>
            <h1 className="text-[clamp(1.6rem,min(6.5svh,9vw),2.75rem)] font-black leading-[1.02] text-white">
              Choose how to enter
            </h1>
            <p className="mt-[clamp(0.5rem,1.8svh,1rem)] text-[clamp(0.78rem,1.85svh,1rem)] leading-[1.45] text-zinc-200">
              Production participation requires linking a Kakao or Naver account.
            </p>
            <p className="mt-[clamp(0.25rem,1.2svh,0.625rem)] text-[clamp(0.7rem,1.6svh,0.875rem)] leading-[1.5] text-zinc-400">
              공개 참여에는 카카오 또는 네이버 계정 연결이 필요합니다. 광장은 책임
              있는 기록으로 운영됩니다.
            </p>
          </div>

          <div className="flex flex-col gap-[clamp(0.5rem,1.6svh,0.875rem)]">
            {choices.providers.map((provider) => (
              <a
                key={provider.id}
                href={provider.startPath}
                className={`inline-flex min-h-[clamp(2.75rem,7svh,3.25rem)] w-full items-center justify-center gap-2 rounded-2xl px-6 text-[clamp(0.9rem,2svh,1.0625rem)] font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${providerButtonStyles[provider.id]}`}
              >
                <LogIn aria-hidden="true" className="h-5 w-5" strokeWidth={2.5} />
                {provider.label}
              </a>
            ))}

            {choices.devGuest.enabled ? (
              <a
                href={choices.devGuest.path}
                className="mt-[clamp(0.25rem,1svh,0.625rem)] inline-flex min-h-[clamp(2.5rem,6svh,3rem)] w-full items-center justify-center rounded-2xl border border-dashed border-white/25 bg-black/20 px-6 text-[clamp(0.78rem,1.7svh,0.9375rem)] font-semibold text-zinc-300 transition hover:border-white/45 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Continue as test guest (non-production)
              </a>
            ) : null}
          </div>

          <p className="inline-flex items-start gap-2 text-[clamp(0.66rem,1.5svh,0.8125rem)] leading-[1.45] text-zinc-400">
            <ShieldCheck
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0 text-civic-blue"
            />
            Linking an account keeps the public square accountable while keeping
            your voice transparent and lawful.
          </p>
        </section>
      </ShellFrame>
    </main>
  );
}
