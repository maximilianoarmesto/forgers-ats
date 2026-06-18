import { InvalidLinkedInUrlError } from '../errors/DomainError';

/**
 * LinkedInUrl — an immutable Value Object representing a link to a candidate's
 * LinkedIn profile. Equality is by value and the format invariant (a LinkedIn
 * profile URL over https) is validated on construction.
 */
export class LinkedInUrl {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(raw: string): LinkedInUrl {
    const trimmed = raw.trim();

    let parsed: URL;
    try {
      parsed = new URL(trimmed);
    } catch {
      throw new InvalidLinkedInUrlError(raw);
    }

    const isHttps = parsed.protocol === 'https:';
    const host = parsed.hostname.toLowerCase();
    const isLinkedInHost = host === 'linkedin.com' || host.endsWith('.linkedin.com');
    if (!isHttps || !isLinkedInHost) {
      throw new InvalidLinkedInUrlError(raw);
    }

    return new LinkedInUrl(trimmed);
  }

  toString(): string {
    return this.value;
  }

  equals(other: LinkedInUrl): boolean {
    return this.value === other.value;
  }
}
