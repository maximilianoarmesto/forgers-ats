import Link from 'next/link';
import { candidateController } from '@/interfaces/http/controllers/CandidateController';
import type { CandidateDTO } from '@/application/dtos/CandidateDTO';
import { colors, styles } from './ui/theme';

export const dynamic = 'force-dynamic';

/**
 * Server Component entry page (interfaces layer). Calls the controller (which
 * calls a use case) and renders the candidate list. No business logic here.
 */
export default async function HomePage(): Promise<JSX.Element> {
  const result = await candidateController.list();
  const candidates: CandidateDTO[] = Array.isArray(result.body) ? result.body : [];

  const th: React.CSSProperties = {
    padding: '0.6rem 0.75rem',
    textAlign: 'left',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    color: colors.muted,
  };
  const td: React.CSSProperties = { padding: '0.7rem 0.75rem', fontSize: 14 };

  return (
    <main style={styles.page}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Forgers ATS</h1>
          <p style={{ ...styles.hint, marginTop: 0 }}>
            Applicant Tracking System · Clean Architecture
          </p>
        </div>
        <Link href="/candidates/new" style={styles.primaryButton}>
          + New candidate
        </Link>
      </div>

      <h2 style={{ marginTop: '2.5rem' }}>Candidate Pipeline</h2>

      {candidates.length === 0 ? (
        <div style={{ ...styles.card, marginTop: '1rem' }}>
          <p style={{ margin: 0, color: colors.muted }}>
            No candidates yet. Create your first one with{' '}
            <Link href="/candidates/new" style={styles.link}>
              + New candidate
            </Link>
            .
          </p>
        </div>
      ) : (
        <div style={{ ...styles.card, marginTop: '1rem', padding: 0, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <th style={th}>Name</th>
                <th style={th}>Email</th>
                <th style={th}>Role</th>
                <th style={th}>Stage</th>
                <th style={th}>LinkedIn</th>
                <th style={th}>Résumé</th>
                <th style={th} aria-label="actions" />
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => (
                <tr key={c.id} style={{ borderTop: `1px solid ${colors.border}` }}>
                  <td style={{ ...td, fontWeight: 600 }}>{c.name}</td>
                  <td style={td}>{c.email}</td>
                  <td style={td}>{c.jobTitle}</td>
                  <td style={td}>
                    <span
                      style={{
                        fontSize: 12,
                        padding: '0.15rem 0.5rem',
                        borderRadius: 999,
                        border: `1px solid ${colors.border}`,
                        color: colors.muted,
                      }}
                    >
                      {c.stage}
                    </span>
                  </td>
                  <td style={td}>
                    {c.linkedInUrl ? (
                      <a
                        href={c.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.link}
                      >
                        Profile ↗
                      </a>
                    ) : (
                      <span style={{ color: colors.muted }}>—</span>
                    )}
                  </td>
                  <td style={td}>
                    {c.hasResume ? (
                      <a
                        href={`/resumes/${c.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.link}
                      >
                        📄 View
                      </a>
                    ) : (
                      <span style={{ color: colors.muted }}>—</span>
                    )}
                  </td>
                  <td style={{ ...td, textAlign: 'right' }}>
                    <Link href={`/candidates/${c.id}/edit`} style={styles.link}>
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
