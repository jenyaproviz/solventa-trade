import { Resend } from 'resend';
import { env } from '../config/env.js';

const resend = new Resend(env.resendApiKey);

export type MailAttachment = {
  filename: string;
  content: Buffer;
  contentType: string;
};

export async function sendContactEmail(opts: {
  fromName: string;
  fromEmail: string;
  subject: string;
  message: string;
  attachment?: MailAttachment;
}): Promise<void> {
  const { error } = await resend.emails.send({
    from: 'Solventa Contact <onboarding@resend.dev>',
    replyTo: opts.fromEmail,
    to: env.contactRecipient,
    subject: opts.subject,
    text: `From: ${opts.fromName} <${opts.fromEmail}>\n\n${opts.message}`,
    html: `<p><strong>From:</strong> ${opts.fromName} &lt;${opts.fromEmail}&gt;</p><pre style="font-family:inherit">${opts.message}</pre>`,
    attachments: opts.attachment
      ? [{ filename: opts.attachment.filename, content: opts.attachment.content }]
      : undefined,
  });

  if (error) {
    throw new Error(error.message);
  }
}
