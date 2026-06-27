import { Router } from 'express';
import {
  createBlogPost,
  createSlug,
  deleteBlogPostById,
  getBlogPostById,
  getBlogPostBySlug,
  listBlogPosts,
  updateBlogPostById,
} from '../data/contentStore.js';
import { requireAdmin } from '../middleware/requireAuth.js';
import { requireCsrf } from '../middleware/requireCsrf.js';

export const blogRouter = Router();

function getRouteParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

blogRouter.get('/', async (_req, res) => {
  const items = await listBlogPosts({ publishedOnly: true });
  return res.json({ items });
});

blogRouter.get('/:slug', async (req, res) => {
  const post = await getBlogPostBySlug(getRouteParam(req.params.slug), { publishedOnly: true });

  if (!post) {
    return res.status(404).json({ message: 'Blog post not found.' });
  }

  return res.json({ item: post });
});

blogRouter.post('/', requireAdmin, requireCsrf, async (req, res) => {
  const { title, excerpt, content, coverImageUrl, published } = req.body as {
    title?: unknown;
    excerpt?: unknown;
    content?: unknown;
    coverImageUrl?: unknown;
    published?: unknown;
  };

  if (typeof title !== 'string' || typeof excerpt !== 'string' || typeof content !== 'string') {
    return res.status(400).json({ message: 'Title, excerpt, and content are required.' });
  }

  const shouldPublish = published === true;

  const item = await createBlogPost({
    slug: createSlug(title),
    title: title.trim(),
    excerpt: excerpt.trim(),
    content: content.trim(),
    coverImageUrl: typeof coverImageUrl === 'string' && coverImageUrl.trim() !== '' ? coverImageUrl.trim() : undefined,
    published: shouldPublish,
    publishedAt: shouldPublish ? new Date().toISOString() : null
  });

  return res.status(201).json({ item });
});

blogRouter.put('/:id', requireAdmin, requireCsrf, async (req, res) => {
  const postId = getRouteParam(req.params.id);
  const post = await getBlogPostById(postId);

  if (!post) {
    return res.status(404).json({ message: 'Blog post not found.' });
  }

  const { title, excerpt, content, coverImageUrl, published } = req.body as {
    title?: unknown;
    excerpt?: unknown;
    content?: unknown;
    coverImageUrl?: unknown;
    published?: unknown;
  };

  if (typeof title === 'string' && title.trim() !== '') {
    post.title = title.trim();
    post.slug = createSlug(title);
  }

  if (typeof excerpt === 'string' && excerpt.trim() !== '') {
    post.excerpt = excerpt.trim();
  }

  if (typeof content === 'string' && content.trim() !== '') {
    post.content = content.trim();
  }

  if (typeof coverImageUrl === 'string') {
    post.coverImageUrl = coverImageUrl.trim() === '' ? undefined : coverImageUrl.trim();
  }

  if (typeof published === 'boolean') {
    post.published = published;
    post.publishedAt = published && post.publishedAt === null ? new Date().toISOString() : post.publishedAt;
  }

  const item = await updateBlogPostById(postId, {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImageUrl: post.coverImageUrl,
    published: post.published,
    publishedAt: post.publishedAt,
  });

  return res.json({ item });
});

blogRouter.delete('/:id', requireAdmin, requireCsrf, async (req, res) => {
  const removed = await deleteBlogPostById(getRouteParam(req.params.id));

  if (!removed) {
    return res.status(404).json({ message: 'Blog post not found.' });
  }

  return res.json({ item: removed });
});