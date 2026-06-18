import { NextResponse } from 'next/server';
import { candidateController } from '@/interfaces/http/controllers/CandidateController';

/**
 * Route handler to move a candidate to a new pipeline stage.
 * PATCH /api/candidates/:id/stage  { "targetStage": "SCREENING" }
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const result = await candidateController.moveStage(params.id, body);
  return NextResponse.json(result.body, { status: result.status });
}
