import { Candidate } from '@/domain/entities/Candidate';
import { CandidateDTO } from '../dtos/CandidateDTO';

/**
 * Maps domain entities to outward-facing DTOs. Keeps domain objects from
 * leaking past the application boundary.
 */
export class CandidateMapper {
  static toDTO(candidate: Candidate): CandidateDTO {
    return {
      id: candidate.id,
      name: candidate.name,
      email: candidate.email.toString(),
      stage: candidate.stage.toString(),
      jobTitle: candidate.jobTitle,
      linkedInUrl: candidate.linkedInUrl ? candidate.linkedInUrl.toString() : null,
      resumeFileName: candidate.resume ? candidate.resume.fileName : null,
      // Stable, retrievable URL for the attached résumé (served by the
      // candidate-scoped /resumes/:id endpoint). Derived from the persisted
      // résumé reference, so it lives on the candidate record's representation.
      resumeUrl: candidate.resume ? `/resumes/${candidate.id}` : null,
      hasResume: candidate.resume !== null,
      createdAt: candidate.createdAt.toISOString(),
      updatedAt: candidate.updatedAt.toISOString(),
    };
  }
}
