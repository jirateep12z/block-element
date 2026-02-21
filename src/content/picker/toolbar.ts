const PRIMARY_COLOR = 'oklch(0.723 0.191 142.5)';
const TOOLBAR_ID = 'be-toolbar-host';

interface ToolbarCallbacks {
  OnBlock: () => void;
  OnCancel: () => void;
}

export function ShowToolbar(
  element: Element,
  selector: string,
  callbacks: ToolbarCallbacks,
  is_dark = false
): void {
  RemoveToolbar();
  const host = document.createElement('div');
  host.id = TOOLBAR_ID;
  host.style.cssText = `
    all: initial;
    position: fixed;
    z-index: 2147483647;
    pointer-events: auto;
  `;
  const shadow = host.attachShadow({ mode: 'open' });
  const rect = element.getBoundingClientRect();
  const top = Math.max(8, rect.top - 60);
  const left = Math.max(8, Math.min(rect.left, window.innerWidth - 320));
  const bg = is_dark ? '#1c1c1c' : '#ffffff';
  const border = is_dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb';
  const text_primary = is_dark ? '#f9fafb' : '#111827';
  const text_secondary = is_dark ? '#9ca3af' : '#6b7280';
  const selector_bg = is_dark ? '#2a2a2a' : '#f9fafb';
  const cancel_bg = is_dark ? '#2a2a2a' : '#f3f4f6';
  const cancel_text = is_dark ? '#d1d5db' : '#374151';
  const shadow_color = is_dark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.15)';
  shadow.innerHTML = `
    <style>
      * { box-sizing: border-box; font-family: system-ui, -apple-system, sans-serif; }
      .toolbar {
        position: fixed;
        top: ${top}px;
        left: ${left}px;
        background: ${bg};
        border: 1px solid ${border};
        border-radius: 10px;
        padding: 10px 12px;
        box-shadow: 0 4px 20px ${shadow_color};
        display: flex;
        flex-direction: column;
        gap: 8px;
        min-width: 280px;
        max-width: 320px;
      }
      .toolbar-header {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        font-weight: 600;
        color: ${text_primary};
      }
      .toolbar-icon {
        width: 18px;
        height: 18px;
        background: linear-gradient(135deg, #22c55e, #10b981);
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .toolbar-selector {
        font-size: 11px;
        color: ${text_secondary};
        background: ${selector_bg};
        border: 1px solid ${border};
        border-radius: 6px;
        padding: 5px 8px;
        font-family: 'Courier New', monospace;
        word-break: break-all;
        max-height: 48px;
        overflow-y: auto;
      }
      .toolbar-actions {
        display: flex;
        gap: 6px;
      }
      .btn {
        flex: 1;
        padding: 6px 12px;
        border-radius: 7px;
        font-size: 12px;
        font-weight: 500;
        border: none;
        cursor: pointer;
        transition: opacity 0.15s;
      }
      .btn:hover { opacity: 0.85; }
      .btn-block {
        background: ${PRIMARY_COLOR};
        color: white;
      }
      .btn-cancel {
        background: ${cancel_bg};
        color: ${cancel_text};
        border: 1px solid ${border};
      }
    </style>
    <div class="toolbar">
      <div class="toolbar-header">
        <div class="toolbar-icon">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
          </svg>
        </div>
        Block this element?
      </div>
      <div class="toolbar-selector">${EscapeHtml(selector)}</div>
      <div class="toolbar-actions">
        <button class="btn btn-block" id="btn-block">Block Element</button>
        <button class="btn btn-cancel" id="btn-cancel">Cancel</button>
      </div>
    </div>
  `;
  shadow.getElementById('btn-block')?.addEventListener('click', e => {
    e.stopPropagation();
    callbacks.OnBlock();
    RemoveToolbar();
  });
  shadow.getElementById('btn-cancel')?.addEventListener('click', e => {
    e.stopPropagation();
    callbacks.OnCancel();
    RemoveToolbar();
  });
  document.documentElement.appendChild(host);
}

export function RemoveToolbar(): void {
  document.getElementById(TOOLBAR_ID)?.remove();
}

function EscapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
