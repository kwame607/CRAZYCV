import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { NetworkToolsApp } from "./NetworkToolsApp";
import { ScanSimulation } from "./ScanSimulation";
import { simScenarios } from "@/lib/security/demo-scenarios";
import { ContactContent } from "@/components/content/ContactContent";
import { CVContent } from "@/components/content/CVContent";

afterEach(cleanup);

describe("NetworkToolsApp", () => {
  it("calculates a subnet and shows readable errors", () => {
    render(<NetworkToolsApp />);
    fireEvent.click(screen.getByRole("button", { name: "Calculate" }));
    expect(screen.getByText("192.168.1.191")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("IPv4 address"), { target: { value: "999.1.1.1" } });
    fireEvent.click(screen.getByRole("button", { name: "Calculate" }));
    expect(screen.getByRole("alert")).toHaveTextContent(/out of range/);
  });
});

describe("ScanSimulation", () => {
  it("starts on the recorded real run, labelled as a replay, with no results yet", () => {
    render(<ScanSimulation />);
    expect(screen.getByText(/REPLAY OF A REAL RUN\./)).toBeInTheDocument();
    expect(screen.getByText(/Nothing is scanned from this page/)).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
  it("labels the invented scenarios as simulations, not real scans", () => {
    render(<ScanSimulation />);
    fireEvent.change(screen.getByLabelText("Scenario"), { target: { value: "small-web-server" } });
    expect(screen.getByText(/SIMULATION\./)).toBeInTheDocument();
    expect(screen.getByText(/not the output of a real scan/)).toBeInTheDocument();
  });
  it("the real replay matches the capture: 21, 22 and 80 open; 20, 23, 25 and 53 closed", () => {
    const real = simScenarios.find((s) => s.real);
    expect(real?.ports.filter((p) => p.state === "open").map((p) => p.port)).toEqual([21, 22, 80]);
    expect(real?.ports.filter((p) => p.state === "closed").map((p) => p.port)).toEqual([20, 23, 25, 53]);
  });
});

describe("CV and Contact honesty", () => {
  it("shows no download link when the PDF is missing", () => {
    render(<CVContent pdfAvailable={false} />);
    expect(screen.queryByRole("link", { name: /Download CV/ })).not.toBeInTheDocument();
    expect(screen.getByText(/CV PDF unavailable/)).toBeInTheDocument();
  });
  it("shows a real download link only when the PDF exists", () => {
    render(<CVContent pdfAvailable />);
    expect(screen.getByRole("link", { name: /Download CV/ })).toHaveAttribute("href", expect.stringContaining(".pdf"));
  });
  it("does not render a fake contact form", () => {
    render(<ContactContent />);
    expect(document.querySelector("form")).toBeNull();
  });
});
