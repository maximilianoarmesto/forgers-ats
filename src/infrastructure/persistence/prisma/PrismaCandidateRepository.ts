import type { PrismaClient, Candidate as PrismaCandidate } from '@prisma/client';
import { Candidate } from '@/domain/entities/Candidate';
import { Email } from '@/domain/value-objects/Email';
import { Stage } from '@/domain/value-objects/CandidateStage';
import { CandidateRepository } from '@/domain/repositories/CandidateRepository';

/**
 * Infrastructure implementation of the CandidateRepository domain interface.
 * Maps Prisma rows <-> domain entities. No business logic lives here.
 */
export class PrismaCandidateRepository implements CandidateRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Candidate | null> {
    const row = await this.prisma.candidate.findUnique({ where: { id } });
    return row ? PrismaCandidateRepository.toDomain(row) : null;
  }

  async findByEmail(email: Email): Promise<Candidate | null> {
    const row = await this.prisma.candidate.findUnique({
      where: { email: email.toString() },
    });
    return row ? PrismaCandidateRepository.toDomain(row) : null;
  }

  async list(): Promise<Candidate[]> {
    const rows = await this.prisma.candidate.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(PrismaCandidateRepository.toDomain);
  }

  async save(candidate: Candidate): Promise<void> {
    const data = {
      fullName: candidate.fullName,
      email: candidate.email.toString(),
      stage: candidate.stage.toString() as PrismaCandidate['stage'],
      jobTitle: candidate.jobTitle,
      createdAt: candidate.createdAt,
      updatedAt: candidate.updatedAt,
    };

    await this.prisma.candidate.upsert({
      where: { id: candidate.id },
      create: { id: candidate.id, ...data },
      update: data,
    });
  }

  private static toDomain(row: PrismaCandidate): Candidate {
    return Candidate.rehydrate({
      id: row.id,
      fullName: row.fullName,
      email: row.email,
      stage: row.stage as Stage,
      jobTitle: row.jobTitle,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
