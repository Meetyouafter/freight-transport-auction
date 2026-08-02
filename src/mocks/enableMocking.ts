const CONTROL_TIMEOUT_MS = 3000

/**
 * `worker.start()` resolves once the service worker is activated, but on a first-ever load the page
 * itself is not yet *controlled* by it, so the first API call escaped to the dev server (503) and
 * only the react-query retry reached MSW. Wait for the controller before rendering.
 */
function waitForServiceWorkerControl() {
  if (navigator.serviceWorker.controller) {
    return Promise.resolve()
  }

  return new Promise<void>((resolve) => {
    const timeout = setTimeout(resolve, CONTROL_TIMEOUT_MS)

    navigator.serviceWorker.addEventListener(
      'controllerchange',
      () => {
        clearTimeout(timeout)
        resolve()
      },
      { once: true },
    )
  })
}

export async function enableMocking() {
  if (!import.meta.env.DEV) {
    return
  }

  const { worker } = await import('./browser')

  await worker.start({
    onUnhandledRequest: 'bypass',
  })
  await waitForServiceWorkerControl()
}
