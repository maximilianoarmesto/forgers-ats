/**
 * Next.js instrumentation hook — runs once when the server process starts.
 *
 * This is the application bootstrap/entry point. It is the single sanctioned
 * place where infrastructure (the composition root) is loaded so it can
 * register itself with the application-owned AppContainer accessor. After this
 * runs, route handlers in the interfaces layer can resolve use cases purely
 * through the application layer.
 */
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('@/infrastructure/composition/bootstrap');
  }
}
