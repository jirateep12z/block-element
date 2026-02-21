export function GenerateSelector(element: Element): string {
  if (
    element.id &&
    document.querySelectorAll(`#${CSS.escape(element.id)}`).length === 1
  ) {
    return `#${CSS.escape(element.id)}`;
  }
  const tag = element.tagName.toLowerCase();
  const classes = Array.from(element.classList)
    .filter(c => c.trim() && !c.includes(':') && !c.includes('['))
    .slice(0, 3)
    .map(c => `.${CSS.escape(c)}`)
    .join('');

  if (classes) {
    const selector = `${tag}${classes}`;
    if (document.querySelectorAll(selector).length === 1) {
      return selector;
    }
  }
  return BuildPathSelector(element);
}

function BuildPathSelector(element: Element): string {
  const parts: string[] = [];
  let current: Element | null = element;
  while (current && current !== document.documentElement) {
    const part = GetElementPart(current);
    parts.unshift(part);
    const selector = parts.join(' > ');
    const matches = document.querySelectorAll(selector);
    if (matches.length === 1) {
      return selector;
    }
    current = current.parentElement;
  }
  return parts.join(' > ');
}

function GetElementPart(element: Element): string {
  const tag = element.tagName.toLowerCase();
  const id = element.id;
  if (id && document.querySelectorAll(`#${CSS.escape(id)}`).length === 1) {
    return `#${CSS.escape(id)}`;
  }
  const classes = Array.from(element.classList)
    .filter(c => c.trim() && !c.includes(':') && !c.includes('['))
    .slice(0, 2)
    .map(c => `.${CSS.escape(c)}`)
    .join('');
  if (classes) {
    return `${tag}${classes}`;
  }
  const parent = element.parentElement;
  if (parent) {
    const siblings = Array.from(parent.children).filter(
      c => c.tagName === element.tagName
    );
    if (siblings.length > 1) {
      const index = siblings.indexOf(element) + 1;
      return `${tag}:nth-of-type(${index})`;
    }
  }
  return tag;
}
