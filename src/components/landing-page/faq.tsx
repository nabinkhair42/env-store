import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    q: 'How is my data protected?',
    a: 'All variables are encrypted at rest using AES-256-GCM with PBKDF2 key derivation (100,000 iterations, unique salt per value). Authentication uses GitHub OAuth, and all traffic runs over HTTPS.',
  },
  {
    q: 'Can I import an existing .env file?',
    a: 'Yes. Paste the contents of any .env file into the editor and it will parse each KEY=VALUE pair automatically. Comments and blank lines are handled gracefully.',
  },
  {
    q: 'How do I export my variables?',
    a: 'Open any project and click Export. You get a standard .env file per environment. You can also copy individual values or the entire file to clipboard.',
  },
  {
    q: 'Is ENV Store free?',
    a: 'Yes — completely free and open source. No plans, paywalls, or premium tiers.',
  },
  {
    q: 'Can I share variables with my team?',
    a: 'Yes. Invite team members by GitHub username or email. Assign them as editors (full access) or viewers (read-only). They get in-app and email notifications.',
  },
  {
    q: 'How do environments work?',
    a: 'Each project comes with development, staging, and production environments by default. Switch between them with tabs. You can add custom environments like QA or preview. Each environment has its own set of variables.',
  },
];

export default function FAQ() {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-20">
      <p className="text-xs font-medium text-muted-foreground">FAQ</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
        Frequently asked questions
      </h2>

      <div className="mt-10">
        <Accordion type="single" collapsible>
          {faqs.map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">{item.a}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
