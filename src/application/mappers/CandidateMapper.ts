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
      fullName: candidate.fullName,
      email: candidate.email.toString(),
      stage: candidate.stage.toString(),
      jobTitle: candidate.jobTitle,
      createdAt: candidate.createdAt.toISOString(),
      updatedAt: candidate.updatedAt.toISOString(),
    };
  }
}
