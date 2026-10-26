import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { DesktopShell } from "./DesktopShell";

const systemJson = { app: "adom-os", version: "9.9.9", build: "abc123", environment: "test", health: "ok", time: new Date().toISOString() };

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  window.sessionStorage.clear();
  window.sessionStorage.setItem("adom-os-booted", "1"); // skip intro in tests
  window.matchMedia = ((q: string) => ({
    matches: false,
    media: q,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
    onchange: null,
  })) as unknown as typeof window.matchMedia;
  Object.defineProperty(HTMLElement.prototype, "clientWidth", { configurable: true, get: () => 1200 });
  Object.defineProperty(HTMLElement.prototype, "clientHeight", { configurable: true, get: () => 700 });
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
  Element.prototype.scrollIntoView = vi.fn();
  fetchMock = vi.fn(async (url: string) => {
    if (url === "/api/system") return new Response(JSON.stringify(systemJson), { status: 200 });
    if (url === "/api/ip") return new Response(JSON.stringify({ ip: "203.0.113.5", method: "test", retrievedAt: new Date().toISOString() }), { status: 200 });
    return new Response("{}", { status: 404 });
  });
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const dock = () => within(screen.getByRole("navigation", { name: "Applications" }));
const calledIp = () => fetchMock.mock.calls.some((c) => c[0] === "/api/ip");

describe("desktop shell", () => {
  it("opens Home and System Overview by default", async () => {
    render(<DesktopShell pdfAvailable={false} />);
    expect(await screen.findByRole("dialog", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "System Overview" })).toBeInTheDocument();
  });

  it("every dock application opens, minimizes and closes", async () => {
    render(<DesktopShell pdfAvailable={false} />);
    await screen.findByRole("dialog", { name: "Home" });
    const names = ["Home", "Projects", "Terminal", "System Overview", "Security Lab", "Network Tools", "Skills", "CV", "About", "Contact"];
    expect(dock().getAllByRole("button")).toHaveLength(names.length);

    // Home and System Overview are open by default; close them so the loop starts clean.
    for (const n of ["Home", "System Overview"]) {
      fireEvent.click(within(screen.getByRole("dialog", { name: n })).getByRole("button", { name: `Close ${n}` }));
    }

    for (const name of names) {
      fireEvent.click(dock().getByRole("button", { name }));
      const win = await screen.findByRole("dialog", { name });
      expect(win).toBeVisible();
      fireEvent.click(within(win).getByRole("button", { name: `Close ${name}` }));
      expect(screen.queryByRole("dialog", { name })).not.toBeInTheDocument();
    }

    // minimize hides the window; reopening from the dock restores it
    fireEvent.click(dock().getByRole("button", { name: "About" }));
    const about = await screen.findByRole("dialog", { name: "About" });
    fireEvent.click(within(about).getByRole("button", { name: "Minimize About" }));
    // Hidden elements have no accessible name, so assert on the element itself.
    const minimized = document.querySelector('[role="dialog"][aria-label="About"]');
    expect(minimized).toHaveAttribute("hidden");
    expect(screen.queryByRole("dialog", { name: "About" })).not.toBeInTheDocument();
    fireEvent.click(dock().getByRole("button", { name: "About" }));
    expect(await screen.findByRole("dialog", { name: "About" })).toBeVisible();
  });

  it("Escape on a focused title bar closes the window; arrow keys move it", async () => {
    render(<DesktopShell pdfAvailable={false} />);
    const win = await screen.findByRole("dialog", { name: "Home" });
    const bar = within(win).getByLabelText(/Home title bar/);
    const before = win.style.left;
    fireEvent.keyDown(bar, { key: "ArrowRight" });
    expect(win.style.left).not.toBe(before);
    fireEvent.keyDown(bar, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Home" })).not.toBeInTheDocument();
  });
});

