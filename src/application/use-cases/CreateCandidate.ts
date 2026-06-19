import { Candidate } from '@/domain/entities/Candidate';
import { Email } from '@/domain/value-objects/Email';
import { CandidateRepository } from '@/domain/repositories/CandidateRepository';
import { CandidateUniquenessService } from '@/domain/services/CandidateUniquenessService';
import { IdGenerator } from '../ports/IdGenerator';
import { CandidateDTO, CreateCandidateInput } from '../dtos/CandidateDTO';
import { CandidateMapper } from '../mappers/CandidateMapper';
import { EmailAlreadyInUseError } from '../errors/ApplicationError';

/**
 * Use Case: register a new candidate in the hiring pipeline.
 * Receives its collaborators via constructor injection and exposes a single
 * `execute(dto)` method. Contains orchestration only — business rules live
 * in the domain entity and domain service.
 */
export class CreateCandidate {
  constructor(
    private readonly candidates: CandidateRepository,
    private readonly uniqueness: CandidateUniquenessService,
    private readonly ids: IdGenerator,
  ) {}

  async execute(input: CreateCandidateInput): Promise<CandidateDTO> {
    const email = Email.create(input.email);

    const available = await this.uniqueness.isEmailAvailable(email);
    if (!available) {
      throw new EmailAlreadyInUseError(email.toString());
    }

    const candidate = Candidate.create({
      id: this.ids.generate(),
      name: input.name,
      email: input.email,
      jobTitle: input.jobTitle,
      linkedInUrl: input.linkedInUrl ?? null,
      resume: input.resume ?? null,
    });

    await this.candidates.save(candidate);

    return CandidateMapper.toDTO(candidate);
  }
}
