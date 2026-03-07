import { Metadata } from 'next';
import SiteFooter from '@/components/layouts/site-footer';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms of Service for ENV Store - Read our terms and conditions for using our service.',
};

export default function TermsPage() {
  return (
    <>
      <main className="mx-auto w-full max-w-4xl px-6 py-16">
        <div className="prose prose-invert max-w-none">
          <h1 className="mb-2 text-4xl font-bold tracking-tight">
            Terms of Service
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
            <h2 className="mb-4 text-2xl font-semibold">Agreement to Terms</h2>
            <p className="leading-relaxed text-muted-foreground">
              By accessing or using ENV Store (&quot;Service&quot;), you agree
              to be bound by these Terms of Service (&quot;Terms&quot;). If you
              disagree with any part of these terms, you do not have permission
              to access the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              Description of Service
            </h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              ENV Store is a web-based application that provides secure storage
              and management of environment variables for developers. The
              Service allows you to:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                Store environment variables securely with AES-256-GCM encryption
              </li>
              <li>Organize variables by project</li>
              <li>Export variables to .env format</li>
              <li>Access your variables from any device</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">User Accounts</h2>

            <h3 className="mb-3 text-xl font-semibold">Account Creation</h3>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              To use the Service, you must create an account by authenticating
              through GitHub OAuth. You must:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Have a valid GitHub account</li>
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Be at least 13 years old</li>
            </ul>

            <h3 className="mb-3 text-xl font-semibold">
              Account Responsibility
            </h3>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              You are responsible for:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>All activities that occur under your account</li>
              <li>
                Maintaining the confidentiality of your authentication tokens
              </li>
              <li>Notifying us immediately of any unauthorized access</li>
              <li>The content of environment variables you store</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Acceptable Use</h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              You agree not to:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                Use the Service for any illegal purpose or in violation of any
                laws
              </li>
              <li>
                Store malicious code, illegal content, or copyrighted material
                without authorization
              </li>
              <li>
                Attempt to gain unauthorized access to any part of the Service
              </li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Upload viruses, malware, or any harmful code</li>
              <li>
                Use automated scripts to create accounts or access the Service
              </li>
              <li>
                Reverse engineer, decompile, or disassemble any part of the
                Service
              </li>
              <li>
                Use the Service to store personally identifiable information of
                others without consent
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              Data Storage and Security
            </h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              While we implement industry-standard security measures including
              AES-256-GCM encryption, you acknowledge that:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>No data transmission or storage method is 100% secure</li>
              <li>
                You are responsible for backing up your environment variables
              </li>
              <li>
                You should not store highly sensitive data (passwords, API keys
                with unrestricted access, etc.) without additional security
                measures
              </li>
              <li>
                We are not liable for any data loss, corruption, or unauthorized
                access
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              Intellectual Property
            </h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              The Service and its original content, features, and functionality
              are owned by Nabin Khair and are protected by international
              copyright, trademark, and other intellectual property laws.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              You retain ownership of the environment variables and data you
              store. By using the Service, you grant us permission to store and
              process this data solely for the purpose of providing the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              Service Availability
            </h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              We strive to maintain high availability but do not guarantee that
              the Service will be:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Always available or uninterrupted</li>
              <li>Free from errors, bugs, or security vulnerabilities</li>
              <li>Compatible with all devices and browsers</li>
            </ul>
            <p className="leading-relaxed text-muted-foreground">
              We reserve the right to modify, suspend, or discontinue the
              Service at any time with or without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              Limitation of Liability
            </h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              To the maximum extent permitted by law, ENV Store and its creator
              shall not be liable for:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                Any indirect, incidental, special, consequential, or punitive
                damages
              </li>
              <li>Loss of profits, data, use, or goodwill</li>
              <li>Service interruptions or data loss</li>
              <li>Unauthorized access to or alteration of your data</li>
              <li>Any third-party conduct or content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              Disclaimer of Warranties
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS
              AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
              IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR
              NON-INFRINGEMENT.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Termination</h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              We may terminate or suspend your account and access to the Service
              immediately, without prior notice or liability, for any reason,
              including if you breach these Terms.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              You may terminate your account at any time by deleting all your
              projects and ceasing to use the Service. Upon termination, your
              right to use the Service will immediately cease.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Indemnification</h2>
            <p className="leading-relaxed text-muted-foreground">
              You agree to indemnify and hold harmless ENV Store, its creator,
              and affiliates from any claims, damages, losses, or expenses
              (including legal fees) arising from your use of the Service,
              violation of these Terms, or infringement of any rights of another
              party.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Changes to Terms</h2>
            <p className="leading-relaxed text-muted-foreground">
              We reserve the right to modify these Terms at any time. We will
              notify users of any material changes by updating the &quot;Last
              updated&quot; date. Continued use of the Service after changes
              constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Governing Law</h2>
            <p className="leading-relaxed text-muted-foreground">
              These Terms shall be governed by and construed in accordance with
              the laws of Nepal, without regard to its conflict of law
              provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Contact Information</h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              If you have any questions about these Terms, please contact us:
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
