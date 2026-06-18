import { Candidate } from '../entities/Candidate';
import { Email } from '../value-objects/Email';

/**
 * CandidateRepository — a domain abstraction describing WHAT persistence
 * operations the domain needs, never HOW they are implemented.
 * Implementations live in the infrastructure layer.
 */
export interface CandidateRepository {
  findById(id: string): Promise<Candidate | null>;
  findByEmail(email: Email): Promise<Candidate | null>;
  list(): Promise<Candidate[]>;
  save(candidate: Candidate): Promise<void>;
}
