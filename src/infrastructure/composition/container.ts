import { CandidateUniquenessService } from '@/domain/services/CandidateUniquenessService';
import { AppContainer, registerContainerFactory } from '@/application/AppContainer';
import { CreateCandidate } from '@/application/use-cases/CreateCandidate';
import { MoveCandidateStage } from '@/application/use-cases/MoveCandidateStage';
import { ListCandidates } from '@/application/use-cases/ListCandidates';
import { GetCandidate } from '@/application/use-cases/GetCandidate';
import { UpdateCandidate } from '@/application/use-cases/UpdateCandidate';
import { prisma } from '../persistence/prisma/PrismaClient';
import { PrismaCandidateRepository } from '../persistence/prisma/PrismaCandidateRepository';
import { UuidGenerator } from '../id/UuidGenerator';
import { HmacJwtVerifier } from '../auth/HmacJwtVerifier';

/**
 * Composition Root.
 *
 * The ONLY place where concrete implementations are bound to the abstractions
 * the application layer depends on. It registers a factory with the
 * application-owned AppContainer accessor so that the interfaces layer can
 * resolve ready use cases WITHOUT importing infrastructure directly — keeping
 * the dependency rule intact (interfaces → application → domain).
 */
function build(): AppContainer {
  const candidateRepository = new PrismaCandidateRepository(prisma);
  const idGenerator = new UuidGenerator();
  const uniqueness = new CandidateUniquenessService(candidateRepository);

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is required to verify access tokens.');
  }
  const tokenVerifier = new HmacJwtVerifier(jwtSecret);

  return {
    createCandidate: new CreateCandidate(candidateRepository, uniqueness, idGenerator),
    moveCandidateStage: new MoveCandidateStage(candidateRepository),
    listCandidates: new ListCandidates(candidateRepository),
    getCandidate: new GetCandidate(candidateRepository),
    updateCandidate: new UpdateCandidate(candidateRepository, uniqueness),
    tokenVerifier,
  };
}

registerContainerFactory(build);
