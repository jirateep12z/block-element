import { DEFAULT_SETTINGS, STORAGE_KEYS } from '@/constants';
import type { BackgroundMessage, Settings } from '@/types';
import { CreateContextMenus, GetRules, HandleMessage } from './services';

chrome.runtime.onInstalled.addListener(async () => {
  try {
    const stored = (await chrome.storage.sync.get(STORAGE_KEYS.SETTINGS)) as {
      [key: string]: Settings;
    };
    if (!stored[STORAGE_KEYS.SETTINGS]) {
      await chrome.storage.sync.set({
        [STORAGE_KEYS.SETTINGS]: DEFAULT_SETTINGS
      });
    }
    CreateContextMenus();
  } catch (error) {
    console.error('onInstalled error:', error);
  }
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'block-element-picker' && tab?.id) {
    try {
      try {
        await chrome.tabs.sendMessage(tab.id, { action: 'activate-picker' });
      } catch {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        });
        await chrome.tabs.sendMessage(tab.id, { action: 'activate-picker' });
      }
    } catch (error) {
      console.error('Failed to activate picker via context menu:', error);
    }
  }
});

chrome.runtime.onMessage.addListener(
  (
    message: BackgroundMessage,
    sender: chrome.runtime.MessageSender,
    send_response: (response?: unknown) => void
  ) => {
    return HandleMessage(message, sender, send_response);
  }
);

chrome.tabs.onUpdated.addListener(async (tab_id, change_info, tab) => {
  if (change_info.status !== 'complete' || !tab.url) return;
  try {
    const url = new URL(tab.url);
    const domain = url.hostname;
    if (!domain) return;
    const stored_settings = (await chrome.storage.sync.get(
      STORAGE_KEYS.SETTINGS
    )) as { [key: string]: Settings };
    const settings = stored_settings[STORAGE_KEYS.SETTINGS] || DEFAULT_SETTINGS;
    if (!settings.enabled) return;
    if (settings.whitelist_domains.includes(domain)) return;
    const rules = await GetRules(domain);
    const enabled_rules = rules.filter(r => r.is_enabled);
    if (enabled_rules.length === 0) return;
    const css = enabled_rules
      .map(r => `${r.selector} { display: none !important; }`)
      .join('\n');
    await chrome.scripting.insertCSS({
      target: { tabId: tab_id },
      css
    });
  } catch (error) {
    console.debug('CSS injection skipped:', error);
  }
});
