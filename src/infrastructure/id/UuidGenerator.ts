import { randomUUID } from 'node:crypto';
import { IdGenerator } from '@/application/ports/IdGenerator';

/**
 * Infrastructure implementation of the IdGenerator application port,
 * backed by Node's native crypto.randomUUID.
 */
export class UuidGenerator implements IdGenerator {
  generate(): string {
    return randomUUID();
  }
}
