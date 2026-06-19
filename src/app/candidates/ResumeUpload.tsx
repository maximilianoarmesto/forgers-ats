'use client';

import { useRef, useState } from 'react';
import type { ResumeReferenceInput } from '@/application/dtos/CandidateDTO';
import { colors, styles } from '../ui/theme';
import { uploadResumeAction } from './actions';

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // keep in sync with ResumeFile VO

type Status = 'idle' | 'uploading' | 'success' | 'error';

interface ResumeUploadProps {
  /** Existing résumé file name (edit mode), if any. */
  initialFileName?: string | null;
  /** Link to view the existing résumé (edit mode), if any. */
  viewHref?: string | null;
  /**
   * Reports résumé changes to the parent form:
   *  - a reference object → a new résumé was uploaded
   *  - null → the existing résumé was removed
   *  - undefined → no change (leave as-is)
   */
  onChange: (resume: ResumeReferenceInput | null | undefined) => void;
}

export function ResumeUpload({
  initialFileName,
  viewHref,
  onChange,
}: ResumeUploadProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string>('');
  const [fileName, setFileName] = useState<string | null>(initialFileName ?? null);
  // Whether a résumé is currently attached after edits in this session.
  const [hasResume, setHasResume] = useState<boolean>(Boolean(initialFileName));
  // Retrievable URL of a file uploaded in this session (takes precedence over
  // the existing candidate-scoped link once the user replaces the résumé).
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  async function handleFile(file: File): Promise<void> {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setStatus('error');
      setMessage('Only PDF files are accepted.');
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setStatus('error');
      setMessage('File exceeds the 5 MB limit.');
      return;
    }

    setStatus('uploading');
    setMessage(`Uploading ${file.name}…`);

    const formData = new FormData();
    formData.append('file', file);
    const result = await uploadResumeAction(formData);

    if (!result.ok || !result.key || !result.fileName) {
      setStatus('error');
      setMessage(result.error ?? 'Upload failed.');
      return;
    }

    setStatus('success');
    setFileName(result.fileName);
    setMessage(`Uploaded ${result.fileName}`);
    setHasResume(true);
    setUploadedUrl(result.url ?? null);
    onChange({ key: result.key, fileName: result.fileName });
  }

  function handleRemove(): void {
    setStatus('idle');
    setMessage('');
    setFileName(null);
    setHasResume(false);
    setUploadedUrl(null);
    if (inputRef.current) inputRef.current.value = '';
    onChange(null);
  }

  // Prefer the just-uploaded file's URL; fall back to the existing résumé link.
  const effectiveViewHref = uploadedUrl ?? viewHref ?? null;

  const statusColor =
    status === 'error' ? colors.danger : status === 'success' ? colors.success : colors.muted;

  return (
    <div>
      <span style={styles.label}>Résumé (PDF)</span>

      {hasResume && fileName ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
            marginBottom: 8,
          }}
        >
          <span aria-label="attached résumé">📄 {fileName}</span>
          {effectiveViewHref ? (
            <a href={effectiveViewHref} target="_blank" rel="noopener noreferrer" style={styles.link}>
              View
            </a>
          ) : null}
          <button
            type="button"
            onClick={handleRemove}
            style={{ ...styles.secondaryButton, padding: '0.3rem 0.7rem' }}
          >
            Remove
          </button>
        </div>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        aria-label="Upload résumé PDF"
        disabled={status === 'uploading'}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
        style={{ ...styles.input, padding: '0.4rem', cursor: 'pointer' }}
      />

      {message ? (
        <p role="status" style={{ ...styles.hint, color: statusColor }}>
          {status === 'uploading'
            ? '⏳ '
            : status === 'success'
              ? '✓ '
              : status === 'error'
                ? '⚠ '
                : ''}
          {message}
        </p>
      ) : (
        <p style={styles.hint}>PDF only, up to 5 MB.</p>
      )}
    </div>
  );
}
