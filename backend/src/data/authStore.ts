import { getUsersCollection } from './mongo.js';

type RegisteredUserRecord = {
  id: string;
  email: string;
  password: string;
  displayName: string;
  createdAt: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function createUserId() {
  return `usr_${Math.random().toString(36).slice(2, 10)}`;
}

function stripMongoMeta<T>(doc: T): T {
  if (doc && typeof doc === 'object' && '_id' in (doc as Record<string, unknown>)) {
    const { _id: _ignored, ...rest } = doc as Record<string, unknown>;
    return rest as T;
  }

  return doc;
}

export async function findRegisteredUserByEmail(email: string) {
  const normalized = normalizeEmail(email);
  const users = await getUsersCollection();
  const found = await users.findOne<RegisteredUserRecord>({ email: normalized });
  return found ? stripMongoMeta(found) : null;
}

export async function createRegisteredUser(payload: {
  email: string;
  password: string;
  displayName: string;
}) {
  const existing = await findRegisteredUserByEmail(payload.email);

  if (existing) {
    throw new Error('An account with this email already exists.');
  }

  const now = new Date().toISOString();

  const created: RegisteredUserRecord = {
    id: createUserId(),
    email: normalizeEmail(payload.email),
    password: payload.password,
    displayName: payload.displayName.trim(),
    createdAt: now,
  };

  const users = await getUsersCollection();
  await users.insertOne(created);

  return created;
}
