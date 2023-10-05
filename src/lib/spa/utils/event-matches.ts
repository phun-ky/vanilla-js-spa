import { EventType } from '../types';

/**
 * @param {Event} event The event.
 * @param {string} selector The selector.
 * @returns {Element}
 *   The closest ancestor of the event target (or the event target itself) which matches the selectors given in parameter.
 */
export const eventMatches = (
  event: EventType<HTMLElement>,
  selector: string
): HTMLElement | undefined => {
  // <svg> in IE does not have `Element#msMatchesSelector()` (that should be copied to `Element#matches()` by a polyfill).
  // Also a weird behavior is seen in IE where DOM tree seems broken when `event.target` is on <svg>.
  // Therefore this function simply returns `undefined` when `event.target` is on <svg>.
  const { target, currentTarget } = event;

  if (typeof target.matches === 'function') {
    if (target.matches(selector)) {
      // If event target itself matches the given selector, return it
      return target;
    }

    if (target.matches(`${selector} *`)) {
      const closest: HTMLElement | null = target.closest(selector);

      if (
        closest &&
        (currentTarget.nodeType === Node.DOCUMENT_NODE
          ? currentTarget.documentElement
          : currentTarget
        ).contains(closest)
      ) {
        return closest;
      }
    }
  }

  return undefined;
};
