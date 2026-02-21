const STYLE_ID = 'be-injected-styles';

export async function InjectRules(): Promise<void> {
  const domain = window.location.hostname;
  if (!domain) return;
  try {
    const settings = await chrome.runtime.sendMessage({
      action: 'get-settings'
    });
    if (!settings?.enabled) return;
    if (settings.whitelist_domains?.includes(domain)) return;
    const rules = await chrome.runtime.sendMessage({
      action: 'get-rules',
      domain
    });
    if (!rules || rules.length === 0) return;
    const enabled_rules = (
      rules as Array<{ selector: string; is_enabled: boolean }>
    ).filter(r => r.is_enabled);
    if (enabled_rules.length === 0) return;
    const css = enabled_rules
      .map(r => `${r.selector} { display: none !important; }`)
      .join('\n');
    ApplyCSS(css);
  } catch {}
}

export function ApplyCSS(css: string): void {
  let style_el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!style_el) {
    style_el = document.createElement('style');
    style_el.id = STYLE_ID;
    document.head.appendChild(style_el);
  }
  style_el.textContent = css;
}
