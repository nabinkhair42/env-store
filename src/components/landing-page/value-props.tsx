'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  Copy01Icon,
  DatabaseIcon,
  Globe02Icon,
  Layers01Icon,
  LockKeyIcon,
  UserMultiple02Icon,
} from '@hugeicons/core-free-icons';

const features = [
  {
    title: 'Multi-environment support',
    desc: 'Dev, staging, production — each with its own variables. Switch with tabs.',
    icon: Layers01Icon,
  },
  {
    title: 'Team sharing',
    desc: 'Invite members by GitHub username. Assign editor or viewer roles.',
    icon: UserMultiple02Icon,
  },
  {
    title: 'Project-scoped storage',
    desc: 'Group variables by project. Organize across all your applications.',
    icon: DatabaseIcon,
  },
  {
    title: 'Fast copy & export',
    desc: 'Copy values or download .env files per environment with one click.',
    icon: Copy01Icon,
  },
  {
    title: 'No CLI required',
    desc: 'Simple web interface — open, paste, save. Import .env files instantly.',
    icon: Globe02Icon,
  },
  {
    title: 'Encrypted at rest',
    desc: 'AES-256-GCM encryption with per-value salts. Your secrets stay secret.',
    icon: LockKeyIcon,
  },
];

export default function ValueProps() {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-24">
      <p className="text-xs font-medium text-muted-foreground">Features</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
        Everything you need to manage environment variables
      </h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Built for teams that need reliable, secure access to their project
        configurations across every environment.
      </p>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((item, i) => (
          <div key={i}>
            <div className="mb-3 inline-flex size-10 items-center justify-center rounded-lg bg-muted border text-muted-foreground">
              <HugeiconsIcon icon={item.icon} size={18} strokeWidth={1.5} />
            </div>
            <h3 className="text-sm font-semibold">{item.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
