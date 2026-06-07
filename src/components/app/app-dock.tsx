import { Home, Megaphone, Newspaper, RadioTower, UsersRound } from "lucide-react";
import Link from "next/link";
import { dockLabels } from "@/lib/copy/copy";

const dockItems = [
  { label: dockLabels[0], href: "/app", icon: Home },
  { label: dockLabels[1], href: "/app/rallies", icon: Megaphone },
  { label: dockLabels[2], href: "/app/square", icon: UsersRound },
  { label: dockLabels[3], href: "/app/live", icon: RadioTower },
  { label: dockLabels[4], href: "/app/news", icon: Newspaper },
] as const;

export function AppDock({ activeHref = "/app" }: { activeHref?: string }) {
  return (
    <nav
      aria-label="Primary app sections"
      className="grid w-full shrink-0 grid-cols-5 overflow-hidden rounded-full border border-white/15 bg-black/40 p-1 backdrop-blur"
    >
      {dockItems.map(({ label, href, icon: Icon }) => {
        const active = href === activeHref;
        return (
          <Link
            key={label}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-[clamp(2rem,6svh,2.75rem)] items-center justify-center gap-[clamp(0.125rem,1vw,0.5rem)] rounded-full px-1 text-[clamp(0.5rem,2.4vw,0.875rem)] font-semibold transition ${
              active
                ? "bg-white/10 text-white"
                : "text-zinc-300 hover:text-white"
            }`}
          >
            <Icon
              aria-hidden="true"
              className="h-[clamp(0.7rem,3vw,1rem)] w-[clamp(0.7rem,3vw,1rem)]"
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
