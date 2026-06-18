/**
 * Side-effecting module that registers the composition root.
 *
 * The Next.js `instrumentation.ts` hook imports this once at server startup so
 * that the application's AppContainer factory is registered before any route
 * handler resolves a use case.
 */
import './container';
