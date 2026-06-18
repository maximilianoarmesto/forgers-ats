import { CreateCandidate } from './use-cases/CreateCandidate';
import { MoveCandidateStage } from './use-cases/MoveCandidateStage';
import { ListCandidates } from './use-cases/ListCandidates';

/**
 * AppContainer — the application-facing contract describing the set of ready
 * use cases the interfaces layer is allowed to consume.
 *
 * The concrete wiring lives in infrastructure (the composition root), but
 * interfaces depend only on this application-owned shape, preserving the
 * dependency rule: interfaces → application → domain.
 */
export interface AppContainer {
  createCandidate: CreateCandidate;
  moveCandidateStage: MoveCandidateStage;
  listCandidates: ListCandidates;
}

/**
 * The composition root (infrastructure) registers its factory here at process
 * startup. Interfaces then resolve the container without importing
 * infrastructure directly.
 */
let factory: (() => AppContainer) | undefined;
let cached: AppContainer | undefined;

export function registerContainerFactory(fn: () => AppContainer): void {
  factory = fn;
}

export function resolveContainer(): AppContainer {
  if (cached) return cached;
  if (!factory) {
    throw new Error(
      'AppContainer factory not registered. Ensure the composition root is loaded at startup.',
    );
  }
  cached = factory();
  return cached;
}
