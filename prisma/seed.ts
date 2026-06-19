import { PrismaClient, CandidateStage } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await prisma.candidate.upsert({
    where: { email: 'ada.lovelace@example.com' },
    update: {},
    create: {
      name: 'Ada Lovelace',
      email: 'ada.lovelace@example.com',
      jobTitle: 'Senior Software Engineer',
      stage: CandidateStage.INTERVIEW,
    },
  });

  await prisma.candidate.upsert({
    where: { email: 'alan.turing@example.com' },
    update: {},
    create: {
      name: 'Alan Turing',
      email: 'alan.turing@example.com',
      jobTitle: 'Machine Learning Engineer',
      stage: CandidateStage.APPLIED,
    },
  });

  // eslint-disable-next-line no-console
  console.warn('Seed complete.');
}

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
