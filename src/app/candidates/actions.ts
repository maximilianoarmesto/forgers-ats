'use server';

import { revalidatePath } from 'next/cache';
import { candidateController } from '@/interfaces/http/controllers/CandidateController';
import type {
  CandidateDTO,
  ResumeReferenceInput,
  UploadedResumeDTO,
} from '@/application/dtos/CandidateDTO';

/**
 * Server Actions (interfaces layer) backing the candidate UI. They run on the
 * server and call the controller directly — the same use cases the HTTP API
 * exposes — so the browser never needs to hold a JWT. The JWT-protected HTTP
 * API remains available for external/programmatic clients.
 */

export interface MutationResult {
  ok: boolean;
  error?: string;
  id?: string;
}

export interface UploadResult {
  ok: boolean;
  error?: string;
  key?: string;
  fileName?: string;
  /** Retrievable URL for the just-uploaded file (served by /resumes/file/:key). */
  url?: string;
}

export interface CandidateFormValues {
  name: string;
  email: string;
  jobTitle: string;
  linkedInUrl: string;
  resume?: ResumeReferenceInput | null;
}

function errorMessage(body: unknown): string {
  if (body && typeof body === 'object' && 'error' in body) {
    return String((body as { error: unknown }).error);
  }
  return 'Something went wrong.';
}

export async function createCandidateAction(values: CandidateFormValues): Promise<MutationResult> {
  const result = await candidateController.create({
    name: values.name,
    email: values.email,
    jobTitle: values.jobTitle,
    linkedInUrl: values.linkedInUrl,
    resume: values.resume ?? undefined,
  });

  if (result.status >= 400) {
    return { ok: false, error: errorMessage(result.body) };
  }

  revalidatePath('/');
  return { ok: true, id: (result.body as CandidateDTO).id };
}

export async function updateCandidateAction(
  id: string,
  values: CandidateFormValues,
): Promise<MutationResult> {
  const result = await candidateController.update(id, {
    name: values.name,
    email: values.email,
    jobTitle: values.jobTitle,
    linkedInUrl: values.linkedInUrl,
    // `resume` is sent only when the user changed it (object = set, null =
    // remove); `undefined` leaves the existing résumé untouched.
    ...(values.resume !== undefined ? { resume: values.resume } : {}),
  });

  if (result.status >= 400) {
    return { ok: false, error: errorMessage(result.body) };
  }

  revalidatePath('/');
  revalidatePath(`/candidates/${id}/edit`);
  return { ok: true, id };
}

export async function uploadResumeAction(formData: FormData): Promise<UploadResult> {
  const file = formData.get('file');
  if (!(file instanceof File)) {
    return { ok: false, error: 'No file was provided.' };
  }

  const data = new Uint8Array(await file.arrayBuffer());
  const result = await candidateController.uploadResume({
    data,
    fileName: file.name,
    contentType: file.type,
  });

  if (result.status >= 400) {
    return { ok: false, error: errorMessage(result.body) };
  }

  const dto = result.body as UploadedResumeDTO;
  return {
    ok: true,
    key: dto.key,
    fileName: dto.fileName,
    url: `/resumes/file/${encodeURIComponent(dto.key)}`,
  };
}
