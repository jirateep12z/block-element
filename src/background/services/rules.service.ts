import {
  DEFAULT_SETTINGS,
  DEFAULT_STATISTICS,
  STORAGE_KEYS
} from '@/constants';
import type { Rule, Settings, Statistics } from '@/types';

export async function GetSettings(): Promise<Settings> {
  try {
    const stored = (await chrome.storage.sync.get(STORAGE_KEYS.SETTINGS)) as {
      [key: string]: Settings;
    };
    return stored[STORAGE_KEYS.SETTINGS] || DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function SaveSettings(new_settings: Settings): Promise<void> {
  await chrome.storage.sync.set({ [STORAGE_KEYS.SETTINGS]: new_settings });
}

export async function GetRules(domain: string): Promise<Rule[]> {
  try {
    const stored = (await chrome.storage.sync.get(STORAGE_KEYS.RULES)) as {
      [key: string]: Record<string, Rule[]>;
    };
    const all_rules = stored[STORAGE_KEYS.RULES] || {};
    return all_rules[domain] || [];
  } catch {
    return [];
  }
}

export async function GetAllRules(): Promise<Record<string, Rule[]>> {
  try {
    const stored = (await chrome.storage.sync.get(STORAGE_KEYS.RULES)) as {
      [key: string]: Record<string, Rule[]>;
    };
    return stored[STORAGE_KEYS.RULES] || {};
  } catch {
    return {};
  }
}

export async function SaveRule(
  rule: Omit<Rule, 'id' | 'created_at'>
): Promise<Rule> {
  const new_rule: Rule = {
    ...rule,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString()
  };
  const all_rules = await GetAllRules();
  if (!all_rules[rule.domain]) {
    all_rules[rule.domain] = [];
  }
  all_rules[rule.domain].push(new_rule);
  await chrome.storage.sync.set({ [STORAGE_KEYS.RULES]: all_rules });
  return new_rule;
}

export async function DeleteRule(
  rule_id: string,
  domain: string
): Promise<void> {
  const all_rules = await GetAllRules();
  if (all_rules[domain]) {
    all_rules[domain] = all_rules[domain].filter(r => r.id !== rule_id);
    if (all_rules[domain].length === 0) {
      delete all_rules[domain];
    }
  }
  await chrome.storage.sync.set({ [STORAGE_KEYS.RULES]: all_rules });
}

export async function ToggleRule(
  rule_id: string,
  domain: string,
  is_enabled: boolean
): Promise<void> {
  const all_rules = await GetAllRules();
  if (all_rules[domain]) {
    all_rules[domain] = all_rules[domain].map(r =>
      r.id === rule_id ? { ...r, is_enabled } : r
    );
  }
  await chrome.storage.sync.set({ [STORAGE_KEYS.RULES]: all_rules });
}

export async function ImportRules(imported_rules: Rule[]): Promise<boolean> {
  try {
    const all_rules = await GetAllRules();
    for (const rule of imported_rules) {
      if (!all_rules[rule.domain]) {
        all_rules[rule.domain] = [];
      }
      const exists = all_rules[rule.domain].some(
        r => r.selector === rule.selector
      );
      if (!exists) {
        all_rules[rule.domain].push({
          ...rule,
          id: rule.id || crypto.randomUUID(),
          created_at: rule.created_at || new Date().toISOString()
        });
      }
    }
    await chrome.storage.sync.set({ [STORAGE_KEYS.RULES]: all_rules });
    return true;
  } catch {
    return false;
  }
}

export async function GetStatistics(): Promise<Statistics> {
  try {
    const stored = (await chrome.storage.sync.get(STORAGE_KEYS.STATISTICS)) as {
      [key: string]: Statistics;
    };
    return stored[STORAGE_KEYS.STATISTICS] || DEFAULT_STATISTICS;
  } catch {
    return DEFAULT_STATISTICS;
  }
}

export async function UpdateStatistics(): Promise<void> {
  try {
    const all_rules = await GetAllRules();
    const domains = Object.keys(all_rules);
    const total_blocked = domains.reduce(
      (acc, domain) => acc + all_rules[domain].length,
      0
    );
    const all_rule_dates = domains
      .flatMap(d => all_rules[d])
      .map(r => r.created_at)
      .sort()
      .reverse();

    const new_stats: Statistics = {
      total_blocked,
      domains_with_rules: domains.length,
      last_rule_created: all_rule_dates[0] || null
    };

    await chrome.storage.sync.set({
      [STORAGE_KEYS.STATISTICS]: new_stats
    });
  } catch (error) {
    console.error('Failed to update statistics:', error);
  }
}
