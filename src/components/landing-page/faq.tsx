import { ArrowLeft01FreeIcons } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

interface FAQProps {
  items?: {
    q: string;
    a: string;
  }[];
}

export default function FAQ({
  items = [
    {
      q: 'Do you support bulk import?',
      a: 'Export is available now; .env import is on the roadmap.',
    },
    {
      q: 'Is there a CLI?',
      a: 'Not required the web app handles add, copy, and export.',
    },
    {
      q: 'Can I self-host?',
      a: 'Yes see the repository for setup details.',
    },
    {
      q: 'Is it free?',
      a: 'The hosted app is free to use.',
    },
  ],
}: FAQProps) {
  return (
    <section className="px-6 py-24 border-t border-dashed">
      <div className="max-w-3xl mx-auto">
        <h2 className="mb-12 text-center text-4xl font-medium text-foreground">
          Frequently asked questions
        </h2>

        <div className="space-y-6">
          {items.map((item, index) => (
            <div key={index} className="space-y-2">
              <h3 className="text-lg font-medium text-foreground">{item.q}</h3>
              <p className="text-muted-foreground">
                <HugeiconsIcon
                  icon={ArrowLeft01FreeIcons}
                  className="inline-block mr-2 size-4 rotate-180 text-muted-foreground"
                />
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
