import { access } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const requiredPublicAssets = [
  "pwa-icon.svg",
  "pwa-icon.png",
  "hero.png",
  "hero-mobile.png",
  "og.png",
  "splash.png",
] as const;

describe("public brand assets", () => {
  it("keeps runtime-required brand assets in the Next public root", async () => {
    await expect(
      Promise.all(
        requiredPublicAssets.map((assetName) =>
          access(path.join(process.cwd(), "public", assetName)),
        ),
      ),
    ).resolves.toEqual(requiredPublicAssets.map(() => undefined));
  });
});
