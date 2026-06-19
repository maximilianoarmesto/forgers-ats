import { candidateController } from '@/interfaces/http/controllers/CandidateController';
import type { ResumeContentDTO } from '@/application/dtos/CandidateDTO';

/**
 * GET /resumes/file/:key — stream a stored résumé PDF by its storage key.
 *
 * This serves a freshly uploaded file directly by the key returned from the
 * upload action, before it has been attached to a candidate. (Once attached,
 * the candidate-scoped `/resumes/:id` endpoint is also available.) Like that
 * endpoint, this is a UI-serving route distinct from the JWT-protected
 * `/api/candidates` API.
 */
export async function GET(
  _request: Request,
  { params }: { params: { key: string } },
): Promise<Response> {
  const result = await candidateController.getStoredResume(params.key);

  if (result.status !== 200) {
    return Response.json(result.body, { status: result.status });
  }

  const resume = result.body as ResumeContentDTO;
  // Copy into a concrete ArrayBuffer so the bytes satisfy BodyInit regardless
  // of the underlying buffer type.
  const body = resume.data.buffer.slice(
    resume.data.byteOffset,
    resume.data.byteOffset + resume.data.byteLength,
  ) as ArrayBuffer;
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': resume.contentType,
      'Content-Disposition': `inline; filename="${encodeURIComponent(resume.fileName)}"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
