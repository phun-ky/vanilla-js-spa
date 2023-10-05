/**
 * Sets the title of the document.
 *
 * @param {string} title - The title to set for the document.
 *
 * @example
 * ```ts
 * // Sets the document title to "My Page Title"
 * setTitle('My Page Title');
 * ```
 */
export const setTitle = (title: string): void => {
  document.title = title;
};
