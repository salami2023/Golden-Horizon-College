import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, displayName?: string, role?: string) {
  try {
    if (!process.env.SQL_HOST) {
      return {
        id: 1,
        uid,
        email,
        displayName: displayName || email.split('@')[0],
        role: role || 'administrator',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    const result = await db.insert(users)
      .values({
        uid,
        email,
        displayName: displayName || email.split('@')[0],
        role: role || 'administrator',
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          displayName: displayName || undefined,
          updatedAt: new Date(),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Error in getOrCreateUser (using fallback):', error);
    return {
      id: 1,
      uid,
      email,
      displayName: displayName || email.split('@')[0],
      role: role || 'administrator',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

export async function getUserByUid(uid: string) {
  try {
    if (!process.env.SQL_HOST) {
      return null;
    }
    const records = await db.select().from(users).where(eq(users.uid, uid));
    return records[0] || null;
  } catch (error) {
    console.error('Error fetching user by UID:', error);
    return null;
  }
}
