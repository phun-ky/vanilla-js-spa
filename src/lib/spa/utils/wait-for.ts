/**
 * Delays execution for the specified time.
 *
 * @param {number} ms - The time to wait in milliseconds.
 * @returns {Promise<void>} A Promise that resolves after the specified time.
 *
 * @example
 * ```ts
 * // Wait for 2 seconds
 * await waitFor(2000);
 * ```
 */
export const waitFor = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
