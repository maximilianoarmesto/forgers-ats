import { candidateController } from '@/interfaces/http/controllers/CandidateController';
import type { ResumeContentDTO } from '@/application/dtos/CandidateDTO';

/**
 * GET /resumes/:id — stream a candidate's résumé PDF for inline viewing.
 *
 * This is a UI-serving endpoint (reached via a browser link), distinct from
 * the JWT-protected `/api/candidates` API. It returns the bytes resolved
 * through the GetCandidateResume use case.
 */
export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
): Promise<Response> {
  const result = await candidateController.getResume(params.id);

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
