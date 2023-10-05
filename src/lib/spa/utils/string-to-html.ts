/**
 * Convert a template string into HTML DOM nodes.
 *
 * The `stringToHTML` function takes a parameter `str`, which is
 * the template string to be converted into HTML.
 * It uses the `DOMParser` to parse the template string into HTML DOM nodes and
 * then returns the `body` of the parsed document as a `Node`.
 *
 * @param {string} str - The template string to be converted into HTML.
 * @returns {Element} - The template HTML represented as DOM nodes.
 */
export const stringToHTML = (str: string): Element => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, 'text/html');

  return doc.body;
};
