import { resolveContainer } from '@/application/AppContainer';
import { CandidateDTO, ResumeContentDTO, UploadedResumeDTO } from '@/application/dtos/CandidateDTO';
import {
  createCandidateSchema,
  moveStageSchema,
  updateCandidateSchema,
} from '../validation/candidateSchemas';
import { mapErrorToHttp } from '../errors';

export interface ControllerResult<T> {
  status: number;
  body: T | { error: string };
}

/**
 * CandidateController — a thin adapter. It validates input, invokes a use case
 * through the application container, and shapes a transport-agnostic result
 * (status + body). It contains NO business logic and never touches the
 * domain or infrastructure directly.
 */
export class CandidateController {
  async list(): Promise<ControllerResult<CandidateDTO[]>> {
    try {
      const dtos = await resolveContainer().listCandidates.execute();
      return { status: 200, body: dtos };
    } catch (error) {
      return mapErrorToHttp(error);
    }
  }

  async create(rawBody: unknown): Promise<ControllerResult<CandidateDTO>> {
    const parsed = createCandidateSchema.safeParse(rawBody);
    if (!parsed.success) {
      return { status: 400, body: { error: parsed.error.message } };
    }

    try {
      const dto = await resolveContainer().createCandidate.execute(parsed.data);
      return { status: 201, body: dto };
    } catch (error) {
      return mapErrorToHttp(error);
    }
  }

  async get(candidateId: string): Promise<ControllerResult<CandidateDTO>> {
    try {
      const dto = await resolveContainer().getCandidate.execute(candidateId);
      return { status: 200, body: dto };
    } catch (error) {
      return mapErrorToHttp(error);
    }
  }

  async update(candidateId: string, rawBody: unknown): Promise<ControllerResult<CandidateDTO>> {
    const parsed = updateCandidateSchema.safeParse(rawBody);
    if (!parsed.success) {
      return { status: 400, body: { error: parsed.error.message } };
    }

    try {
      const dto = await resolveContainer().updateCandidate.execute({
        candidateId,
        ...parsed.data,
      });
      return { status: 200, body: dto };
    } catch (error) {
      return mapErrorToHttp(error);
    }
  }

  async uploadResume(file: {
    data: Uint8Array;
    fileName: string;
    contentType: string;
  }): Promise<ControllerResult<UploadedResumeDTO>> {
    try {
      const dto = await resolveContainer().uploadResume.execute(file);
      return { status: 201, body: dto };
    } catch (error) {
      return mapErrorToHttp(error);
    }
  }

  async getResume(candidateId: string): Promise<ControllerResult<ResumeContentDTO>> {
    try {
      const dto = await resolveContainer().getCandidateResume.execute(candidateId);
      return { status: 200, body: dto };
    } catch (error) {
      return mapErrorToHttp(error);
    }
  }

  async moveStage(candidateId: string, rawBody: unknown): Promise<ControllerResult<CandidateDTO>> {
    const parsed = moveStageSchema.safeParse(rawBody);
    if (!parsed.success) {
      return { status: 400, body: { error: parsed.error.message } };
    }

    try {
      const dto = await resolveContainer().moveCandidateStage.execute({
        candidateId,
        targetStage: parsed.data.targetStage,
      });
      return { status: 200, body: dto };
    } catch (error) {
      return mapErrorToHttp(error);
    }
  }
}

export const candidateController = new CandidateController();
