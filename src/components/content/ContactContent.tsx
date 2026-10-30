import { ExternalLink, Mail } from "lucide-react";
import { profile } from "@/data/profile";

export function ContactContent() {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl text-fg">Get in touch</h2>
      <p className="text-sm text-fg2">The quickest way to reach me is by email.</p>

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

    </div>
  );
}
