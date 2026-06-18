import Link from 'next/link';
import { notFound } from 'next/navigation';
import { candidateController } from '@/interfaces/http/controllers/CandidateController';
import type { CandidateDTO } from '@/application/dtos/CandidateDTO';
import { styles } from '../../../ui/theme';
import { CandidateForm } from '../../CandidateForm';

export const dynamic = 'force-dynamic';

export default async function EditCandidatePage({
  params,
}: {
  params: { id: string };
}): Promise<JSX.Element> {
  const result = await candidateController.get(params.id);
  if (result.status !== 200) {
    notFound();
  }
  const candidate = result.body as CandidateDTO;

  return (
    <main style={styles.page}>
      <Link href="/" style={styles.link}>
        ← Back to candidates
      </Link>
      <h1 style={{ marginTop: '1rem', marginBottom: '0.25rem' }}>Edit candidate</h1>
      <p style={{ ...styles.hint, marginBottom: '1.5rem' }}>{candidate.email}</p>
      <CandidateForm mode="edit" candidate={candidate} />
    </main>
  );
}
