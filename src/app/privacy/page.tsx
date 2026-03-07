import { Metadata } from 'next';
import SiteFooter from '@/components/layouts/site-footer';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy Policy for ENV Store - Learn how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  return (
    <>
      <main className="mx-auto w-full max-w-4xl px-6 py-16">
        <div className="prose prose-invert max-w-none">
          <h1 className="mb-2 text-4xl font-bold tracking-tight">
            Privacy Policy
          </h1>
          <p className="mb-8 text-sm text-muted-foreground">
            Last updated:{' '}
            {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Introduction</h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              ENV Store (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is
              committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, disclose, and safeguard your information when
              you use our environment variable management service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              Information We Collect
            </h2>

            <h3 className="mb-3 text-xl font-semibold">
              Authentication Information
            </h3>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              When you sign in using GitHub OAuth, we collect:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Your GitHub username and email address</li>
              <li>Your GitHub profile information (name, avatar)</li>
              <li>OAuth access tokens for authentication</li>
            </ul>

            <h3 className="mb-3 text-xl font-semibold">
              Environment Variable Data
            </h3>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              We store the environment variables you choose to save in our
              service. This data is:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Encrypted at rest using AES-256-GCM encryption</li>
              <li>Only accessible by you through authenticated sessions</li>
              <li>Never shared with third parties</li>
              <li>Stored securely in our database infrastructure</li>
            </ul>

            <h3 className="mb-3 text-xl font-semibold">Usage Information</h3>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              We automatically collect certain information about your device and
              how you interact with our service, including:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>IP address and browser type</li>
              <li>Pages visited and features used</li>
              <li>Timestamps of your interactions</li>
              <li>Error logs and diagnostic data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              How We Use Your Information
            </h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              We use the collected information to:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Provide and maintain our service</li>
              <li>Authenticate and authorize your access</li>
              <li>Store and manage your environment variables securely</li>
              <li>Improve and optimize our service performance</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Monitor for security threats and prevent fraud</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Data Security</h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              We implement industry-standard security measures to protect your
              data:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                AES-256-GCM encryption for all environment variables at rest
              </li>
              <li>HTTPS/TLS encryption for data in transit</li>
              <li>PBKDF2 key derivation with 100,000 iterations</li>
              <li>Secure session management and authentication</li>
              <li>Regular security audits and updates</li>
            </ul>
            <p className="leading-relaxed text-muted-foreground">
              However, no method of transmission over the Internet or electronic
              storage is 100% secure. While we strive to use commercially
              acceptable means to protect your data, we cannot guarantee
              absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Data Retention</h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              We retain your personal information and environment variables for
              as long as your account is active or as needed to provide you
              services. You can delete your projects and associated environment
              variables at any time through the dashboard. Account deletion will
              permanently remove all your data from our systems.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              Third-Party Services
            </h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              We use the following third-party services:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>GitHub OAuth</strong> - For authentication and
                authorization
              </li>
              <li>
                <strong>MongoDB Atlas</strong> - For secure data storage
              </li>
              <li>
                <strong>Vercel</strong> - For hosting and deployment
              </li>
            </ul>
            <p className="leading-relaxed text-muted-foreground">
              These services have their own privacy policies. We encourage you
              to review them.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Your Rights</h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              You have the right to:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Access your personal information</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Delete your account and all associated data</li>
              <li>Export your environment variables</li>
              <li>Withdraw consent for data processing</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              Children&apos;s Privacy
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              Our service is not intended for children under 13 years of age. We
              do not knowingly collect personal information from children under
              13. If you become aware that a child has provided us with personal
              information, please contact us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              Changes to This Privacy Policy
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page
              and updating the &quot;Last updated&quot; date. You are advised to
              review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Contact Us</h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              If you have any questions about this Privacy Policy, please
              contact us:
            </p>
            <ul className="list-none space-y-2 text-muted-foreground">
              <li>
                <strong>Email:</strong> nabinkhair12@gmail.com
              </li>
              <li>
                <strong>Website:</strong>{' '}
                <a
                  href="https://nabinkhair.com.np"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  nabinkhair.com.np
                </a>
              </li>
              <li>
                <strong>GitHub:</strong>{' '}
                <a
                  href="https://github.com/nabinkhair42"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @nabinkhair42
                </a>
              </li>
            </ul>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
