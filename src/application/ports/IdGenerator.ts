/**
 * Port: an abstraction for generating unique identifiers.
 * The concrete implementation (e.g. UUID) lives in infrastructure.
 */
export interface IdGenerator {
  generate(): string;
}
