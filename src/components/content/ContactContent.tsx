import { ExternalLink, Mail } from "lucide-react";
import { profile } from "@/data/profile";
import { Notice } from "@/components/shared/ui";

export function ContactContent() {
  const hasAny = profile.email || profile.github || profile.linkedin;
  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl text-fg">Get in touch</h2>
      <p className="text-sm text-fg2">The quickest way to reach me is by email. There is no contact form because no message-handling backend is configured, so nothing here pretends to submit.</p>

      <ul className="space-y-2">
        {profile.email && (
          <li>
            <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-bg hover:brightness-110">
              <Mail className="h-4 w-4" aria-hidden /> {profile.email}
            </a>
          </li>
        )}
        {profile.github && (
          <li>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-accent hover:underline">
              GitHub <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        )}
        <li>
          <a href={profile.whatsapp.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-accent hover:underline">
            WhatsApp ({profile.whatsapp.display}) <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </li>
        {profile.linkedin && (
          <li>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-accent hover:underline">
              LinkedIn <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        )}
      </ul>

      {!profile.email && (
        <Notice tone={hasAny ? "info" : "warn"}>
          {hasAny ? (
            <>An email address is not published on this site yet. Please reach out through GitHub in the meantime.</>
          ) : (
            <>
              Contact details are not configured yet. Set <code className="font-mono text-xs text-fg">NEXT_PUBLIC_CONTACT_EMAIL</code> (see README) and redeploy.
            </>
          )}
        </Notice>
      )}
    </div>
  );
}
