import { CandidateRepository } from '@/domain/repositories/CandidateRepository';
import { FileStorage } from '../ports/FileStorage';
import { ResumeContentDTO } from '../dtos/CandidateDTO';
import { CandidateNotFoundError, ResumeNotFoundError } from '../errors/ApplicationError';

/**
 * Use Case: fetch the stored résumé bytes for a candidate, for download.
 */
export class GetCandidateResume {
  constructor(
    private readonly candidates: CandidateRepository,
    private readonly storage: FileStorage,
  ) {}

  async execute(candidateId: string): Promise<ResumeContentDTO> {
    const candidate = await this.candidates.findById(candidateId);
    if (!candidate) {
      throw new CandidateNotFoundError(candidateId);
    }

    const resume = candidate.resume;
    if (!resume) {
      throw new ResumeNotFoundError(candidateId);
    }

    const stored = await this.storage.read(resume.key);
    if (!stored) {
      throw new ResumeNotFoundError(candidateId);
    }

    return {
      data: stored.data,
      fileName: resume.fileName,
      contentType: stored.contentType,
    };
  }
}
