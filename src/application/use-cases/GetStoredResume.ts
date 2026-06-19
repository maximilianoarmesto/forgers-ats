import { FileStorage } from '../ports/FileStorage';
import { ResumeContentDTO } from '../dtos/CandidateDTO';
import { ResumeNotFoundError } from '../errors/ApplicationError';

/**
 * Use Case: fetch the bytes of a stored résumé by its opaque storage key.
 *
 * Unlike GetCandidateResume (which resolves a key via a candidate), this serves
 * a freshly uploaded file directly by the key returned from UploadResume —
 * before it has been attached to any candidate. It backs the retrievable URL
 * handed back at upload time.
 */
export class GetStoredResume {
  constructor(private readonly storage: FileStorage) {}

  async execute(key: string): Promise<ResumeContentDTO> {
    const stored = await this.storage.read(key);
    if (!stored) {
      throw new ResumeNotFoundError(key);
    }

    return {
      data: stored.data,
      // The original upload file name is persisted on the candidate, not in
      // storage; the storage key (e.g. "<uuid>.pdf") is a safe display name.
      fileName: key,
      contentType: stored.contentType,
    };
  }
}
