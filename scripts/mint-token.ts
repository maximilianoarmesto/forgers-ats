/**
 * Dev tooling — mints a short-lived HS256 JWT that the protected API endpoints
 * will accept. Useful for manually exercising the candidates API locally.
 *
 * This is a standalone script (not part of the layered application), so it may
 * touch infrastructure directly.
 *
 * Usage:
 *   npm run token:mint -- [subject] [ttlSeconds]
 *
 * Requires JWT_SECRET to be set (see .env.example).
 */
import { HmacJwtSigner } from '../src/infrastructure/auth/HmacJwtSigner';

function main(): void {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // eslint-disable-next-line no-console
    console.error('JWT_SECRET environment variable is not set.');
    process.exit(1);
  }

  const subject = process.argv[2] ?? 'dev-user';
  const ttlSeconds = Number(process.argv[3] ?? 3600);

  const token = new HmacJwtSigner(secret).sign(subject, ttlSeconds);

  // eslint-disable-next-line no-console
  console.warn(token);
}

main();
