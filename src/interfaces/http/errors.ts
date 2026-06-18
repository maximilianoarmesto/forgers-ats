import { getApplicationErrorCode } from '@/application/errors/ApplicationError';

/**
 * Translates application/domain errors into HTTP status codes.
 * This mapping decision belongs to the interfaces layer.
 *
 * Mapping is driven by the error's stable `code` discriminant rather than
 * `instanceof`, so it stays correct even when an error is thrown from a
 * different server bundle than this handler (a Next.js runtime concern).
 */
export interface HttpErrorResponse {
  status: number;
  body: { error: string };
}

export function mapErrorToHttp(error: unknown): HttpErrorResponse {
  const message = error instanceof Error ? error.message : 'Internal server error';

  switch (getApplicationErrorCode(error)) {
    case 'UNAUTHORIZED':
      return { status: 401, body: { error: message } };
    case 'NOT_FOUND':
      return { status: 404, body: { error: message } };
    case 'EMAIL_IN_USE':
      return { status: 409, body: { error: message } };
    case 'VALIDATION':
      return { status: 400, body: { error: message } };
    default:
      break;
  }

  if (error instanceof Error) {
    // Domain errors (e.g. invalid email/name) and other unexpected errors.
    return { status: 400, body: { error: message } };
  }
  return { status: 500, body: { error: 'Internal server error' } };
}
