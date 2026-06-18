import type { CSSProperties } from 'react';

/**
 * Small set of shared inline-style tokens so the candidate UI stays visually
 * consistent without pulling in a CSS framework. Matches the dark theme set in
 * the root layout.
 */
export const colors = {
  bg: '#0b1020',
  panel: '#141a2f',
  border: 'rgba(255,255,255,0.12)',
  text: '#e6e9f0',
  muted: 'rgba(230,233,240,0.6)',
  accent: '#5b8cff',
  danger: '#ff6b6b',
  success: '#4ade80',
};

export const styles: Record<string, CSSProperties> = {
  page: { maxWidth: 880, margin: '0 auto', padding: '3rem 1.5rem' },
  card: {
    background: colors.panel,
    border: `1px solid ${colors.border}`,
    borderRadius: 12,
    padding: '1.5rem',
  },
  label: {
    display: 'block',
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 6,
    color: colors.text,
  },
  hint: { fontSize: 12, color: colors.muted, marginTop: 4 },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '0.6rem 0.75rem',
    borderRadius: 8,
    border: `1px solid ${colors.border}`,
    background: colors.bg,
    color: colors.text,
    fontSize: 14,
  },
  inputError: { border: `1px solid ${colors.danger}` },
  fieldError: { color: colors.danger, fontSize: 12, marginTop: 4 },
  field: { marginBottom: '1.1rem' },
  primaryButton: {
    padding: '0.6rem 1.1rem',
    borderRadius: 8,
    border: 'none',
    background: colors.accent,
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  secondaryButton: {
    padding: '0.6rem 1.1rem',
    borderRadius: 8,
    border: `1px solid ${colors.border}`,
    background: 'transparent',
    color: colors.text,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
  },
  link: { color: colors.accent },
};
