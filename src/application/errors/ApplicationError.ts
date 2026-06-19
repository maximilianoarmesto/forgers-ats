/**
 * Application-level errors. These wrap or translate domain errors into
 * outcomes that interfaces can map to transport-specific responses
 * (e.g. HTTP status codes) without knowing about HTTP themselves.
 *
 * Each error carries a stable `code` discriminant. Interfaces map on the code
 * rather than on `instanceof`, which keeps the mapping correct even when the
 * error is constructed in a different module bundle than the one performing
 * the mapping (a real concern under Next.js's multi-bundle server runtime).
 */
export type ApplicationErrorCode = 'NOT_FOUND' | 'EMAIL_IN_USE' | 'VALIDATION' | 'UNAUTHORIZED';

export abstract class ApplicationError extends Error {
  abstract readonly code: ApplicationErrorCode;

  protected constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class CandidateNotFoundError extends ApplicationError {
  readonly code = 'NOT_FOUND';

  constructor(id: string) {
    super(`Candidate not found: ${id}.`);
  }
}

export class ResumeNotFoundError extends ApplicationError {
  readonly code = 'NOT_FOUND';

  constructor(ref: string) {
    super(`No résumé found: ${ref}.`);
  }
}

export class EmailAlreadyInUseError extends ApplicationError {
  readonly code = 'EMAIL_IN_USE';

  constructor(email: string) {
    super(`A candidate with email "${email}" already exists.`);
  }
}

export class ValidationError extends ApplicationError {
  readonly code = 'VALIDATION';

  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedError extends ApplicationError {
  readonly code = 'UNAUTHORIZED';

  constructor(message = 'Authentication required.') {
    super(message);
  }
}

/**
 * Bundle-safe predicate: detects an ApplicationError by its `code` discriminant
 * without relying on cross-bundle `instanceof` identity.
 */
export function getApplicationErrorCode(error: unknown): ApplicationErrorCode | undefined {
  if (typeof error !== 'object' || error === null) return undefined;
  const code = (error as { code?: unknown }).code;
  switch (code) {
    case 'NOT_FOUND':
    case 'EMAIL_IN_USE':
    case 'VALIDATION':
    case 'UNAUTHORIZED':
      return code;
    default:
      return undefined;
  }
}
