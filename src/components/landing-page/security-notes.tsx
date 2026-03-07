import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';

interface SecurityNotesProps {
  notes?: string[];
}

export default function SecurityNotes({
  notes = [
    'All environment variables are encrypted at rest using AES-256-GCM encryption, the same standard used by governments and financial institutions worldwide.',
    'Key derivation uses PBKDF2 with 100,000 iterations and unique salts, making brute-force attacks computationally infeasible.',
    'Data is encrypted before leaving your browser and only decrypted when you view it, ensuring end-to-end protection.',
    'GitHub OAuth provides secure authentication without storing passwords, reducing the risk of credential theft.',
    'HTTPS/TLS encryption protects all data in transit between your browser and our servers.',
    'Treat stored values as secrets and rotate API keys regularly, especially if you suspect any unauthorized access.',
    'Organize your projects by environment (development, staging, production) to minimize the impact of accidental exposure.',
    'Never commit real environment variables to version control - use ENV Store to keep them separate and secure.',
    'Regularly audit your stored variables and remove any that are no longer needed to minimize your security footprint.',
  ],
}: SecurityNotesProps) {
  return (
    <section className="relative">
      {/* Section header */}
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="pb-6 pt-16">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Security
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Military-grade encryption for your environment variables
          </h2>
          <p className="mt-2 max-w-2xl text-base text-muted-foreground">
            Your environment variables contain sensitive information like API
            keys, database credentials, and secrets. ENV Store implements
            industry-standard security measures to protect your data at every
            layer. We use the same encryption algorithms trusted by banks,
            healthcare providers, and government agencies to ensure your
            configurations remain private and secure.
          </p>
        </div>
      </div>

      {/* Security features list */}
      <div className="rail-bounded border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-6 py-12">
          <div className="space-y-4 max-w-4xl">
            {notes.map((note, index) => (
              <div key={index} className="flex items-start gap-3">
                <HugeiconsIcon
                  icon={CheckmarkCircle01Icon}
                  size={20}
                  className="text-emerald-500 shrink-0 mt-0.5"
                />
                <span className="text-base leading-relaxed text-muted-foreground">
                  {note}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
