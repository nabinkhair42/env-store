import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';

const notes = [
  'All variables are encrypted at rest using AES-256-GCM with authenticated encryption.',
  'Key derivation uses PBKDF2 with 100,000 iterations and a unique random salt per value.',
  'GitHub OAuth for authentication — no passwords stored.',
  'HTTPS/TLS protects all data in transit.',
  'Fully open source — audit the code anytime.',
];

export default function SecurityNotes() {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-20">
      <p className="text-xs font-medium text-muted-foreground">Security</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
        Built with security at every layer
      </h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Your environment variables contain sensitive data. Here is how ENV Store
        keeps them safe.
      </p>

      <div className="mt-10 space-y-4">
        {notes.map((note, i) => (
          <div key={i} className="flex items-start gap-3">
            <HugeiconsIcon
              icon={CheckmarkCircle01Icon}
              size={18}
              className="text-muted-foreground shrink-0 mt-0.5"
            />
            <p className="text-sm text-muted-foreground">{note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
