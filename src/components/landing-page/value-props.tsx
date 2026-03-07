'use client';

import {
  Copy01,
  Database,
  Globe01,
  SecurityCheck,
  Lightning01,
} from 'hugeicons-react';
import { FaGithub } from 'react-icons/fa6';

export default function ValueProps() {
  const features = [
    {
      title: 'Project-scoped storage',
      desc: 'Keep keys grouped by project and environment (dev, staging, prod).',
      icon: Database,
    },
    {
      title: 'Fast copy & export',
      desc: 'Copy values or export .env files instantly with one click.',
      icon: Copy01,
    },
    {
      title: 'GitHub OAuth',
      desc: 'Quick and secure access from any browser.',
      icon: FaGithub,
    },
    {
      title: 'No CLI required',
      desc: 'Simple web interface - just open, paste, and save.',
      icon: Globe01,
    },
    {
      title: 'Secure by design',
      desc: 'Your data stays private with industry-standard encryption.',
      icon: SecurityCheck,
    },
    {
      title: 'Lightning fast',
      desc: 'Instant search, copy, and export. No waiting around.',
      icon: Lightning01,
    },
  ];
  return (
    <section className="relative">
      {/* Section header */}
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="pb-6 pt-16">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Features
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Everything you need to manage environment variables
          </h2>
          <p className="mt-2 max-w-2xl text-base text-muted-foreground">
            Built for developers who need reliable, secure access to their
            project configurations.
          </p>
        </div>
      </div>

      {/* Grid with dashed internal dividers */}
      <div className="rail-bounded border-t border-dashed border-border">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item, i) => (
            <div
              key={i}
              className={`group px-6 py-8 transition-colors hover:bg-muted/20
                ${i % 3 !== 0 ? 'lg:border-l lg:border-dashed lg:border-border' : ''}
                ${i % 2 !== 0 ? 'sm:max-lg:border-l sm:max-lg:border-dashed sm:max-lg:border-border' : ''}
                ${i >= 3 ? 'lg:border-t lg:border-dashed lg:border-border' : ''}
                ${i >= 2 ? 'sm:max-lg:border-t sm:max-lg:border-dashed sm:max-lg:border-border' : ''}
                ${i >= 1 ? 'max-sm:border-t max-sm:border-dashed max-sm:border-border' : ''}
              `}
            >
              <div className="mb-4 inline-flex size-10 items-center justify-center rounded-xl border border-border bg-muted/30 text-muted-foreground transition-colors group-hover:text-foreground">
                <item.icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </div>
              <h3 className="text-[15px] font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
