import { Router } from 'express';
import {
  createReview,
  deleteReviewById,
  getReviewById,
  listReviews,
  updateReviewById,
} from '../data/contentStore.js';
import { requireAdmin } from '../middleware/requireAuth.js';

export const reviewsRouter = Router();

function getRouteParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

reviewsRouter.get('/', async (_req, res) => {
  const items = await listReviews({ approvedOnly: true });
  return res.json({ items });
});

reviewsRouter.get('/admin/all', requireAdmin, async (_req, res) => {
  const items = await listReviews();
  return res.json({ items });
});

reviewsRouter.post('/', async (req, res) => {
  const { authorName, rating, message, approved } = req.body as {
    authorName?: unknown;
    rating?: unknown;
    message?: unknown;
    approved?: unknown;
  };

  const parsedRating = typeof rating === 'number' ? rating : Number(rating);

  if (
    typeof authorName !== 'string' ||
    typeof message !== 'string' ||
    authorName.trim() === '' ||
    message.trim() === '' ||
    !Number.isFinite(parsedRating) ||
    parsedRating < 1 ||
    parsedRating > 5
  ) {
    return res.status(400).json({ message: 'Author name, rating, and message are required.' });
  }

  const item = await createReview({
    authorName: authorName.trim(),
    rating: Math.round(parsedRating),
    message: message.trim(),
    approved: typeof approved === 'boolean' ? approved : true
  });

  return res.status(201).json({ item });
});

reviewsRouter.put('/:id', requireAdmin, async (req, res) => {
  const reviewId = getRouteParam(req.params.id);
  const review = await getReviewById(reviewId);

  if (!review) {
    return res.status(404).json({ message: 'Review not found.' });
  }

  const { authorName, rating, message, approved } = req.body as {
    authorName?: unknown;
    rating?: unknown;
    message?: unknown;
    approved?: unknown;
  };

  if (typeof authorName === 'string' && authorName.trim() !== '') {
    review.authorName = authorName.trim();
  }

  if (typeof message === 'string' && message.trim() !== '') {
    review.message = message.trim();
  }

  if (rating !== undefined) {
    const parsedRating = typeof rating === 'number' ? rating : Number(rating);
    if (Number.isFinite(parsedRating) && parsedRating >= 1 && parsedRating <= 5) {
      review.rating = Math.round(parsedRating);
    }
  }

  if (typeof approved === 'boolean') {
    review.approved = approved;
  }

  const item = await updateReviewById(reviewId, {
    authorName: review.authorName,
    message: review.message,
    rating: review.rating,
    approved: review.approved,
  });

  return res.json({ item });
});

reviewsRouter.delete('/:id', requireAdmin, async (req, res) => {
  const removed = await deleteReviewById(getRouteParam(req.params.id));

  if (!removed) {
    return res.status(404).json({ message: 'Review not found.' });
  }

  return res.json({ item: removed });
});