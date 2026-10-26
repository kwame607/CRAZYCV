import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import { renderToString } from "react-dom/server";

function stubBrowser() {
  window.sessionStorage.clear();
  window.sessionStorage.setItem("adom-os-booted", "1");
  window.matchMedia = ((q: string) => ({
    matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false, onchange: null,
  })) as unknown as typeof window.matchMedia;
  Object.defineProperty(HTMLElement.prototype, "clientWidth", { configurable: true, get: () => 1300 });
  Object.defineProperty(HTMLElement.prototype, "clientHeight", { configurable: true, get: () => 760 });
  globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} } as unknown as typeof ResizeObserver;
  Element.prototype.scrollIntoView = vi.fn();
}

beforeEach(stubBrowser);
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("server-rendered HTML (what a crawler or a slow first paint sees)", () => {
  it("contains no unresolved placeholders", async () => {
    const { DesktopShell } = await import("./DesktopShell");
    const html = renderToString(<DesktopShell pdfAvailable={false} />);
    expect(html).not.toContain("--:--");
    expect(html).not.toContain("api …");
    expect(html).not.toContain("All windows are closed");
    expect(html).not.toContain("Reading browser information");
  });
});

describe("first run", () => {
  it("shows Home and System Overview side by side, both visible, and no empty-state message", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ app: "adom-os", version: "1.2.3", build: "abc", environment: "test", health: "ok", time: "t" }))));
    const { DesktopShell } = await import("./DesktopShell");
    render(<DesktopShell pdfAvailable={false} />);
    const home = await screen.findByRole("dialog", { name: "Home" });
    const system = await screen.findByRole("dialog", { name: "System Overview" });
    expect(home).toBeVisible();
    expect(system).toBeVisible();
    expect(parseInt(home.style.left)).toBeLessThan(parseInt(system.style.left));
    expect(screen.queryByText(/All windows are closed/)).not.toBeInTheDocument();
    // The clock resolves to a real time, not a placeholder.
    await waitFor(() => expect(document.querySelector("time")).not.toBeNull());
    expect(document.body.textContent).not.toContain("--:--");
    expect(await screen.findByText(/api ok/)).toBeInTheDocument();
  });

  it("Skip intro closes the intro screen", async () => {
    window.sessionStorage.clear(); // first visit: intro is shown
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 404 })));
    const { DesktopShell } = await import("./DesktopShell");
    render(<DesktopShell pdfAvailable={false} />);
    const skip = await screen.findByRole("button", { name: "Skip intro" });
    skip.click();
    await waitFor(() => expect(screen.queryByRole("button", { name: "Skip intro" })).not.toBeInTheDocument());
    expect(await screen.findByRole("dialog", { name: "Home" })).toBeVisible();
  });
});

describe("static GitHub Pages preview", () => {
  it("makes no API requests and labels server and IP features honestly", async () => {
    vi.stubEnv("NEXT_PUBLIC_STATIC_PREVIEW", "true");
    vi.stubEnv("NEXT_PUBLIC_BUILD_ID", "deadbeef");
    vi.stubEnv("NEXT_PUBLIC_APP_VERSION", "0.1.0");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    vi.resetModules();
    const { DesktopShell } = await import("./DesktopShell");
    render(<DesktopShell pdfAvailable={false} />);
    const system = await screen.findByRole("dialog", { name: "System Overview" });
    await waitFor(() => expect(within(system).getByText("Not available in this static preview")).toBeInTheDocument());
    expect(within(system).getByText("deadbeef")).toBeInTheDocument();
    expect(within(system).getByRole("button", { name: "Look up my public IP" })).toBeDisabled();
    expect(screen.getByText(/^● static preview$/)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
