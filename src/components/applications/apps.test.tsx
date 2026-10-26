import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { NetworkToolsApp } from "./NetworkToolsApp";
import { ScanSimulation } from "./ScanSimulation";
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
  it("is labeled as a simulation and starts with no results", () => {
    render(<ScanSimulation />);
    expect(screen.getByText(/SIMULATION\./)).toBeInTheDocument();
    expect(screen.getByText(/not the output of a real scan/)).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});

describe("CV and Contact honesty", () => {
  it("shows no download link when the PDF is missing", () => {
    render(<CVContent pdfAvailable={false} />);
    expect(screen.queryByRole("link", { name: /Download CV/ })).not.toBeInTheDocument();
    expect(screen.getByText(/PDF not yet supplied/)).toBeInTheDocument();
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
