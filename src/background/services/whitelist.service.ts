import { DEFAULT_SETTINGS, STORAGE_KEYS } from '@/constants';
import type { Settings } from '@/types';

export async function AddToWhitelist(domain: string): Promise<void> {
  const stored = (await chrome.storage.sync.get(STORAGE_KEYS.SETTINGS)) as {
    [key: string]: Settings;
  };
  const settings = stored[STORAGE_KEYS.SETTINGS] || DEFAULT_SETTINGS;
  if (!settings.whitelist_domains.includes(domain)) {
    settings.whitelist_domains = [...settings.whitelist_domains, domain];
    await chrome.storage.sync.set({ [STORAGE_KEYS.SETTINGS]: settings });
  }
}

export async function RemoveFromWhitelist(domain: string): Promise<void> {
  const stored = (await chrome.storage.sync.get(STORAGE_KEYS.SETTINGS)) as {
    [key: string]: Settings;
  };
  const settings = stored[STORAGE_KEYS.SETTINGS] || DEFAULT_SETTINGS;
  settings.whitelist_domains = settings.whitelist_domains.filter(
    d => d !== domain
  );
  await chrome.storage.sync.set({ [STORAGE_KEYS.SETTINGS]: settings });
}
