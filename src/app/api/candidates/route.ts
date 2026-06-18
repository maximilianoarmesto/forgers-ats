import { NextResponse } from 'next/server';
import { candidateController } from '@/interfaces/http/controllers/CandidateController';

/**
 * Route handler (interfaces layer). Translates the HTTP request into a
 * controller call and the controller result back into an HTTP response.
 */
export async function GET(): Promise<NextResponse> {
  const result = await candidateController.list();
  return NextResponse.json(result.body, { status: result.status });
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 },
    );
  }

  const result = await candidateController.create(body);
  return NextResponse.json(result.body, { status: result.status });
}
