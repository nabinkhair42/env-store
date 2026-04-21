import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';

const notes = [
  'All environment variables are encrypted at rest using AES-256-GCM encryption.',
  'Key derivation uses PBKDF2 with 100,000 iterations and unique salts.',
  'Data is encrypted before leaving your browser and only decrypted when you view it.',
  'GitHub OAuth provides secure authentication without storing passwords.',
  'HTTPS/TLS encryption protects all data in transit.',
  'Treat stored values as secrets and rotate API keys regularly.',
  'Organize projects by environment to minimize accidental exposure.',
  'Never commit real environment variables to version control.',
  'Regularly audit stored variables and remove ones no longer needed.',
];

export default function SecurityNotes() {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-20">
      <p className="text-xs font-medium  text-muted-foreground">
        Security
      </p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
        Built with security at every layer
      </h2>
      <p className="mt-2 max-w-2xl text-base text-muted-foreground">
        Your environment variables contain sensitive information. ENV Store uses
        industry-standard encryption to keep your data private and secure.
      </p>

      <div className="mt-10 space-y-4">
        {notes.map((note, i) => (
          <div key={i} className="flex items-start gap-3">
            <HugeiconsIcon
              icon={CheckmarkCircle01Icon}
              size={18}
              className="text-muted-foreground shrink-0 mt-0.5"
            />
            <span className="text-sm leading-relaxed text-muted-foreground">
              {note}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
