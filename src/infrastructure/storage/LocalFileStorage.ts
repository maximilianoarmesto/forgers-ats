import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { FileStorage, StoredFile } from '@/application/ports/FileStorage';

const EXTENSION_CONTENT_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
};

/**
 * Infrastructure implementation of the FileStorage port backed by the local
 * filesystem. Files are written under a configurable base directory; the
 * storage key is the relative file name (e.g. "<uuid>.pdf"). The content type
 * is derived from the extension on read.
 */
export class LocalFileStorage implements FileStorage {
  private readonly baseDir: string;

  constructor(baseDir: string) {
    this.baseDir = resolve(baseDir);
  }

  async save(params: {
    data: Uint8Array;
    contentType: string;
    extension: string;
  }): Promise<string> {
    await mkdir(this.baseDir, { recursive: true });
    const key = `${randomUUID()}.${params.extension}`;
    await writeFile(join(this.baseDir, key), params.data);
    return key;
  }

  async read(key: string): Promise<StoredFile | null> {
    // Guard against path traversal: keys are flat file names only.
    if (key.includes('/') || key.includes('\\') || key.includes('..')) {
      return null;
    }

    try {
      const data = await readFile(join(this.baseDir, key));
      return { data, contentType: LocalFileStorage.contentTypeFor(key) };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  private static contentTypeFor(key: string): string {
    const ext = key.split('.').pop()?.toLowerCase() ?? '';
    return EXTENSION_CONTENT_TYPES[ext] ?? 'application/octet-stream';
  }
}
