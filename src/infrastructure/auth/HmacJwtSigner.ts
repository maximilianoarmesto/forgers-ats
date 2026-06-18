import { createHmac } from 'node:crypto';

/**
 * Infrastructure helper that mints HS256 JSON Web Tokens for the matching
 * {@link HmacJwtVerifier}. Primarily used to generate access tokens for local
 * development and manual testing of the protected endpoints.
 */
export class HmacJwtSigner {
  constructor(private readonly secret: string) {
    if (!secret) {
      throw new Error('HmacJwtSigner requires a non-empty signing secret.');
    }
  }

  /**
   * Sign a token for the given subject.
   *
   * @param subject  Value placed in the `sub` claim.
   * @param ttlSeconds  Lifetime in seconds; sets the `exp` claim (default 1h).
   * @param extraClaims  Additional claims merged into the payload.
   */
  sign(subject: string, ttlSeconds = 3600, extraClaims: Record<string, unknown> = {}): string {
    const issuedAt = Math.floor(Date.now() / 1000);
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
      ...extraClaims,
      sub: subject,
      iat: issuedAt,
      exp: issuedAt + ttlSeconds,
    };

    const headerB64 = HmacJwtSigner.toBase64Url(header);
    const payloadB64 = HmacJwtSigner.toBase64Url(payload);
    const signature = createHmac('sha256', this.secret)
      .update(`${headerB64}.${payloadB64}`)
      .digest('base64url');

    return `${headerB64}.${payloadB64}.${signature}`;
  }

  private static toBase64Url(value: unknown): string {
    return Buffer.from(JSON.stringify(value), 'utf8').toString('base64url');
  }
}
