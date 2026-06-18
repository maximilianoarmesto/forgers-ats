import { NextResponse } from 'next/server';
import { resolveContainer } from '@/application/AppContainer';
import { AuthenticatedUser } from '@/application/ports/TokenVerifier';
import { UnauthorizedError } from '@/application/errors/ApplicationError';
import { mapErrorToHttp } from './errors';

/**
 * Extracts and verifies the bearer token from a request's Authorization
 * header. Delegates the actual verification to the TokenVerifier port resolved
 * from the application container. Throws UnauthorizedError when the header is
 * absent or malformed; the verifier throws it for invalid/expired tokens.
 */
export async function authenticate(request: Request): Promise<AuthenticatedUser> {
  const header = request.headers.get('authorization');
  if (!header) {
    throw new UnauthorizedError('Missing Authorization header.');
  }

  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    throw new UnauthorizedError('Authorization header must use the Bearer scheme.');
  }

  return resolveContainer().tokenVerifier.verify(token);
}

type RouteHandler<Ctx> = (request: Request, context: Ctx) => Promise<NextResponse>;

/**
 * Higher-order helper that guards a route handler with JWT authentication.
 * Verifies the bearer token first; on failure it short-circuits with the
 * mapped error response (401) and the wrapped handler never runs.
 */
export function withAuth<Ctx>(handler: RouteHandler<Ctx>): RouteHandler<Ctx> {
  return async (request: Request, context: Ctx): Promise<NextResponse> => {
    try {
      await authenticate(request);
    } catch (error) {
      const { status, body } = mapErrorToHttp(error);
      return NextResponse.json(body, { status });
    }
    return handler(request, context);
  };
}
