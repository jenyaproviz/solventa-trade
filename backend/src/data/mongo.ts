import { MongoClient } from 'mongodb';
import { env } from '../config/env.js';

const COLLECTIONS = {
  users: 'users',
  blogPosts: 'blog_posts',
  reviews: 'reviews',
  adminContent: 'admin_content',
  contacts: 'contact_messages',
  subscriptions: 'subscriptions',
} as const;

let clientPromise: Promise<MongoClient> | null = null;
let indexesReady = false;

function getClientPromise() {
  if (!clientPromise) {
    const client = new MongoClient(env.mongoUri);
    clientPromise = client.connect();
  }

  return clientPromise;
}

export async function getDatabase() {
  const client = await getClientPromise();
  return client.db(env.mongoDbName);
}

export async function initializeMongo() {
  if (indexesReady) return;

  const db = await getDatabase();

  await Promise.all([
    db.collection(COLLECTIONS.users).createIndex({ email: 1 }, { unique: true }),
    db.collection(COLLECTIONS.blogPosts).createIndex({ id: 1 }, { unique: true }),
    db.collection(COLLECTIONS.blogPosts).createIndex({ slug: 1 }, { unique: true }),
    db.collection(COLLECTIONS.blogPosts).createIndex({ createdAt: -1 }),
    db.collection(COLLECTIONS.reviews).createIndex({ id: 1 }, { unique: true }),
    db.collection(COLLECTIONS.reviews).createIndex({ createdAt: -1 }),
    db.collection(COLLECTIONS.adminContent).createIndex({ key: 1 }, { unique: true }),
    db.collection(COLLECTIONS.contacts).createIndex({ id: 1 }, { unique: true }),
    db.collection(COLLECTIONS.contacts).createIndex({ createdAt: -1 }),
    db.collection(COLLECTIONS.subscriptions).createIndex({ email: 1 }, { unique: true }),
  ]);

  indexesReady = true;
}

export async function checkMongoConnection() {
  try {
    const db = await getDatabase();
    await db.command({ ping: 1 });
    return {
      connected: true,
      database: env.mongoDbName,
    };
  } catch {
    return {
      connected: false,
      database: env.mongoDbName,
    };
  }
}

export async function getUsersCollection() {
  const db = await getDatabase();
  return db.collection(COLLECTIONS.users);
}

export async function getBlogPostsCollection() {
  const db = await getDatabase();
  return db.collection(COLLECTIONS.blogPosts);
}

export async function getReviewsCollection() {
  const db = await getDatabase();
  return db.collection(COLLECTIONS.reviews);
}

export async function getAdminContentCollection() {
  const db = await getDatabase();
  return db.collection(COLLECTIONS.adminContent);
}

export async function getContactMessagesCollection() {
  const db = await getDatabase();
  return db.collection(COLLECTIONS.contacts);
}

export async function getSubscriptionsCollection() {
  const db = await getDatabase();
  return db.collection(COLLECTIONS.subscriptions);
}
