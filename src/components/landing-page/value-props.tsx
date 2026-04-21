'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  Copy01Icon,
  DatabaseIcon,
  Globe02Icon,
  SecurityCheckIcon,
  LockKeyIcon,
  GithubIcon,
} from '@hugeicons/core-free-icons';

const features = [
  {
    title: 'Project-scoped storage',
    desc: 'Keep keys grouped by project and environment (dev, staging, prod).',
    icon: DatabaseIcon,
  },
  {
    title: 'Fast copy & export',
    desc: 'Copy values or export .env files instantly with one click.',
    icon: Copy01Icon,
  },
  {
    title: 'GitHub OAuth',
    desc: 'Quick and secure access from any browser.',
    icon: GithubIcon,
  },
  {
    title: 'No CLI required',
    desc: 'Simple web interface - just open, paste, and save.',
    icon: Globe02Icon,
  },
  {
    title: 'End-to-end encryption',
    desc: 'All environment variables are encrypted before storage and decrypted only when you access them.',
    icon: LockKeyIcon,
  },
  {
    title: 'Secure by design',
    desc: 'Your data stays private with industry-standard encryption and secure authentication.',
    icon: SecurityCheckIcon,
  },
];

export default function ValueProps() {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-20">
      <p className="text-xs font-medium text-muted-foreground">Features</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
        Everything you need to manage environment variables
      </h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Built for developers who need reliable, secure access to their project
        configurations.
      </p>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((item, i) => (
          <div key={i}>
            <div className="mb-3 inline-flex size-10 items-center justify-center rounded-lg border text-muted-foreground">
              <HugeiconsIcon icon={item.icon} size={18} strokeWidth={1.5} />
            </div>
            <h3 className="text-sm font-semibold">{item.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
