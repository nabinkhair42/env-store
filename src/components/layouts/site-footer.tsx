import { siteConfig } from '@/lib/sitemap';
import Link from 'next/link';

const author = siteConfig.authors[0];

export default function SiteFooter() {
  return (
    <footer className="bg-muted/20">
      <div className="mx-auto w-full max-w-4xl px-6 pb-10 pt-10">
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

        <div className="mt-10 flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
          <p>
            Built by{' '}
            <Link
              href={author.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:underline"
            >
              {author.name}
            </Link>
          </p>
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}</p>
        </div>
      </div>
    </footer>
  );
}
