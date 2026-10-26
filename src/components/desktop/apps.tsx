"use client";

import type { ComponentType } from "react";
import { Activity, FileText, FolderOpen, House, Layers, Mail, Network, ShieldCheck, SquareTerminal, User, type LucideIcon } from "lucide-react";
import type { AppId } from "@/types/terminal";
import { HomeApp } from "@/components/applications/HomeApp";
import { ProjectsApp } from "@/components/applications/ProjectsApp";
import { TerminalApp } from "@/components/applications/TerminalApp";
import { SystemOverview } from "@/components/applications/SystemOverview";
import { SecurityLabApp } from "@/components/applications/SecurityLabApp";
import { NetworkToolsApp } from "@/components/applications/NetworkToolsApp";
import { SkillsContent } from "@/components/content/SkillsContent";
import { AboutContent } from "@/components/content/AboutContent";
import { ContactContent } from "@/components/content/ContactContent";
import { CVContent } from "@/components/content/CVContent";
import { useDesktop } from "./DesktopProvider";

function CVApp() {
  const { pdfAvailable } = useDesktop();
  return <CVContent pdfAvailable={pdfAvailable} />;
}

export interface AppDef {
  id: AppId;
  title: string;
  Icon: LucideIcon;
  Component: ComponentType;
  /** Fixed-height apps manage their own scrolling. */
  flush?: boolean;
}

export const apps: AppDef[] = [
  { id: "home", title: "Home", Icon: House, Component: HomeApp },
  { id: "projects", title: "Projects", Icon: FolderOpen, Component: ProjectsApp },
  { id: "terminal", title: "Terminal", Icon: SquareTerminal, Component: TerminalApp },
  { id: "system", title: "System Overview", Icon: Activity, Component: SystemOverview },
  { id: "security-lab", title: "Security Lab", Icon: ShieldCheck, Component: SecurityLabApp },
  { id: "network-tools", title: "Network Tools", Icon: Network, Component: NetworkToolsApp },
  { id: "skills", title: "Skills", Icon: Layers, Component: SkillsContent },
  { id: "cv", title: "CV", Icon: FileText, Component: CVApp },
  { id: "about", title: "About", Icon: User, Component: AboutContent },
  { id: "contact", title: "Contact", Icon: Mail, Component: ContactContent },
];

export const appById = Object.fromEntries(apps.map((a) => [a.id, a])) as Record<AppId, AppDef>;
