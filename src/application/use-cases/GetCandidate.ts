import { CandidateRepository } from '@/domain/repositories/CandidateRepository';
import { CandidateDTO } from '../dtos/CandidateDTO';
import { CandidateMapper } from '../mappers/CandidateMapper';
import { CandidateNotFoundError } from '../errors/ApplicationError';

/**
 * Use Case: retrieve a single candidate by id.
 */
export class GetCandidate {
  constructor(private readonly candidates: CandidateRepository) {}

  async execute(id: string): Promise<CandidateDTO> {
    const candidate = await this.candidates.findById(id);
    if (!candidate) {
      throw new CandidateNotFoundError(id);
    }
    return CandidateMapper.toDTO(candidate);
  }
}
