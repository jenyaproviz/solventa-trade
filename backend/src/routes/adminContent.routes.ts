import { Router } from 'express';
import {
  createAdminContentItem,
  deleteAdminContentItemByKey,
  getAdminContentItemByKey,
  listAdminContentItems,
  updateAdminContentItemByKey,
} from '../data/contentStore.js';
import { requireAdmin } from '../middleware/requireAuth.js';
import { requireCsrf } from '../middleware/requireCsrf.js';

export const adminContentRouter = Router();

function getRouteParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

adminContentRouter.get('/', requireAdmin, async (_req, res) => {
  const items = await listAdminContentItems();
  return res.json({ items });
});

adminContentRouter.get('/:key', requireAdmin, async (req, res) => {
  const item = await getAdminContentItemByKey(getRouteParam(req.params.key));

  if (!item) {
    return res.status(404).json({ message: 'Content item not found.' });
  }

  return res.json({ item });
});

adminContentRouter.post('/', requireAdmin, requireCsrf, async (req, res) => {
  const { key, title, body } = req.body as {
    key?: unknown;
    title?: unknown;
    body?: unknown;
  };

  if (typeof key !== 'string' || typeof title !== 'string' || typeof body !== 'string') {
    return res.status(400).json({ message: 'Key, title, and body are required.' });
  }

  const normalizedKey = key.trim();
  if (normalizedKey === '') {
    return res.status(400).json({ message: 'Key cannot be empty.' });
  }

  if (await getAdminContentItemByKey(normalizedKey)) {
    return res.status(409).json({ message: 'Content item already exists.' });
  }

  const item = await createAdminContentItem({
    key: normalizedKey,
    title: title.trim(),
    body: body.trim()
  });

  return res.status(201).json({ item });
});

adminContentRouter.put('/:key', requireAdmin, requireCsrf, async (req, res) => {
  const contentKey = getRouteParam(req.params.key);
  const item = await getAdminContentItemByKey(contentKey);

  if (!item) {
    return res.status(404).json({ message: 'Content item not found.' });
  }

  const { title, body } = req.body as {
    title?: unknown;
    body?: unknown;
  };

  if (typeof title === 'string' && title.trim() !== '') {
    item.title = title.trim();
  }

  if (typeof body === 'string' && body.trim() !== '') {
    item.body = body.trim();
  }

  const updated = await updateAdminContentItemByKey(contentKey, {
    title: item.title,
    body: item.body,
  });

  return res.json({ item: updated });
});

adminContentRouter.delete('/:key', requireAdmin, requireCsrf, async (req, res) => {
  const removed = await deleteAdminContentItemByKey(getRouteParam(req.params.key));

  if (!removed) {
    return res.status(404).json({ message: 'Content item not found.' });
  }

  return res.json({ item: removed });
});