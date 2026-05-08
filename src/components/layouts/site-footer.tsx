import { siteConfig } from '@/lib/sitemap';
import Link from 'next/link';


export default function SiteFooter() {
  return (
    <footer className="w-full px-3 pb-3 sm:px-4 sm:pb-4">
      <div className="mx-auto w-full max-w-4xl rounded-2xl border bg-muted/50 px-6 py-10 shadow-sm shadow-black/5 backdrop-blur supports-backdrop-filter:bg-muted/40">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">{siteConfig.name}</p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Securely manage environment variables across projects, environments, and teams.
            </p>
          </div>

          <div className="flex gap-12 sm:gap-16">
            <div>
              <p className="mb-3 text-xs font-semibold text-muted-foreground/60">
                Resources
              </p>
              <ul className="space-y-2">
                <li>
                  <Link
                    href={siteConfig.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${siteConfig.repo}/issues`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Report an Issue
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold text-muted-foreground/60">
                Legal
              </p>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
