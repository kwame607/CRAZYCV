import type { ButtonHTMLAttributes, ReactNode } from "react";
import { TriangleAlert, Info } from "lucide-react";
import type { InfoStatus } from "@/types/browser-info";

export function IconButton({
  label,
  children,
  className = "",
  ...rest
}: { label: string; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex h-7 w-7 items-center justify-center rounded text-fg2 hover:bg-white/10 hover:text-fg ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

const statusStyles: Record<InfoStatus, string> = {
  detected: "border-term/40 text-term",
  inferred: "border-accent/40 text-accent",
  unavailable: "border-line text-fg2",
  "not-requested": "border-line text-fg2",
};
const statusText: Record<InfoStatus, string> = {
  detected: "detected",
  inferred: "inferred",
  unavailable: "unavailable",
  "not-requested": "not requested",
};

export function StatusIndicator({ status }: { status: InfoStatus }) {
  return (
    <span className={`inline-block shrink-0 rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide ${statusStyles[status]}`}>
      {statusText[status]}
    </span>
  );
}

export function ErrorState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div role="alert" className="flex gap-3 rounded-lg border border-danger/40 bg-danger/10 p-4 text-sm">
      <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden />
      <div>
        <p className="font-medium text-fg">{title}</p>
        {children && <p className="mt-1 text-fg2">{children}</p>}
      </div>
    </div>
  );
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <p role="status" className="p-4 font-mono text-sm text-fg2">
      {label}
    </p>
  );
}

export function Notice({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "warn" }) {
  return (
    <div
      className={`flex gap-2.5 rounded-lg border p-3 text-sm ${
        tone === "warn" ? "border-warn/40 bg-warn/10" : "border-line bg-white/[0.03]"
      }`}
    >
      <Info className={`mt-0.5 h-4 w-4 shrink-0 ${tone === "warn" ? "text-warn" : "text-fg2"}`} aria-hidden />
      <div className="text-fg2">{children}</div>
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="mb-2 mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-accent first:mt-0">{children}</h3>;
}

export function PrimaryButton({ className = "", ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-2 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-bg hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...rest}
    />
  );
}

export function GhostButton({ className = "", ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-2 rounded-md border border-line px-3 py-1.5 text-sm text-fg hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...rest}
    />
  );
}
