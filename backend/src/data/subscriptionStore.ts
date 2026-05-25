import { randomUUID } from 'node:crypto';
import { getSubscriptionsCollection } from './mongo.js';

type SubscriptionItem = {
  id: string;
  email: string;
  createdAt: string;
};

function stripMongoMeta<T>(doc: T): T {
  if (doc && typeof doc === 'object' && '_id' in (doc as Record<string, unknown>)) {
    const { _id: _ignored, ...rest } = doc as Record<string, unknown>;
    return rest as T;
  }

  return doc;
}

export async function findSubscriptionByEmail(email: string) {
  const subscriptions = await getSubscriptionsCollection();
  const found = await subscriptions.findOne<SubscriptionItem>({ email });
  return found ? stripMongoMeta(found) : null;
}

export async function createSubscription(email: string) {
  const subscriptions = await getSubscriptionsCollection();

  const item: SubscriptionItem = {
    id: randomUUID(),
    email,
    createdAt: new Date().toISOString(),
  };

  await subscriptions.insertOne(item);
  return item;
}