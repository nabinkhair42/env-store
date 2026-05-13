import {
  Copy01Icon,
  DatabaseIcon,
  Layers01Icon,
  LockKeyIcon,
  ShieldKeyIcon,
  UserMultiple02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const features = [
  {
    title: 'Per-environment variables',
    desc: 'Separate sets for dev, staging, and production. Switch via tabs. Custom envs anytime.',
    icon: Layers01Icon,
  },
  {
    title: 'GitHub-based team access',
    desc: 'Invite by GitHub username. Assign editor or viewer roles per project.',
    icon: UserMultiple02Icon,
  },
  {
    title: 'Project-scoped storage',
    desc: 'Each app keeps its own keys. Nothing leaks between repos or environments.',
    icon: DatabaseIcon,
  },
  {
    title: 'One-click export',
    desc: 'Copy a single value or download the full .env. Pastes straight into your shell.',
    icon: Copy01Icon,
  },
  {
    title: 'AES-256-GCM at rest',
    desc: 'Every value is encrypted before it hits the database. Authenticated encryption catches tampering.',
    icon: LockKeyIcon,
  },
  {
    title: 'Role-based access',
    desc: 'Owner, editor, and viewer roles. Granular control at the project level.',
    icon: ShieldKeyIcon,
  },
];

export default function ValueProps() {
  return (
    <section
      id="features"
      className="relative border-t border-border/60"
    >
      <div className="mx-auto w-full max-w-[1024px] px-6 py-24 sm:py-32">
        <div className="grid gap-8 sm:grid-cols-12">
          <div className="sm:col-span-7">
            <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
              Features
            </p>
            <h2 className="mt-3 text-2xl font-medium tracking-[-0.015em] text-balance sm:text-[32px] sm:leading-[1.15]">
              Built for the way you ship configs.
            </h2>
          </div>
          <p className="text-base text-muted-foreground sm:col-span-5 sm:self-end sm:text-[15px] sm:leading-[1.6]">
            Encrypted by default. Free for everyone. Open source under MIT.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 overflow-hidden rounded-xl border border-border/60 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            return (
              <div
                key={f.title}
                className={[
                  'relative bg-background p-6 sm:p-7',
                  col !== 2 ? 'lg:border-r lg:border-border/60' : '',
                  row === 0 ? 'lg:border-b lg:border-border/60' : '',
                  i % 2 === 0 ? 'sm:border-r sm:border-border/60' : '',
                  i < features.length - 2 ? 'sm:border-b sm:border-border/60' : '',
                  i < features.length - 1 ? 'border-b border-border/60 sm:border-b-0' : '',
                ].join(' ')}
              >
                <div className="inline-flex size-9 items-center justify-center rounded-md border border-border/60 bg-muted/40">
                  <HugeiconsIcon icon={f.icon} size={16} strokeWidth={1.75} />
                </div>
                <h3 className="mt-4 text-[15px] font-medium tracking-tight">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
