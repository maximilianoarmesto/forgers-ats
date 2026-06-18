import { NextResponse } from 'next/server';
import { candidateController } from '@/interfaces/http/controllers/CandidateController';
import { withAuth } from '@/interfaces/http/auth';

type RouteContext = { params: { id: string } };

/**
 * GET /api/candidates/:id — retrieve a single candidate.
 */
export const GET = withAuth(
  async (_request: Request, { params }: RouteContext): Promise<NextResponse> => {
    const result = await candidateController.get(params.id);
    return NextResponse.json(result.body, { status: result.status });
  },
);

async function update(request: Request, { params }: RouteContext): Promise<NextResponse> {
  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const result = await candidateController.update(params.id, body);
  return NextResponse.json(result.body, { status: result.status });
}

/**
 * PUT/PATCH /api/candidates/:id — update editable candidate fields.
 * Both verbs map to the same partial-update handler.
 */
export const PUT = withAuth(update);
export const PATCH = withAuth(update);
