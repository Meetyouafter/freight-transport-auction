/**
 * Dev-only switches to force a screen's loading/empty/error state during manual testing.
 * Flip these directly in code, then revert before committing.
 */
export const MOCK_DELAY_MS = 1000
export const MOCK_EMPTY = false
export const MOCK_ERROR = false

/** VAT divisor used by mock fixtures to derive `price_no_vat` from a VAT-inclusive price. */
export const MOCK_VAT_DIVISOR = 1.22
