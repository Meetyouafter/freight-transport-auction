import { setupServer } from 'msw/node'
import { handlers } from './handlers'

/**
 * Node-side MSW server for integration/unit tests (e.g. Vitest + Testing Library).
 * Not used by the browser app — see `browser.ts` for that.
 */
export const server = setupServer(...handlers)
