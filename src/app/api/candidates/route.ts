import { NextResponse } from 'next/server';
import { candidateController } from '@/interfaces/http/controllers/CandidateController';
import { withAuth } from '@/interfaces/http/auth';

/**
 * Route handlers (interfaces layer). Translate the HTTP request into a
 * controller call and the controller result back into an HTTP response.
 * Both handlers are guarded by withAuth, which requires a valid JWT.
 */
export const GET = withAuth(async (): Promise<NextResponse> => {
  const result = await candidateController.list();
  return NextResponse.json(result.body, { status: result.status });
});

export const POST = withAuth(async (request: Request): Promise<NextResponse> => {
  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const result = await candidateController.create(body);
  return NextResponse.json(result.body, { status: result.status });
});
