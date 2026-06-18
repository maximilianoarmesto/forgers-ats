/**
 * Base class for all domain-level errors.
 * These represent violations of business rules and invariants.
 */
export abstract class DomainError extends Error {
  protected constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class InvalidEmailError extends DomainError {
  constructor(value: string) {
    super(`Invalid email address: "${value}".`);
  }
}

export class InvalidCandidateNameError extends DomainError {
  constructor(value: string) {
    super(`Invalid candidate name: "${value}".`);
  }
}

export class InvalidStageTransitionError extends DomainError {
  constructor(from: string, to: string) {
    super(`Cannot move candidate from stage "${from}" to "${to}".`);
  }
}
