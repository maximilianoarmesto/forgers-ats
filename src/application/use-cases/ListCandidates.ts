import { CandidateRepository } from '@/domain/repositories/CandidateRepository';
import { CandidateDTO } from '../dtos/CandidateDTO';
import { CandidateMapper } from '../mappers/CandidateMapper';

/**
 * Use Case: list all candidates currently in the pipeline.
 */
export class ListCandidates {
  constructor(private readonly candidates: CandidateRepository) {}

  async execute(): Promise<CandidateDTO[]> {
    const candidates = await this.candidates.list();
    return candidates.map(CandidateMapper.toDTO);
  }
}
