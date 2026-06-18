import { PrismaClient } from '@prisma/client';

/**
 * A single shared PrismaClient instance. In development, Next.js hot-reload
 * would otherwise create many connections, so we cache it on globalThis.
 */
declare global {
  // eslint-disable-next-line no-var
  var __forgersPrisma: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  globalThis.__forgersPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__forgersPrisma = prisma;
}
