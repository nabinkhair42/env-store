import { CheckCheck, Shield } from 'lucide-react';

interface SecurityNotesProps {
  notes?: string[];
}

export default function SecurityNotes({
  notes = [
    'Treat stored values as secrets and rotate keys if exposed.',
    'Prefer separate projects per environment (local, staging, production).',
    'Limit access to trusted collaborators only.',
  ],
}: SecurityNotesProps) {
  return (
    <section className="px-6 py-20 border-t border-dashed">
      <div className="rounded-2xl p-10">
        <div className="mb-8 flex items-center justify-center">
          <div className="p-4 rounded-full bg-primary/10 text-primary">
            <Shield className="h-10 w-10" />
          </div>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Security & Best Practices
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your environment variables are sensitive data. Follow these
            guidelines to keep them secure.
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-6">
          {notes.map((note, index) => (
            <div
              key={index}
              className="flex items-start gap-2 p-2 border border-dashed rounded-none"
            >
              <CheckCheck className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                {note}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
