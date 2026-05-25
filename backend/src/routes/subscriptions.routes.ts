import { Router } from 'express';
import { createSubscription, findSubscriptionByEmail } from '../data/subscriptionStore.js';

export const subscriptionsRouter = Router();

subscriptionsRouter.post('/', async (req, res) => {
  const { email } = req.body as { email?: unknown };

  if (typeof email !== 'string' || email.trim() === '') {
    return res.status(400).json({ message: 'Email is required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

  if (!isValidEmail) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }

  const alreadyExists = await findSubscriptionByEmail(normalizedEmail);
  if (alreadyExists) {
    return res.json({ ok: true, message: 'You are already subscribed.' });
  }

  await createSubscription(normalizedEmail);

  return res.status(201).json({ ok: true, message: 'Subscription successful.' });
});