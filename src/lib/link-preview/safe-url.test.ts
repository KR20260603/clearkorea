import { describe, expect, it } from "vitest";
import { isSafePublicHttpUrl } from "./safe-url";

describe("isSafePublicHttpUrl", () => {
  it("allows public https and http URLs across lawful sources", () => {
    expect(isSafePublicHttpUrl("https://x.com/user/status/1")).toBe(true);
    expect(isSafePublicHttpUrl("https://www.instagram.com/p/abc/")).toBe(true);
    expect(isSafePublicHttpUrl("https://www.threads.net/@user/post/1")).toBe(true);
    expect(isSafePublicHttpUrl("http://example.com/article")).toBe(true);
    expect(isSafePublicHttpUrl("https://some-community.co.kr/board/42")).toBe(true);
  });

  it("rejects non-http protocols", () => {
    expect(isSafePublicHttpUrl("ftp://example.com/x")).toBe(false);
    expect(isSafePublicHttpUrl("file:///etc/passwd")).toBe(false);
    expect(isSafePublicHttpUrl("data:text/html,<script>")).toBe(false);
    expect(isSafePublicHttpUrl("javascript:alert(1)")).toBe(false);
  });

  it("rejects loopback, link-local, and private network hosts (SSRF guard)", () => {
    expect(isSafePublicHttpUrl("http://localhost/")).toBe(false);
    expect(isSafePublicHttpUrl("http://127.0.0.1/")).toBe(false);
    expect(isSafePublicHttpUrl("http://0.0.0.0/")).toBe(false);
    expect(isSafePublicHttpUrl("http://10.0.0.5/")).toBe(false);
    expect(isSafePublicHttpUrl("http://172.16.4.4/")).toBe(false);
    expect(isSafePublicHttpUrl("http://192.168.1.10/")).toBe(false);
    expect(isSafePublicHttpUrl("http://169.254.169.254/latest/meta-data")).toBe(false);
    expect(isSafePublicHttpUrl("http://service.local/")).toBe(false);
    expect(isSafePublicHttpUrl("http://[::1]/")).toBe(false);
  });

  it("rejects non-standard ports that could reach internal services", () => {
    expect(isSafePublicHttpUrl("http://example.com:8080/")).toBe(false);
    expect(isSafePublicHttpUrl("https://example.com:443/")).toBe(true);
    expect(isSafePublicHttpUrl("http://example.com:80/")).toBe(true);
  });

  it("rejects malformed or empty input", () => {
    expect(isSafePublicHttpUrl("")).toBe(false);
    expect(isSafePublicHttpUrl("not a url")).toBe(false);
    expect(isSafePublicHttpUrl("https://")).toBe(false);
  });
});
