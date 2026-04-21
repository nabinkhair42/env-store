import { siteConfig } from '@/lib/sitemap';
import { env } from '@/schema/env';
import { Resend } from 'resend';

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

const FROM_EMAIL = `${siteConfig.name} <noreply@${new URL(siteConfig.url).hostname}>`;

export async function sendInviteEmail(params: {
  to: string;
  inviterName: string;
  projectName: string;
  role: string;
}) {
  if (!resend) return;

  const { to, inviterName, projectName, role } = params;

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `${inviterName} invited you to "${projectName}" on ${siteConfig.name}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>${siteConfig.name}</h2>
        <p><strong>${inviterName}</strong> invited you to collaborate on <strong>${projectName}</strong> as <strong>${role}</strong>.</p>
        <p>Sign in to accept or decline the invitation:</p>
        <a href="${siteConfig.url}/dashboard" style="display: inline-block; padding: 10px 20px; background: #171717; color: #fff; text-decoration: none; border-radius: 6px;">
          View Invitation
        </a>
        <p style="margin-top: 24px; font-size: 13px; color: #666;">
          If you don't have an account, sign in with GitHub and the invitation will be linked automatically.
        </p>
      </div>
    `,
  });
}

export async function sendNotificationEmail(params: {
  to: string;
  subject: string;
  message: string;
}) {
  if (!resend) return;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: params.to,
    subject: params.subject,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>${siteConfig.name}</h2>
        <p>${params.message}</p>
        <a href="${siteConfig.url}/dashboard" style="display: inline-block; padding: 10px 20px; background: #171717; color: #fff; text-decoration: none; border-radius: 6px;">
          Open Dashboard
        </a>
      </div>
    `,
  });
}
