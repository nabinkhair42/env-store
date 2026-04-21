import { Metadata } from 'next';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Mail01Icon,
  GithubIcon,
  Globe02Icon,
  LinkSquare02Icon,
} from '@hugeicons/core-free-icons';
import SiteFooter from '@/components/layouts/site-footer';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with ENV Store - Questions, feedback, or support.',
};

const links = [
  {
    href: 'mailto:nabinkhair12@gmail.com',
    icon: Mail01Icon,
    title: 'Email',
    desc: 'Send me an email for any inquiries or support requests.',
    label: 'nabinkhair12@gmail.com',
  },
  {
    href: 'https://github.com/nabinkhair42',
    icon: GithubIcon,
    title: 'GitHub',
    desc: 'Check out my projects, report issues, or contribute to ENV Store.',
    label: '@nabinkhair42',
    external: true,
  },
  {
    href: 'https://nabinkhair.com.np',
    icon: Globe02Icon,
    title: 'Website',
    desc: 'Visit my personal website to learn more about my work.',
    label: 'nabinkhair.com.np',
    external: true,
  },
  {
    href: 'https://github.com/nabinkhair42/env-store/issues',
    icon: LinkSquare02Icon,
    title: 'Bug Reports',
    desc: 'Found a bug? Open an issue on the GitHub repository.',
    label: 'Report an Issue',
    external: true,
  },
];

const faqs = [
  {
    q: 'How secure is my data?',
    a: 'All environment variables are encrypted at rest using AES-256-GCM encryption with PBKDF2 key derivation (100,000 iterations). Data is transmitted over HTTPS.',
  },
  {
    q: 'Is ENV Store free to use?',
    a: 'Yes, ENV Store is completely free and open source. There are no paid plans or premium features.',
  },
  {
    q: 'Can I export my environment variables?',
    a: 'Absolutely! You can export your variables to the standard .env format from any project in your dashboard.',
  },
  {
    q: 'How do I delete my account?',
    a: 'You can delete all your projects from the dashboard. To completely remove your account, please contact me via email.',
  },
  {
    q: 'Can I contribute to ENV Store?',
    a: 'Yes! ENV Store is open source. Check out the GitHub repository to get started. Pull requests are welcome!',
  },
];

export default function ContactPage() {
  return (
    <>
      <main className="mx-auto w-full max-w-4xl px-6 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            Get in Touch
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Have questions about ENV Store? Need help? I&apos;d love to hear
            from you.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {links.map((link) => (
            <a
              key={link.title}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="group flex flex-col gap-4 rounded-lg border p-6 transition-colors hover:bg-muted/50"
            >
              <div className="flex size-10 items-center justify-center rounded-lg border text-muted-foreground transition-colors group-hover:text-foreground">
                <HugeiconsIcon icon={link.icon} size={18} />
              </div>
              <div>
                <h2 className="text-sm font-semibold">{link.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {link.desc}
                </p>
                <p className="mt-2 text-sm text-foreground">{link.label}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
          <div className="divide-y border-t">
            {faqs.map((faq) => (
              <details key={faq.q} className="group">
                <summary className="flex cursor-pointer items-center justify-between py-5 text-sm font-semibold select-none">
                  {faq.q}
                  <span className="ml-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="pb-5 text-sm text-muted-foreground">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          Response time: Usually within 24-48 hours
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
