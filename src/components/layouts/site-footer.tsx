import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto w-full max-w-4xl px-6 py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">ENV Store</p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Securely manage and sync your environment variables across
              devices.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Built by{' '}
              <Link
                href="https://nabinkhair.com.np"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:underline"
              >
                Nabin Khair
              </Link>
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <p className="mb-3 text-xs font-semibold text-muted-foreground">
                Resources
              </p>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="https://github.com/nabinkhair42/env-store"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/nabinkhair42/env-store/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Report an Issue
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold text-muted-foreground">
                Legal
              </p>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-muted-foreground hover:text-foreground"
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
