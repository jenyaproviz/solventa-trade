import { Router } from 'express';
import { createContactMessage, deleteContactMessage, listContactMessages } from '../data/contactStore.js';
import { requireAdmin } from '../middleware/requireAuth.js';
import { sendContactEmail } from '../services/mailer.js';

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  website?: unknown;
  attachment?: unknown;
  attachmentName?: unknown;
  attachmentType?: unknown;
};

export const contactRouter = Router();

contactRouter.get('/', requireAdmin, async (_req, res) => {
  try {
    const items = await listContactMessages();
    return res.json({ items });
  } catch (error) {
    console.error('[contact] Failed to load saved contact messages:', error);
    return res.status(500).json({ message: 'Failed to load contact messages.' });
  }
});

contactRouter.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await deleteContactMessage(req.params.id);
    return res.json({ ok: true });
  } catch (error) {
    console.error('[contact] Failed to delete contact message:', error);
    return res.status(500).json({ message: 'Failed to delete contact message.' });
  }
});

contactRouter.post('/', async (req, res) => {
  const { name, email, subject, message, website, attachment, attachmentName, attachmentType } = req.body as ContactPayload;

  if (typeof website === 'string' && website.trim() !== '') {
    return res.status(202).json({ ok: true, saved: false, delivered: false, message: 'Contact message ignored.' });
  }

  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof message !== 'string' ||
    name.trim() === '' ||
    email.trim() === '' ||
    message.trim() === ''
  ) {
    return res.status(400).json({ message: 'Name, email, and message are required.' });
  }

  const mailAttachment =
    typeof attachment === 'string' && attachment.length > 0
      ? {
          filename: typeof attachmentName === 'string' && attachmentName.trim() !== '' ? attachmentName.trim() : 'attachment',
          content: Buffer.from(attachment, 'base64'),
          contentType: typeof attachmentType === 'string' && attachmentType.trim() !== '' ? attachmentType.trim() : 'application/octet-stream',
        }
      : undefined;

  const normalizedSubject = typeof subject === 'string' && subject.trim() !== '' ? subject.trim() : 'Contact from Solventa website';

  try {
    await createContactMessage({
      name: name.trim(),
      email: email.trim(),
      subject: normalizedSubject,
      message: message.trim(),
      attachment: typeof attachment === 'string' ? attachment : '',
      attachmentName: typeof attachmentName === 'string' ? attachmentName.trim() : '',
      attachmentType: typeof attachmentType === 'string' ? attachmentType.trim() : '',
    });
  } catch (err) {
    console.error('[contact] Failed to save contact message:', err);
    return res.status(500).json({ message: 'Failed to save contact message.' });
  }

  try {
    await sendContactEmail({
      fromName: name.trim(),
      fromEmail: email.trim(),
      subject: normalizedSubject,
      message: message.trim(),
      attachment: mailAttachment,
    });
    return res.status(201).json({
      ok: true,
      saved: true,
      delivered: true,
      message: 'Contact message saved and emailed successfully.',
    });
  } catch (err) {
    console.error('[contact] Email delivery failed after saving message:', err);
    const errorMessage = err instanceof Error ? err.message : 'Email delivery failed.';
    return res.status(202).json({
      ok: true,
      saved: true,
      delivered: false,
      message: `Contact message saved, but email delivery failed. ${errorMessage}`,
    });
  }
});