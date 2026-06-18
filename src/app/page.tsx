import { candidateController } from '@/interfaces/http/controllers/CandidateController';
import type { CandidateDTO } from '@/application/dtos/CandidateDTO';

export const dynamic = 'force-dynamic';

/**
 * Server Component entry page. As part of the interfaces layer, it calls the
 * controller (which calls a use case) and renders the result. No business
 * logic lives here.
 */
export default async function HomePage(): Promise<JSX.Element> {
  const result = await candidateController.list();
  const candidates: CandidateDTO[] = Array.isArray(result.body)
    ? result.body
    : [];

  return (
    <main style={{ maxWidth: 880, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <h1 style={{ marginBottom: '0.25rem' }}>Forgers ATS</h1>
      <p style={{ opacity: 0.7, marginTop: 0 }}>
        Applicant Tracking System &middot; Clean Architecture
      </p>

      <h2 style={{ marginTop: '2.5rem' }}>Candidate Pipeline</h2>
      {candidates.length === 0 ? (
        <p style={{ opacity: 0.7 }}>
          No candidates yet. Seed the database with <code>npm run db:seed</code>{' '}
          or POST to <code>/api/candidates</code>.
        </p>
      ) : (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '1rem',
          }}
        >
          <thead>
            <tr style={{ textAlign: 'left', opacity: 0.7 }}>
              <th style={{ padding: '0.5rem 0.75rem' }}>Name</th>
              <th style={{ padding: '0.5rem 0.75rem' }}>Email</th>
              <th style={{ padding: '0.5rem 0.75rem' }}>Role</th>
              <th style={{ padding: '0.5rem 0.75rem' }}>Stage</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => (
              <tr
                key={c.id}
                style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
              >
                <td style={{ padding: '0.5rem 0.75rem' }}>{c.fullName}</td>
                <td style={{ padding: '0.5rem 0.75rem' }}>{c.email}</td>
                <td style={{ padding: '0.5rem 0.75rem' }}>{c.jobTitle}</td>
                <td style={{ padding: '0.5rem 0.75rem' }}>{c.stage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
