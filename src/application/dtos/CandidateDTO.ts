/**
 * Data Transfer Objects — plain contracts crossing the application boundary.
 * Interfaces (controllers) speak in DTOs; they never touch domain entities.
 */

export interface CandidateDTO {
  id: string;
  fullName: string;
  email: string;
  stage: string;
  jobTitle: string;
  linkedInUrl: string | null;
  resumeFileName: string | null;
  hasResume: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * A reference to a résumé that has already been uploaded to storage.
 */
export interface ResumeReferenceInput {
  key: string;
  fileName: string;
}

export interface CreateCandidateInput {
  fullName: string;
  email: string;
  jobTitle: string;
  linkedInUrl?: string | null;
  resume?: ResumeReferenceInput | null;
}

export interface MoveCandidateStageInput {
  candidateId: string;
  targetStage: string;
}

export interface UpdateCandidateInput {
  candidateId: string;
  fullName?: string;
  email?: string;
  jobTitle?: string;
  linkedInUrl?: string | null;
  resume?: ResumeReferenceInput | null;
}

/**
 * Output of uploading a résumé: an opaque storage key plus the original
 * file name, to be persisted onto a candidate.
 */
export interface UploadedResumeDTO {
  key: string;
  fileName: string;
}

/**
 * The bytes of a stored résumé, for streaming back to a client.
 */
export interface ResumeContentDTO {
  data: Uint8Array;
  fileName: string;
  contentType: string;
}
