import { CheckCircle2 } from 'lucide-react';

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
    <section className="px-6 py-24 border-t border-dashed">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-medium text-foreground mb-4">
            Security & Best Practices
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your environment variables are sensitive data. Follow these
            guidelines to keep them secure.
          </p>
        </div>

        <div className="space-y-2 max-w-2xl mx-auto">
          {notes.map((note, index) => (
            <div key={index} className="flex items-start gap-1">
              <CheckCircle2 className="size-4 text-green-500 shrink-0 mt-1" />
              <span className="text-foreground leading-relaxed">{note}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
