import {
  ApplicationError,
  CandidateNotFoundError,
  EmailAlreadyInUseError,
  ValidationError,
} from '@/application/errors/ApplicationError';

/**
 * Translates application/domain errors into HTTP status codes.
 * This mapping decision belongs to the interfaces layer.
 */
export interface HttpErrorResponse {
  status: number;
  body: { error: string };
}

export function mapErrorToHttp(error: unknown): HttpErrorResponse {
  if (error instanceof CandidateNotFoundError) {
    return { status: 404, body: { error: error.message } };
  }
  if (error instanceof EmailAlreadyInUseError) {
    return { status: 409, body: { error: error.message } };
  }
  if (error instanceof ValidationError) {
    return { status: 400, body: { error: error.message } };
  }
  if (error instanceof ApplicationError) {
    return { status: 400, body: { error: error.message } };
  }
  if (error instanceof Error) {
    // Domain errors and unexpected errors.
    return { status: 400, body: { error: error.message } };
  }
  return { status: 500, body: { error: 'Internal server error' } };
}
