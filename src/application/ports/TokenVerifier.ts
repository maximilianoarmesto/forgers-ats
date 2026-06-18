/**
 * Port: an abstraction for verifying a bearer access token (e.g. a JWT).
 * The concrete implementation (signature checking, secret handling) lives in
 * the infrastructure layer. The application/interfaces layers depend only on
 * this contract, never on a specific JWT library.
 */

/**
 * The authenticated principal extracted from a valid token. `subject` maps to
 * the token's `sub` claim; additional claims are exposed verbatim.
 */
export interface AuthenticatedUser {
  subject: string;
  claims: Record<string, unknown>;
}

export interface TokenVerifier {
  /**
   * Verify a raw token string. Implementations MUST throw an
   * `UnauthorizedError` when the token is missing, malformed, expired, or has
   * an invalid signature.
   */
  verify(token: string): Promise<AuthenticatedUser>;
}
