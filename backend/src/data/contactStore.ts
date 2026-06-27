import { randomUUID } from 'node:crypto';
import { getContactMessagesCollection } from './mongo.js';

export type ContactMessageRecord = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  attachment: string;
  attachmentName: string;
  attachmentType: string;
  createdAt: string;
};

function stripMongoMeta<T>(doc: T): T {
  if (doc && typeof doc === 'object' && '_id' in (doc as Record<string, unknown>)) {
    const { _id: _ignored, ...rest } = doc as Record<string, unknown>;
    return rest as T;
  }

  return doc;
}

export async function listContactMessages() {
  const contacts = await getContactMessagesCollection();
  const items = await contacts.find<ContactMessageRecord>({}).sort({ createdAt: -1 }).toArray();
  return items.map(stripMongoMeta);
}

export async function deleteContactMessage(id: string) {
  const contacts = await getContactMessagesCollection();
  await contacts.deleteOne({ id });
}

export function createContactMessage(input: Omit<ContactMessageRecord, 'id' | 'createdAt'>) {
  const record: ContactMessageRecord = {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };

  return getContactMessagesCollection().then(async (contacts) => {
    await contacts.insertOne(record);
    return record;
  });
}
