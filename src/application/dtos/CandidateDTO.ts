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
  createdAt: string;
  updatedAt: string;
}

export interface CreateCandidateInput {
  fullName: string;
  email: string;
  jobTitle: string;
}

export interface MoveCandidateStageInput {
  candidateId: string;
  targetStage: string;
}
