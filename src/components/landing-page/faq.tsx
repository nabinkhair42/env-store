import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    q: 'How is my data protected?',
    a: 'Every value is encrypted at rest with AES-256-GCM and PBKDF2 key derivation (100,000 iterations, unique salt per value). Authentication runs through GitHub OAuth, and all traffic uses HTTPS.',
  },
  {
    q: 'Can I import an existing .env file?',
    a: 'Yes. Paste the contents into the editor and it parses each KEY=VALUE pair automatically. Comments and blank lines are handled correctly.',
  },
  {
    q: 'How do I export my variables?',
    a: 'Open a project and click Export. You get a standard .env file per environment. You can also copy individual values or the full file to your clipboard.',
  },
  {
    q: 'Is ENV Store free?',
    a: 'Yes. Fully free and open source. No paid plans, no paywalls, no premium tiers.',
  },
  {
    q: 'Can I share variables with my team?',
    a: 'Yes. Invite teammates by GitHub username and assign them as editors (full access) or viewers (read only). They get in-app and email notifications.',
  },
  {
    q: 'How do environments work?',
    a: 'Every project ships with development, staging, and production environments. Switch between them via tabs, or add custom environments like qa or preview. Each environment keeps its own set of variables.',
  },
];

export default function FAQ() {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-24">
      <p className="font-medium text-muted-foreground">FAQ</p>
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
