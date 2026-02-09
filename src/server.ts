import { AngularAppEngine, createRequestHandler } from '@angular/ssr'
import { getContext } from '@netlify/angular-runtime/context.mjs'

const angularAppEngine = new AngularAppEngine()

export async function netlifyAppEngineHandler(request: Request): Promise<Response> {
  const context = getContext()

  // Si luego quieres endpoints tipo /api, se implementan aquí (opcional)
  // const pathname = new URL(request.url).pathname
  // if (pathname === '/api/hello') {
  //   return Response.json({ message: 'Hello from the API' })
  // }

  const result = await angularAppEngine.handle(request, context)
  return result || new Response('Not found', { status: 404 })
}

/**
 * Handler usado por Angular CLI (dev-server y durante build)
 */
export const reqHandler = createRequestHandler(netlifyAppEngineHandler)