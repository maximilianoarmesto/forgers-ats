/**
 * CLI entry point (interfaces layer) — an alternative adapter to the same
 * use cases the HTTP layer uses. Demonstrates that interfaces are
 * interchangeable while application/domain stay untouched.
 *
 * Run with: npx ts-node src/interfaces/cli/listCandidates.ts
 */
import { resolveContainer } from '@/application/AppContainer';

async function main(): Promise<void> {
  // Load the composition root so the AppContainer factory is registered.
  await import('@/infrastructure/composition/bootstrap');

  const candidates = await resolveContainer().listCandidates.execute();

  if (candidates.length === 0) {
    // eslint-disable-next-line no-console
    console.warn('No candidates found.');
    return;
  }

  for (const c of candidates) {
    // eslint-disable-next-line no-console
    console.warn(`- [${c.stage}] ${c.fullName} <${c.email}> — ${c.jobTitle}`);
  }
}

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
