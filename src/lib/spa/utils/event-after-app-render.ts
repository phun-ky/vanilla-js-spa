export const eventAfterAppRender = () => {
  // Preserve focus state on render
  if (
    document.activeElement &&
    !document.activeElement.isEqualNode(globalThis.activeElement)
  ) {
    const { id } = globalThis.activeElement;

    if (id) {
      const elementToFocus = document.getElementById(id);

      if (elementToFocus) {
        elementToFocus.focus();
      }
    }
  }
};

