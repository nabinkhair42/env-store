import { HugeiconsIcon } from '@hugeicons/react';
import {
  LockKeyIcon,
  ShieldKeyIcon,
  GithubIcon,
  Globe02Icon,
  SourceCodeIcon,
  UserMultiple02Icon,
} from '@hugeicons/core-free-icons';

const notes = [
  {
    icon: LockKeyIcon,
    title: 'AES-256-GCM encryption',
    desc: 'Every variable value is encrypted at rest with authenticated encryption.',
  },
  {
    icon: ShieldKeyIcon,
    title: 'PBKDF2 key derivation',
    desc: '100,000 iterations with a unique random salt per value. Resistant to brute-force attacks.',
  },
  {
    icon: GithubIcon,
    title: 'GitHub OAuth',
    desc: 'No passwords stored. Authentication is delegated to GitHub.',
  },
  {
    icon: UserMultiple02Icon,
    title: 'Role-based access',
    desc: 'Owner, editor, viewer roles. Control who can see and modify secrets.',
  },
  {
    icon: Globe02Icon,
    title: 'HTTPS everywhere',
    desc: 'TLS protects all data in transit between your browser and our servers.',
  },
  {
    icon: SourceCodeIcon,
    title: 'Fully open source',
    desc: 'Audit every line of code. No hidden data collection or telemetry.',
  },
];

export default function SecurityNotes() {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-24">
      <p className="text-xs font-medium text-muted-foreground">Security</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
        Built with security at every layer
      </h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Your environment variables contain sensitive data. Here&apos;s how ENV Store
        keeps them safe.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((note, i) => (
          <div key={i} className="rounded-xl border bg-card p-5">
            <div className="mb-3 inline-flex size-9 items-center justify-center rounded-lg bg-muted border text-muted-foreground">
              <HugeiconsIcon icon={note.icon} size={16} strokeWidth={1.5} />
            </div>
            <h3 className="text-sm font-semibold">{note.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              {note.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
