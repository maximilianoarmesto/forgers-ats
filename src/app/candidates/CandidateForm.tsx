'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { CandidateDTO, ResumeReferenceInput } from '@/application/dtos/CandidateDTO';
import { styles } from '../ui/theme';
import { ResumeUpload } from './ResumeUpload';
import { createCandidateAction, updateCandidateAction, type CandidateFormValues } from './actions';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface CandidateFormProps {
  mode: 'create' | 'edit';
  candidate?: CandidateDTO;
}

interface FieldErrors {
  name?: string;
  email?: string;
  jobTitle?: string;
  linkedInUrl?: string;
}

export function CandidateForm({ mode, candidate }: CandidateFormProps): JSX.Element {
  const router = useRouter();

  const [name, setName] = useState(candidate?.name ?? '');
  const [email, setEmail] = useState(candidate?.email ?? '');
  const [jobTitle, setJobTitle] = useState(candidate?.jobTitle ?? '');
  const [linkedInUrl, setLinkedInUrl] = useState(candidate?.linkedInUrl ?? '');
  // undefined = leave existing résumé untouched; object = new; null = removed.
  const [resume, setResume] = useState<ResumeReferenceInput | null | undefined>(undefined);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (name.trim().length < 2) next.name = 'Full name is required.';
    if (email.trim().length === 0) next.email = 'Email is required.';
    else if (!EMAIL_PATTERN.test(email.trim())) next.email = 'Enter a valid email address.';
    if (jobTitle.trim().length === 0) next.jobTitle = 'Job title is required.';
    if (linkedInUrl.trim().length > 0 && !/linkedin\.com/i.test(linkedInUrl))
      next.linkedInUrl = 'Enter a LinkedIn profile URL.';
    return next;
  }

  async function handleSubmit(event: React.FormEvent): Promise<void> {
    event.preventDefault();
    setFormError(null);

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const values: CandidateFormValues = {
      name: name.trim(),
      email: email.trim(),
      jobTitle: jobTitle.trim(),
      linkedInUrl: linkedInUrl.trim(),
      resume,
    };

    setSubmitting(true);
    const result =
      mode === 'create'
        ? await createCandidateAction(values)
        : await updateCandidateAction(candidate!.id, values);
    setSubmitting(false);

    if (!result.ok) {
      setFormError(result.error ?? 'Could not save the candidate.');
      return;
    }

    router.push('/');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} style={styles.card} noValidate>
      <Field label="Full name" error={errors.name} htmlFor="name" required>
        <input
          id="name"
          style={{ ...styles.input, ...(errors.name ? styles.inputError : {}) }}
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={Boolean(errors.name)}
        />
      </Field>

      <Field label="Email" error={errors.email} htmlFor="email" required>
        <input
          id="email"
          type="email"
          style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={Boolean(errors.email)}
        />
      </Field>

      <Field label="Job title" error={errors.jobTitle} htmlFor="jobTitle" required>
        <input
          id="jobTitle"
          style={{ ...styles.input, ...(errors.jobTitle ? styles.inputError : {}) }}
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          aria-invalid={Boolean(errors.jobTitle)}
        />
      </Field>

      <Field label="LinkedIn profile" error={errors.linkedInUrl} htmlFor="linkedInUrl">
        <input
          id="linkedInUrl"
          type="url"
          placeholder="https://www.linkedin.com/in/…"
          style={{ ...styles.input, ...(errors.linkedInUrl ? styles.inputError : {}) }}
          value={linkedInUrl}
          onChange={(e) => setLinkedInUrl(e.target.value)}
          aria-invalid={Boolean(errors.linkedInUrl)}
        />
      </Field>

      <div style={styles.field}>
        <ResumeUpload
          initialFileName={candidate?.resumeFileName ?? null}
          viewHref={mode === 'edit' && candidate?.hasResume ? `/resumes/${candidate.id}` : null}
          onChange={setResume}
        />
      </div>

      {formError ? (
        <p role="alert" style={{ ...styles.fieldError, marginBottom: '1rem' }}>
          {formError}
        </p>
      ) : null}

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button type="submit" style={styles.primaryButton} disabled={submitting}>
          {submitting ? 'Saving…' : mode === 'create' ? 'Create candidate' : 'Save changes'}
        </button>
        <Link href="/" style={styles.secondaryButton}>
          Cancel
        </Link>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div style={styles.field}>
      <label htmlFor={htmlFor} style={styles.label}>
        {label}
        {required ? <span style={{ color: '#ff6b6b' }}> *</span> : null}
      </label>
      {children}
      {error ? (
        <p role="alert" style={styles.fieldError}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
