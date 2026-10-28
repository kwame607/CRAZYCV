export type VerificationStatus = "verified" | "unverified" | "planned";

export interface ProjectLink {
  label: string;
  href: string;
}

export interface ProjectAsset {
  /** Path under /public. Only real screenshots are ever listed. */
  src: string;
  alt: string;
  /** Intrinsic size in pixels, so the layout does not jump while the image loads. */
  w: number;
  h: number;
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  status: string;
  featured?: boolean;
  overview: string;
  problem: string;
  role: string;
  /** Only technologies confirmed from the implementation or project docs. */
  technologiesVerified: string[];
  /** Features confirmed from the live site or source. */
  featuresVerified: string[];
  decisions: string[];
  challenges: string[];
  learned: string[];
  security: string[];
  links: ProjectLink[];
  screenshots: ProjectAsset[];
  /** Where the verified details came from. Shown on the case study. */
  evidenceNote?: string;
  /** Known limitations of the work itself (tools, scope, accuracy). */
  limitations?: string[];
}

export type SkillEvidenceKind = "project" | "assessment" | "repository" | "demo";

export interface SkillEvidence {
  kind: SkillEvidenceKind;
  label: string;
  /** Internal route or external URL. */
  href: string;
}

export interface Skill {
  name: string;
  evidence: SkillEvidence[];
  /** True when no verifiable evidence has been linked yet. */
  needsEvidence?: boolean;
}

export interface SkillGroup {
  title: string;
  skills: Skill[];
}

export interface TimelineEntry {
  title: string;
  org: string;
  /** Omit when the source (CV) gives no dates. */
  period?: string;
  detail: string;
  status: VerificationStatus;
}

export interface Profile {
  name: string;
  handle: string;
  roles: string[];
  location: string;
  focus: string;
  summary: string;
  email: string | null;
  github: string | null;
  linkedin: string | null;
  website: string;
  cvPdfPath: string;
  learningGoals: string[];
}

export interface StudyEntry {
  title: string;
  org: string;
  note: string;
}
