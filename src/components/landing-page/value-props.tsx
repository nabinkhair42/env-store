'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  Copy01Icon,
  DatabaseIcon,
  Globe02Icon,
  GithubIcon,
  Upload04Icon,
  LockKeyIcon,
} from '@hugeicons/core-free-icons';

const features = [
  {
    title: 'Project-scoped storage',
    desc: 'Group variables by project and environment — dev, staging, prod.',
    icon: DatabaseIcon,
  },
  {
    title: 'Fast copy & export',
    desc: 'Copy values or download .env files with one click.',
    icon: Copy01Icon,
  },
  {
    title: 'GitHub OAuth',
    desc: 'Sign in securely with your GitHub account. No passwords.',
    icon: GithubIcon,
  },
  {
    title: 'No CLI required',
    desc: 'Simple web interface — open, paste, save.',
    icon: Globe02Icon,
  },
  {
    title: '.env file import',
    desc: 'Upload or paste an existing .env file and it parses automatically.',
    icon: Upload04Icon,
  },
  {
    title: 'Encrypted at rest',
    desc: 'AES-256-GCM encryption with per-value salts. Your secrets stay secret.',
    icon: LockKeyIcon,
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
