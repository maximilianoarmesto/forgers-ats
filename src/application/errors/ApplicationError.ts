/**
 * Application-level errors. These wrap or translate domain errors into
 * outcomes that interfaces can map to transport-specific responses
 * (e.g. HTTP status codes) without knowing about HTTP themselves.
 */
export abstract class ApplicationError extends Error {
  protected constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class CandidateNotFoundError extends ApplicationError {
  constructor(id: string) {
    super(`Candidate not found: ${id}.`);
  }
}

export class EmailAlreadyInUseError extends ApplicationError {
  constructor(email: string) {
    super(`A candidate with email "${email}" already exists.`);
  }
}

export class ValidationError extends ApplicationError {
  constructor(message: string) {
    super(message);
  }
}
