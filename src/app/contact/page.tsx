import { Metadata } from 'next';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Mail01Icon,
  GithubIcon,
  Globe02Icon,
  LinkSquare02Icon,
} from '@hugeicons/core-free-icons';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with ENV Store - Questions, feedback, or support.',
};

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Get in Touch</h1>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Have questions about ENV Store? Need help with your environment
          variables? Want to report a bug or suggest a feature? I&apos;d love to
          hear from you.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Email */}
        <a
          href="mailto:nabinkhair12@gmail.com"
          className="group flex flex-col gap-4 rounded-lg border border-white/[0.08] bg-white/[0.03] p-6 transition-colors hover:bg-white/[0.06]"
        >
          <div className="flex size-12 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.04] text-white/60 transition-colors group-hover:text-white/90">
            <HugeiconsIcon icon={Mail01Icon} size={20} />
          </div>
          <div>
            <h2 className="mb-1 text-lg font-semibold">Email</h2>
            <p className="text-sm text-muted-foreground">
              Send me an email for any inquiries or support requests.
            </p>
            <p className="mt-2 text-sm text-primary">nabinkhair12@gmail.com</p>
          </div>
        </a>

        {/* GitHub */}
        <a
          href="https://github.com/nabinkhair42"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col gap-4 rounded-lg border border-white/[0.08] bg-white/[0.03] p-6 transition-colors hover:bg-white/[0.06]"
        >
          <div className="flex size-12 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.04] text-white/60 transition-colors group-hover:text-white/90">
            <HugeiconsIcon icon={GithubIcon} size={20} />
          </div>
          <div>
            <h2 className="mb-1 text-lg font-semibold">GitHub</h2>
            <p className="text-sm text-muted-foreground">
              Check out my projects, report issues, or contribute to ENV Store.
            </p>
            <p className="mt-2 text-sm text-primary">@nabinkhair42</p>
          </div>
        </a>

        {/* Website */}
        <a
          href="https://nabinkhair.com.np"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col gap-4 rounded-lg border border-white/[0.08] bg-white/[0.03] p-6 transition-colors hover:bg-white/[0.06]"
        >
          <div className="flex size-12 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.04] text-white/60 transition-colors group-hover:text-white/90">
            <HugeiconsIcon icon={Globe02Icon} size={20} />
          </div>
          <div>
            <h2 className="mb-1 text-lg font-semibold">Website</h2>
            <p className="text-sm text-muted-foreground">
              Visit my personal website to learn more about my work.
            </p>
            <p className="mt-2 text-sm text-primary">nabinkhair.com.np</p>
          </div>
        </a>

        {/* GitHub Issues */}
        <a
          href="https://github.com/nabinkhair42/env-store/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col gap-4 rounded-lg border border-white/[0.08] bg-white/[0.03] p-6 transition-colors hover:bg-white/[0.06]"
        >
          <div className="flex size-12 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.04] text-white/60 transition-colors group-hover:text-white/90">
            <HugeiconsIcon icon={LinkSquare02Icon} size={20} />
          </div>
          <div>
            <h2 className="mb-1 text-lg font-semibold">Bug Reports</h2>
            <p className="text-sm text-muted-foreground">
              Found a bug? Open an issue on the GitHub repository.
            </p>
            <p className="mt-2 text-sm text-primary">Report an Issue</p>
          </div>
        </a>
      </div>

      <div className="mt-12 rounded-lg border border-white/[0.08] bg-white/[0.03] p-8">
        <h2 className="mb-4 text-2xl font-semibold">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="mb-2 text-lg font-semibold">
              How secure is my data?
            </h3>
            <p className="leading-relaxed text-muted-foreground">
              All environment variables are encrypted at rest using AES-256-GCM
              encryption with PBKDF2 key derivation (100,000 iterations). Data
              is transmitted over HTTPS and we implement industry-standard
              security practices. Read our{' '}
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>{' '}
              for more details.
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold">
              Is ENV Store free to use?
            </h3>
            <p className="leading-relaxed text-muted-foreground">
              Yes, ENV Store is completely free and open source. There are no
              paid plans or premium features.
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold">
              Can I export my environment variables?
            </h3>
            <p className="leading-relaxed text-muted-foreground">
              Absolutely! You can export your variables to the standard .env
              format from any project in your dashboard.
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold">
              How do I delete my account?
            </h3>
            <p className="leading-relaxed text-muted-foreground">
              You can delete all your projects from the dashboard. To completely
              remove your account, please contact me via email.
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold">
              Can I contribute to ENV Store?
            </h3>
            <p className="leading-relaxed text-muted-foreground">
              Yes! ENV Store is open source. Check out the{' '}
              <a
                href="https://github.com/nabinkhair42/env-store"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                GitHub repository
              </a>{' '}
              to get started. Pull requests are welcome!
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          Response time: Usually within 24-48 hours
        </p>
      </div>
    </main>
  );
}
