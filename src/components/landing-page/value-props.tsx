'use client';

import {
  Copy01Icon,
  DatabaseIcon,
  Layers01Icon,
  UserMultiple02Icon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const features = [
  {
    title: 'Per-environment variables',
    desc: 'Separate sets for dev, staging, and production. Switch via tabs. Add custom environments anytime.',
    icon: Layers01Icon,
  },
  {
    title: 'Team access by GitHub',
    desc: 'Invite teammates by GitHub username. Assign editor or viewer roles per project.',
    icon: UserMultiple02Icon,
  },
  {
    title: 'Project-scoped storage',
    desc: 'Group variables by project. Each app keeps its own keys, so nothing leaks between repos.',
    icon: DatabaseIcon,
  },
  {
    title: 'One-click export',
    desc: 'Copy a single value or download the full .env for any environment. Pastes straight into your shell.',
    icon: Copy01Icon,
  },

];

export default function ValueProps() {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-24">
      <p className="font-medium text-muted-foreground">Features</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
        Everything you need to manage environment variables
      </h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Built for teams that share configs across machines, environments, and
        people.
      </p>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {features.map((item, i) => (
          <div key={i} className='bg-muted p-1.5 rounded-xl border'>
            <div className='rounded-lg border bg-card p-5 h-full w-full'>
              <div className="mb-3 inline-flex size-10 items-center justify-center rounded-lg bg-muted border">
                <HugeiconsIcon icon={item.icon} size={18} strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-semibold">{item.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
