import { siteConfig } from '@/lib/sitemap';
import { env } from '@/schema/env';
import { Resend } from 'resend';

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

const FROM_EMAIL = `${siteConfig.name} <noreply@${new URL(siteConfig.url).hostname}>`;

export type EmailResult =
  | { status: 'sent' }
  | { status: 'disabled' }
  | { status: 'failed'; error: string };

export async function sendInviteEmail(params: {
  to: string;
  inviterName: string;
  projectName: string;
  role: string;
  inviteUrl: string;
}): Promise<EmailResult> {
  if (!resend) {
    console.warn('[email] RESEND_API_KEY not set — invite email skipped');
    return { status: 'disabled' };
  }

  const { to, inviterName, projectName, role, inviteUrl } = params;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `${inviterName} invited you to "${projectName}" on ${siteConfig.name}`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>${siteConfig.name}</h2>
          <p><strong>${inviterName}</strong> invited you to collaborate on <strong>${projectName}</strong> as <strong>${role}</strong>.</p>
          <p>Click the button below to accept or decline:</p>
          <a href="${inviteUrl}" style="display: inline-block; padding: 10px 20px; background: #171717; color: #fff; text-decoration: none; border-radius: 6px;">
            View Invitation
          </a>
          <p style="margin-top: 24px; font-size: 13px; color: #666;">
            If you don't have an account, sign in with GitHub and the invitation will appear in your notifications.
          </p>
          <p style="margin-top: 12px; font-size: 12px; color: #999; word-break: break-all;">
            Or copy this link: ${inviteUrl}
          </p>
        </div>
      `,
    });

    if (result.error) {
      console.error('[email] Resend rejected invite email:', result.error);
      return { status: 'failed', error: result.error.message };
    }

    return { status: 'sent' };
  } catch (error) {
    console.error('[email] Failed to send invite email:', error);
    return {
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function sendNotificationEmail(params: {
  to: string;
  subject: string;
  message: string;
}): Promise<EmailResult> {
  if (!resend) {
    return { status: 'disabled' };
  }

  try {
    const result = await resend.emails.send({
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

    if (result.error) {
      console.error('[email] Resend rejected notification email:', result.error);
      return { status: 'failed', error: result.error.message };
    }

    return { status: 'sent' };
  } catch (error) {
    console.error('[email] Failed to send notification email:', error);
    return {
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
