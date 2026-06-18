import { Email } from '@/domain/value-objects/Email';
import { CandidateRepository } from '@/domain/repositories/CandidateRepository';
import { CandidateUniquenessService } from '@/domain/services/CandidateUniquenessService';
import { CandidateDTO, UpdateCandidateInput } from '../dtos/CandidateDTO';
import { CandidateMapper } from '../mappers/CandidateMapper';
import {
  CandidateNotFoundError,
  EmailAlreadyInUseError,
  ValidationError,
} from '../errors/ApplicationError';

/**
 * Use Case: update an existing candidate's editable fields (full name, email,
 * job title). Applies a partial update — only the provided fields change.
 * Changing the email re-enforces the cross-candidate uniqueness rule while
 * allowing the candidate to keep its own address. Field-level invariants are
 * enforced by the domain entity.
 */
export class UpdateCandidate {
  constructor(
    private readonly candidates: CandidateRepository,
    private readonly uniqueness: CandidateUniquenessService,
  ) {}

  async execute(input: UpdateCandidateInput): Promise<CandidateDTO> {
    if (input.fullName === undefined && input.email === undefined && input.jobTitle === undefined) {
      throw new ValidationError('No fields provided to update.');
    }

    const candidate = await this.candidates.findById(input.candidateId);
    if (!candidate) {
      throw new CandidateNotFoundError(input.candidateId);
    }

    if (input.email !== undefined) {
      const newEmail = Email.create(input.email);
      const available = await this.uniqueness.isEmailAvailableForUpdate(newEmail, candidate.id);
      if (!available) {
        throw new EmailAlreadyInUseError(newEmail.toString());
      }
      candidate.changeEmail(input.email);
    }

    if (input.fullName !== undefined) {
      candidate.rename(input.fullName);
    }

    if (input.jobTitle !== undefined) {
      candidate.changeJobTitle(input.jobTitle);
    }

    await this.candidates.save(candidate);

    return CandidateMapper.toDTO(candidate);
  }
}