describe("system overview", () => {
  it("shows labeled sections, and does NOT request the public IP until asked", async () => {
    render(<DesktopShell pdfAvailable={false} />);
    const win = await screen.findByRole("dialog", { name: "System Overview" });
    await waitFor(() => expect(within(win).getByText("9.9.9")).toBeInTheDocument());

    for (const t of ["Browser", "Device", "Connection", "Portfolio System"]) {
      expect(within(win).getByText(t, { exact: false, selector: "summary" })).toBeInTheDocument();
    }
    expect(within(win).getByText("Screen size")).toBeInTheDocument();
    expect(within(win).getByText("Viewport size")).toBeInTheDocument();
    expect(within(win).getByText("Not requested")).toBeInTheDocument();
    expect(within(win).getByText(/Not collected/)).toBeInTheDocument(); // LAN IP honesty
    expect(calledIp()).toBe(false);

    await act(async () => {
      fireEvent.click(within(win).getByRole("button", { name: "Look up my public IP" }));
    });
    await waitFor(() => expect(within(win).getByText("203.0.113.5")).toBeInTheDocument());
    expect(calledIp()).toBe(true);

    fireEvent.click(within(win).getByRole("button", { name: "Clear / skip" }));
    expect(within(win).queryByText("203.0.113.5")).not.toBeInTheDocument();
  });

  it("degrades gracefully when the API is down", async () => {
    fetchMock.mockImplementation(async () => {
      throw new Error("network down");
    });
    render(<DesktopShell pdfAvailable={false} />);
    const win = await screen.findByRole("dialog", { name: "System Overview" });
    await waitFor(() => expect(within(win).getByText("Unavailable")).toBeInTheDocument());
    expect(within(win).getByText("Screen size")).toBeInTheDocument(); // client-side info still works
    expect(screen.getByRole("dialog", { name: "Home" })).toBeInTheDocument();
  });
});

describe("terminal", () => {
  const openTerminal = async () => {
    render(<DesktopShell pdfAvailable={false} />);
    await screen.findByRole("dialog", { name: "Home" });
    fireEvent.click(dock().getByRole("button", { name: "Terminal" }));
    const win = await screen.findByRole("dialog", { name: "Terminal" });
    const input = within(win).getByLabelText(/adom@portfolio/);
    const run = (cmd: string) => {
      fireEvent.change(input, { target: { value: cmd } });
      fireEvent.keyDown(input, { key: "Enter" });
    };
    return { win, input: input as HTMLInputElement, run };
  };

  it("runs help, whoami, rejects arbitrary commands, and clears", async () => {
    const { win, run } = await openTerminal();
    const log = within(win).getByRole("log");

    run("help");
    expect(log).toHaveTextContent("security-lab");
    run("whoami");
    expect(log).toHaveTextContent("Kwame Emmanuel Adom");
    run("cat /etc/passwd");
    expect(log).toHaveTextContent("cat: command not found");
    expect(log).not.toHaveTextContent("root:");
    run("clear");
    expect(log).not.toHaveTextContent("whoami");
  });

  it("supports command history with ArrowUp and ArrowDown", async () => {
    const { input, run } = await openTerminal();
    run("whoami");
    run("skills");
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(input.value).toBe("skills");
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(input.value).toBe("whoami");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input.value).toBe("skills");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input.value).toBe("");
  });

  it("'projects' lists projects and opens the Projects window; 'network' does not look up the IP", async () => {
    const { win, run } = await openTerminal();
    run("projects");
    expect(within(win).getByRole("log")).toHaveTextContent("AdepaMarket");
    expect(await screen.findByRole("dialog", { name: "Projects" })).toBeInTheDocument();
    run("network");
    expect(calledIp()).toBe(false);
    run("network ip");
    await waitFor(() => expect(within(win).getByRole("log")).toHaveTextContent("203.0.113.5"));
    expect(calledIp()).toBe(true);
  });
});

describe("projects app", () => {
  it("opens a case study from Home and shows its real screenshots", async () => {
    render(<DesktopShell pdfAvailable={false} />);
    const home = await screen.findByRole("dialog", { name: "Home" });
    fireEvent.click(within(home).getByRole("button", { name: /AdepaMarket/ }));
    const projects = await screen.findByRole("dialog", { name: "Projects" });
    expect(within(projects).getByRole("heading", { name: "AdepaMarket" })).toBeInTheDocument();
    expect(within(projects).getAllByRole("img", { name: /AdepaMarket home page/ })[0]).toHaveAttribute("src", "/projects/adepamarket-home.jpg");
    expect(within(projects).queryByText(/Placeholder, not a real screenshot/)).not.toBeInTheDocument();
    expect(within(projects).getByRole("link", { name: /Live site/ })).toHaveAttribute("href", "https://adepamarket.admunz.workers.dev/");
  });
});
