import { GenerateSelector } from './selector-generator';
import { RemoveToolbar, ShowToolbar } from './toolbar';

const HIGHLIGHT_STYLE = `
  outline: 2px solid oklch(0.723 0.191 142.5) !important;
  outline-offset: 2px !important;
  cursor: crosshair !important;
`;

const OVERLAY_ID = 'be-overlay';

let is_active = false;
let highlighted_element: Element | null = null;
let original_style = '';
let current_selector = '';

function GetDomain(): string {
  return window.location.hostname;
}

function HighlightElement(element: Element): void {
  if (highlighted_element && highlighted_element !== element) {
    UnhighlightElement();
  }
  if (element === highlighted_element) return;
  highlighted_element = element;
  original_style = (element as HTMLElement).getAttribute('style') || '';
  const el = element as HTMLElement;
  el.style.cssText += HIGHLIGHT_STYLE;
}

function UnhighlightElement(): void {
  if (!highlighted_element) return;
  const el = highlighted_element as HTMLElement;
  el.setAttribute('style', original_style);
  highlighted_element = null;
  original_style = '';
}

function HandleMouseOver(event: MouseEvent): void {
  if (!is_active) return;
  const target = event.target as Element;
  if (!target || target.id === 'be-toolbar-host' || target.id === OVERLAY_ID) {
    return;
  }
  HighlightElement(target);
}

function HandleClick(event: MouseEvent): void {
  if (!is_active) return;
  const target = event.target as Element;
  if (!target || target.id === 'be-toolbar-host' || target.id === OVERLAY_ID) {
    return;
  }
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  current_selector = GenerateSelector(target);
  void GetIsDark().then(is_dark => {
    ShowToolbar(
      target,
      current_selector,
      {
        OnBlock: () => {
          void SaveRule(target);
          DeactivatePicker();
        },
        OnCancel: () => {
          DeactivatePicker();
        }
      },
      is_dark
    );
  });
}

async function GetIsDark(): Promise<boolean> {
  try {
    const stored = await chrome.storage.sync.get('be_settings');
    const theme = (stored['be_settings'] as { theme?: string } | undefined)
      ?.theme;
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}

async function SaveRule(element: Element): Promise<void> {
  const selector = GenerateSelector(element);
  const domain = GetDomain();
  try {
    await chrome.runtime.sendMessage({
      action: 'save-rule',
      rule: {
        selector,
        domain,
        is_enabled: true,
        label: selector
      }
    });
    const style_id = 'be-injected-styles';
    let style_el = document.getElementById(style_id) as HTMLStyleElement | null;
    if (!style_el) {
      style_el = document.createElement('style');
      style_el.id = style_id;
      document.head.appendChild(style_el);
    }
    style_el.textContent += `\n${selector} { display: none !important; }`;
  } catch (error) {
    console.error('Block Element: failed to save rule', error);
  }
}

export function ActivatePicker(): void {
  if (is_active) return;
  is_active = true;
  const overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 2147483646;
    cursor: crosshair;
    pointer-events: none;
  `;
  document.documentElement.appendChild(overlay);
  document.addEventListener('mouseover', HandleMouseOver, true);
  document.addEventListener('click', HandleClick, true);
  document.addEventListener('contextmenu', HandleClick, true);
  document.addEventListener('keydown', HandleKeyDown, true);
}

export function DeactivatePicker(): void {
  is_active = false;
  UnhighlightElement();
  RemoveToolbar();
  document.getElementById(OVERLAY_ID)?.remove();
  document.removeEventListener('mouseover', HandleMouseOver, true);
  document.removeEventListener('click', HandleClick, true);
  document.removeEventListener('contextmenu', HandleClick, true);
  document.removeEventListener('keydown', HandleKeyDown, true);
}

function HandleKeyDown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    DeactivatePicker();
  }
}

export { current_selector };
