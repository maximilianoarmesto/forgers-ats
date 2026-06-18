import Link from 'next/link';
import { styles } from '../../ui/theme';
import { CandidateForm } from '../CandidateForm';

export const dynamic = 'force-dynamic';

export default function NewCandidatePage(): JSX.Element {
  return (
    <main style={styles.page}>
      <Link href="/" style={styles.link}>
        ← Back to candidates
      </Link>
      <h1 style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>New candidate</h1>
      <CandidateForm mode="create" />
    </main>
  );
}
