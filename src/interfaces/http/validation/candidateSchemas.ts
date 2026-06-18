import { z } from 'zod';

/**
 * Input (schema) validation only — NOT business validation.
 * Ensures requests are well-formed before reaching a use case.
 */
export const createCandidateSchema = z.object({
  fullName: z.string().min(1, 'fullName is required'),
  email: z.string().min(1, 'email is required'),
  jobTitle: z.string().min(1, 'jobTitle is required'),
});

export const moveStageSchema = z.object({
  targetStage: z.string().min(1, 'targetStage is required'),
});

/**
 * Partial update: every field is optional, but at least one must be present.
 * Empty strings are rejected so a provided field always carries a value.
 */
export const updateCandidateSchema = z
  .object({
    fullName: z.string().min(1, 'fullName cannot be empty').optional(),
    email: z.string().min(1, 'email cannot be empty').optional(),
    jobTitle: z.string().min(1, 'jobTitle cannot be empty').optional(),
  })
  .refine(
    (data) =>
      data.fullName !== undefined || data.email !== undefined || data.jobTitle !== undefined,
    { message: 'At least one field (fullName, email, jobTitle) is required' },
  );

export type CreateCandidateBody = z.infer<typeof createCandidateSchema>;
export type MoveStageBody = z.infer<typeof moveStageSchema>;
export type UpdateCandidateBody = z.infer<typeof updateCandidateSchema>;
