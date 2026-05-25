import { Router } from 'express';
import { listAdminContentItems, listBlogPosts, listReviews } from '../data/contentStore.js';
import { requireAdmin } from '../middleware/requireAuth.js';

export const dashboardRouter = Router();

dashboardRouter.get('/summary', requireAdmin, async (_req, res) => {
  const [blogPosts, reviews, adminContentItems] = await Promise.all([
    listBlogPosts(),
    listReviews(),
    listAdminContentItems(),
  ]);

  const approvedReviews = reviews.filter((item) => item.approved);
  const pendingReviews = reviews.filter((item) => !item.approved);

  return res.json({
    blog: {
      total: blogPosts.length,
      published: blogPosts.filter((item) => item.published).length,
      drafts: blogPosts.filter((item) => !item.published).length,
      recent: blogPosts.slice(0, 3)
    },
    reviews: {
      total: reviews.length,
      approved: approvedReviews.length,
      pending: pendingReviews.length,
      recent: reviews.slice(0, 4)
    },
    content: {
      total: adminContentItems.length,
      recent: adminContentItems.slice(0, 4)
    }
  });
});