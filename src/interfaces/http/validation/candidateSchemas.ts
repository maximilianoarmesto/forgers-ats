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

export type CreateCandidateBody = z.infer<typeof createCandidateSchema>;
export type MoveStageBody = z.infer<typeof moveStageSchema>;
