import { z } from 'zod';

/**
 * Input (schema) validation only — NOT business validation.
 * Ensures requests are well-formed before reaching a use case. Domain rules
 * (LinkedIn host, résumé being a PDF, email uniqueness) are enforced deeper in.
 */

/** A reference to an already-uploaded résumé. */
export const resumeReferenceSchema = z.object({
  key: z.string().min(1),
  fileName: z.string().min(1),
});

export const createCandidateSchema = z.object({
  fullName: z.string().min(1, 'fullName is required'),
  email: z.string().min(1, 'email is required').email('email must be a valid email address'),
  jobTitle: z.string().min(1, 'jobTitle is required'),
  // Optional; an empty string is treated as "no LinkedIn profile".
  linkedInUrl: z.string().optional(),
  resume: resumeReferenceSchema.optional(),
});

export const moveStageSchema = z.object({
  targetStage: z.string().min(1, 'targetStage is required'),
});

/**
 * Partial update: every field is optional, but at least one must be present.
 * `linkedInUrl: ""` clears the link; `resume: null` removes the résumé.
 */
export const updateCandidateSchema = z
  .object({
    fullName: z.string().min(1, 'fullName cannot be empty').optional(),
    email: z
      .string()
      .min(1, 'email cannot be empty')
      .email('email must be a valid email address')
      .optional(),
    jobTitle: z.string().min(1, 'jobTitle cannot be empty').optional(),
    linkedInUrl: z.string().optional(),
    resume: resumeReferenceSchema.nullable().optional(),
  })
  .refine(
    (data) =>
      data.fullName !== undefined ||
      data.email !== undefined ||
      data.jobTitle !== undefined ||
      data.linkedInUrl !== undefined ||
      data.resume !== undefined,
    { message: 'At least one field is required to update' },
  );

export type CreateCandidateBody = z.infer<typeof createCandidateSchema>;
export type MoveStageBody = z.infer<typeof moveStageSchema>;
export type UpdateCandidateBody = z.infer<typeof updateCandidateSchema>;
