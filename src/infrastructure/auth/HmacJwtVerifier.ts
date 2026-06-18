import { createHmac, timingSafeEqual } from 'node:crypto';
import { AuthenticatedUser, TokenVerifier } from '@/application/ports/TokenVerifier';
import { UnauthorizedError } from '@/application/errors/ApplicationError';

/**
 * Infrastructure implementation of the TokenVerifier port. Verifies compact
 * JSON Web Tokens signed with HMAC-SHA256 (HS256) using a shared secret,
 * backed entirely by Node's native crypto — no third-party JWT dependency.
 *
 * Any verification failure (malformed token, wrong/unsupported algorithm,
 * bad signature, or expired/not-yet-valid token) is surfaced as the
 * application-level UnauthorizedError so the interfaces layer can map it to a
 * 401 without knowing about JWTs.
 */
export class HmacJwtVerifier implements TokenVerifier {
  constructor(private readonly secret: string) {
    if (!secret) {
      throw new Error('HmacJwtVerifier requires a non-empty signing secret.');
    }
  }

  async verify(token: string): Promise<AuthenticatedUser> {
    const parts = token.split('.');
    const [headerB64, payloadB64, signatureB64] = parts;
    if (parts.length !== 3 || !headerB64 || !payloadB64 || !signatureB64) {
      throw new UnauthorizedError('Malformed token.');
    }

    const header = this.decodeJson(headerB64, 'header');
    if (header.alg !== 'HS256') {
      throw new UnauthorizedError('Unsupported token algorithm.');
    }

    const expected = createHmac('sha256', this.secret)
      .update(`${headerB64}.${payloadB64}`)
      .digest();
    const provided = HmacJwtVerifier.fromBase64Url(signatureB64);
    if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
      throw new UnauthorizedError('Invalid token signature.');
    }

    const payload = this.decodeJson(payloadB64, 'payload');
    const now = Math.floor(Date.now() / 1000);

    if (typeof payload.exp === 'number' && now >= payload.exp) {
      throw new UnauthorizedError('Token has expired.');
    }
    if (typeof payload.nbf === 'number' && now < payload.nbf) {
      throw new UnauthorizedError('Token is not yet valid.');
    }

    const subject = payload.sub;
    if (typeof subject !== 'string' || subject.length === 0) {
      throw new UnauthorizedError('Token is missing a subject.');
    }

    return { subject, claims: payload };
  }

  private decodeJson(segment: string, label: string): Record<string, unknown> {
    try {
      const json = HmacJwtVerifier.fromBase64Url(segment).toString('utf8');
      const parsed = JSON.parse(json);
      if (typeof parsed !== 'object' || parsed === null) {
        throw new Error('not an object');
      }
      return parsed as Record<string, unknown>;
    } catch {
      throw new UnauthorizedError(`Malformed token ${label}.`);
    }
  }

  private static fromBase64Url(value: string): Buffer {
    return Buffer.from(value, 'base64url');
  }
}
