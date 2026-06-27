import { getUsersCollection } from './mongo.js';
import { compare, hash } from 'bcryptjs';

type RegisteredUserRecord = {
  id: string;
  email: string;
  passwordHash?: string;
  password?: string;
  displayName: string;
  createdAt: string;
};

const PASSWORD_HASH_ROUNDS = 12;

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
  const passwordHash = await hash(payload.password, PASSWORD_HASH_ROUNDS);

  const created: RegisteredUserRecord = {
    id: createUserId(),
    email: normalizeEmail(payload.email),
    passwordHash,
    displayName: payload.displayName.trim(),
    createdAt: now,
  };

  const users = await getUsersCollection();
  await users.insertOne(created);

  return created;
}

export async function verifyRegisteredUserPassword(email: string, password: string) {
  const users = await getUsersCollection();
  const normalizedEmail = normalizeEmail(email);
  const account = await findRegisteredUserByEmail(normalizedEmail);

  if (!account) {
    return null;
  }

  if (typeof account.passwordHash === 'string' && account.passwordHash !== '') {
    const matches = await compare(password, account.passwordHash);
    return matches ? account : null;
  }

  // Temporary fallback for old plaintext records. On successful login, upgrade to hashed password.
  if (typeof account.password === 'string' && account.password === password) {
    const upgradedHash = await hash(password, PASSWORD_HASH_ROUNDS);
    await users.updateOne(
      { email: normalizedEmail },
      {
        $set: { passwordHash: upgradedHash },
        $unset: { password: '' },
      }
    );

    return {
      ...account,
      passwordHash: upgradedHash,
      password: undefined,
    };
  }

  return null;
}
