import { CandidateRepository } from '../repositories/CandidateRepository';
import { Email } from '../value-objects/Email';

/**
 * Domain Service: encapsulates a rule that does not naturally belong to a
 * single entity — namely that a candidate's email must be unique across the
 * whole pipeline. It receives its dependency (the repository abstraction)
 * via the constructor.
 */
export class CandidateUniquenessService {
  constructor(private readonly candidates: CandidateRepository) {}

  async isEmailAvailable(email: Email): Promise<boolean> {
    const existing = await this.candidates.findByEmail(email);
    return existing === null;
  }

  /**
   * Like {@link isEmailAvailable}, but ignores a candidate's own record so an
   * existing candidate can be updated without colliding with itself.
   */
  async isEmailAvailableForUpdate(email: Email, candidateId: string): Promise<boolean> {
    const existing = await this.candidates.findByEmail(email);
    return existing === null || existing.id === candidateId;
  }
}
