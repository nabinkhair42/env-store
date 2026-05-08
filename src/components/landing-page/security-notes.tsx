import {
  GithubIcon,
  Globe02Icon,
  LockKeyIcon,
  ShieldKeyIcon,
  SourceCodeIcon,
  UserMultiple02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const notes = [
  {
    icon: LockKeyIcon,
    title: 'AES-256-GCM at rest',
    desc: 'Every value is encrypted before it hits the database. Authenticated encryption catches tampering.',
  },
  {
    icon: ShieldKeyIcon,
    title: 'PBKDF2 key derivation',
    desc: '100,000 iterations with a unique salt per value. Brute force is not a viable attack.',
  },
  {
    icon: GithubIcon,
    title: 'GitHub OAuth',
    desc: 'We never see or store passwords. Authentication is delegated to GitHub.',
  },
  {
    icon: UserMultiple02Icon,
    title: 'Role-based access',
    desc: 'Owner, editor, and viewer roles per project. Read and write access controlled at the project level.',
  },
  {
    icon: Globe02Icon,
    title: 'TLS in transit',
    desc: 'HTTPS for every request. No plaintext on the wire between your browser and our servers.',
  },
  {
    icon: SourceCodeIcon,
    title: 'Open source',
    desc: 'Source on GitHub. Audit it, fork it, or self-host it. No hidden telemetry.',
  },
];

export default function SecurityNotes() {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-24">
      <p className="font-medium text-muted-foreground">Security</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
        Built with security at every layer
      </h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Your environment variables contain sensitive data. Here&apos;s how ENV Store
        keeps them safe.
      </p>

      <div className="mt-12 grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((note, i) => (
          <div key={i} className="h-full rounded-xl border bg-muted p-1.5">
            <div className='rounded-lg border bg-card p-5 h-full w-full'>
              <div className="mb-3 inline-flex size-10 items-center justify-center rounded-lg bg-muted border">
                <HugeiconsIcon icon={note.icon} size={16} strokeWidth={2} />
              </div>
              <h3 className="text-sm font-semibold">{note.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                {note.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
