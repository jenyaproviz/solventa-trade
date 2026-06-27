import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

function isSmtpConfigured(): boolean {
  return (
    env.smtpUser.trim() !== '' &&
    env.smtpPass.trim() !== '' &&
    env.smtpPass !== 'your-gmail-app-password'
  );
}

export type MailAttachment = {
  filename: string;
  content: Buffer;
  contentType: string;
};

function getSmtpConfigurationError(): string | null {
  if (env.smtpUser.trim() === '') {
    return 'SMTP is not configured: SMTP_USER is missing.';
  }

  if (env.smtpPass.trim() === '' || env.smtpPass === 'your-gmail-app-password') {
    return 'SMTP is not configured: replace SMTP_PASS with a real Gmail app password.';
  }

  return null;
}

export async function sendContactEmail(opts: {
  fromName: string;
  fromEmail: string;
  subject: string;
  message: string;
  attachment?: MailAttachment;
}): Promise<void> {
  if (!isSmtpConfigured()) {
    const configurationError = getSmtpConfigurationError() ?? 'SMTP is not configured.';

    console.error(
      '[mailer] Contact email not sent:',
      configurationError,
      `Recipient: ${env.contactRecipient}`
    );

    throw new Error(configurationError);
  }

  const transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
    connectionTimeout: 10000,
    socketTimeout: 10000,
    greetingTimeout: 10000,
  });

  const attachments = opts.attachment
    ? [
        {
          filename: opts.attachment.filename,
          content: opts.attachment.content,
          contentType: opts.attachment.contentType,
        },
      ]
    : [];

  await transporter.sendMail({
    from: `"${opts.fromName}" <${env.smtpUser}>`,
    replyTo: opts.fromEmail,
    to: env.contactRecipient,
    subject: opts.subject,
    text: `From: ${opts.fromName} <${opts.fromEmail}>\n\n${opts.message}`,
    html: `<p><strong>From:</strong> ${opts.fromName} &lt;${opts.fromEmail}&gt;</p><pre style="font-family:inherit">${opts.message}</pre>`,
    attachments,
  });
}
