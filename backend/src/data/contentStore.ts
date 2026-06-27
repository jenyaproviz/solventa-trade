import { randomUUID } from 'node:crypto';
import { getAdminContentCollection, getBlogPostsCollection, getReviewsCollection } from './mongo.js';

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Review = {
  id: string;
  authorName: string;
  rating: number;
  message: string;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminContentItem = {
  id: string;
  key: string;
  title: string;
  body: string;
  updatedAt: string;
};

const now = () => new Date().toISOString();

function stripMongoMeta<T>(doc: T): T {
  if (doc && typeof doc === 'object' && '_id' in (doc as Record<string, unknown>)) {
    const { _id: _ignored, ...rest } = doc as Record<string, unknown>;
    return rest as T;
  }

  return doc;
}

export function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function listBlogPosts(options?: { publishedOnly?: boolean }) {
  const posts = await getBlogPostsCollection();
  const filter = options?.publishedOnly ? { published: true } : {};
  const items = await posts.find<BlogPost>(filter).sort({ createdAt: -1 }).toArray();
  return items.map(stripMongoMeta);
}

export async function getBlogPostBySlug(slug: string, options?: { publishedOnly?: boolean }) {
  const posts = await getBlogPostsCollection();
  const filter = options?.publishedOnly
    ? { slug, published: true }
    : { slug };
  const found = await posts.findOne<BlogPost>(filter);
  return found ? stripMongoMeta(found) : null;
}

export async function getBlogPostById(id: string) {
  const posts = await getBlogPostsCollection();
  const found = await posts.findOne<BlogPost>({ id });
  return found ? stripMongoMeta(found) : null;
}

export async function createBlogPost(input: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) {
  const timestamp = now();
  const post: BlogPost = {
    ...input,
    id: randomUUID(),
    createdAt: timestamp,
    updatedAt: timestamp
  };

  const posts = await getBlogPostsCollection();
  await posts.insertOne(post);
  return post;
}

export async function updateBlogPostById(id: string, updates: Partial<Omit<BlogPost, 'id' | 'createdAt'>>) {
  const posts = await getBlogPostsCollection();
  const setPayload = {
    ...updates,
    updatedAt: now(),
  };

  await posts.updateOne({ id }, { $set: setPayload });
  return getBlogPostById(id);
}

export async function deleteBlogPostById(id: string) {
  const existing = await getBlogPostById(id);
  if (!existing) return null;

  const posts = await getBlogPostsCollection();
  await posts.deleteOne({ id });
  return existing;
}

export async function listReviews(options?: { approvedOnly?: boolean }) {
  const reviews = await getReviewsCollection();
  const filter = options?.approvedOnly ? { approved: true } : {};
  const items = await reviews.find<Review>(filter).sort({ createdAt: -1 }).toArray();
  return items.map(stripMongoMeta);
}

export async function getReviewById(id: string) {
  const reviews = await getReviewsCollection();
  const found = await reviews.findOne<Review>({ id });
  return found ? stripMongoMeta(found) : null;
}

export async function createReview(input: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>) {
  const timestamp = now();
  const review: Review = {
    ...input,
    id: randomUUID(),
    createdAt: timestamp,
    updatedAt: timestamp
  };

  const reviews = await getReviewsCollection();
  await reviews.insertOne(review);
  return review;
}

export async function updateReviewById(id: string, updates: Partial<Omit<Review, 'id' | 'createdAt'>>) {
  const reviews = await getReviewsCollection();
  await reviews.updateOne(
    { id },
    {
      $set: {
        ...updates,
        updatedAt: now(),
      },
    }
  );

  return getReviewById(id);
}

export async function deleteReviewById(id: string) {
  const existing = await getReviewById(id);
  if (!existing) return null;

  const reviews = await getReviewsCollection();
  await reviews.deleteOne({ id });
  return existing;
}

export async function listAdminContentItems() {
  const content = await getAdminContentCollection();
  const items = await content.find<AdminContentItem>({}).sort({ updatedAt: -1 }).toArray();
  return items.map(stripMongoMeta);
}

export async function getAdminContentItemByKey(key: string) {
  const content = await getAdminContentCollection();
  const found = await content.findOne<AdminContentItem>({ key });
  return found ? stripMongoMeta(found) : null;
}

export async function createAdminContentItem(input: Omit<AdminContentItem, 'id' | 'updatedAt'>) {
  const item: AdminContentItem = {
    ...input,
    id: randomUUID(),
    updatedAt: now()
  };

  const content = await getAdminContentCollection();
  await content.insertOne(item);
  return item;
}

export async function updateAdminContentItemByKey(key: string, updates: Partial<Pick<AdminContentItem, 'title' | 'body'>>) {
  const content = await getAdminContentCollection();
  await content.updateOne(
    { key },
    {
      $set: {
        ...updates,
        updatedAt: now(),
      },
    }
  );

  return getAdminContentItemByKey(key);
}

export async function deleteAdminContentItemByKey(key: string) {
  const existing = await getAdminContentItemByKey(key);
  if (!existing) return null;

  const content = await getAdminContentCollection();
  await content.deleteOne({ key });
  return existing;
}