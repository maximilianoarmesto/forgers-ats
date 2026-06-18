import { Stage } from '@/domain/value-objects/CandidateStage';
import { CandidateRepository } from '@/domain/repositories/CandidateRepository';
import { CandidateDTO, MoveCandidateStageInput } from '../dtos/CandidateDTO';
import { CandidateMapper } from '../mappers/CandidateMapper';
import {
  CandidateNotFoundError,
  ValidationError,
} from '../errors/ApplicationError';

/**
 * Use Case: advance (or reject) a candidate to a new pipeline stage.
 * The legality of the transition is enforced by the domain entity/VO.
 */
export class MoveCandidateStage {
  constructor(private readonly candidates: CandidateRepository) {}

  async execute(input: MoveCandidateStageInput): Promise<CandidateDTO> {
    const target = MoveCandidateStage.parseStage(input.targetStage);

    const candidate = await this.candidates.findById(input.candidateId);
    if (!candidate) {
      throw new CandidateNotFoundError(input.candidateId);
    }

    candidate.moveToStage(target);
    await this.candidates.save(candidate);

    return CandidateMapper.toDTO(candidate);
  }

  private static parseStage(raw: string): Stage {
    const value = raw.toUpperCase();
    if (!Object.values(Stage).includes(value as Stage)) {
      throw new ValidationError(`Unknown stage: "${raw}".`);
    }
    return value as Stage;
  }
}
