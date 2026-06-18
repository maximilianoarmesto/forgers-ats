import { CreateCandidate } from './use-cases/CreateCandidate';
import { MoveCandidateStage } from './use-cases/MoveCandidateStage';
import { ListCandidates } from './use-cases/ListCandidates';
import { GetCandidate } from './use-cases/GetCandidate';
import { UpdateCandidate } from './use-cases/UpdateCandidate';
import { UploadResume } from './use-cases/UploadResume';
import { GetCandidateResume } from './use-cases/GetCandidateResume';
import { TokenVerifier } from './ports/TokenVerifier';

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
  getCandidate: GetCandidate;
  updateCandidate: UpdateCandidate;
  uploadResume: UploadResume;
  getCandidateResume: GetCandidateResume;
  tokenVerifier: TokenVerifier;
}

/**
 * The composition root (infrastructure) registers its factory here at process
 * startup. Interfaces then resolve the container without importing
 * infrastructure directly.
 *
 * The registration is stored on `globalThis` rather than in a plain module
 * variable because Next.js may evaluate this module in more than one server
 * bundle (e.g. the instrumentation hook vs. route handlers). A module-level
 * singleton would not be shared across those bundles; a global one is.
 */
interface ContainerRegistry {
  factory?: () => AppContainer;
  cached?: AppContainer;
}

const globalRef = globalThis as typeof globalThis & {
  __forgersAtsContainer?: ContainerRegistry;
};

const registry: ContainerRegistry = (globalRef.__forgersAtsContainer ??= {});

export function registerContainerFactory(fn: () => AppContainer): void {
  registry.factory = fn;
}

export function resolveContainer(): AppContainer {
  if (registry.cached) return registry.cached;
  if (!registry.factory) {
    throw new Error(
      'AppContainer factory not registered. Ensure the composition root is loaded at startup.',
    );
  }
  registry.cached = registry.factory();
  return registry.cached;
}
