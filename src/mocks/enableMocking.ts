/**
 * Starts the MSW browser worker in development. All network requests are
 * intercepted and resolved by handlers in `./handlers`, so the app never
 * needs a real backend to be developed against.
 */
export async function enableMocking() {
  if (!import.meta.env.DEV) {
    return
  }

  const { worker } = await import('./browser')

  await worker.start({
    onUnhandledRequest: 'bypass',
  })
}
