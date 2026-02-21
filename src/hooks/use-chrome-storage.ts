import { DEFAULT_SETTINGS, DEFAULT_STATISTICS } from '@/constants';
import type { Rule, Settings, Statistics, Theme } from '@/types';
import { useCallback, useEffect, useState } from 'react';

function IsChromeExtension(): boolean {
  return typeof chrome !== 'undefined' && chrome.runtime && !!chrome.runtime.id;
}

export function UseChromeStorage() {
  const [settings, set_settings] = useState<Settings>(DEFAULT_SETTINGS);
  const [rules, set_rules] = useState<Rule[]>([]);
  const [statistics, set_statistics] = useState<Statistics>(DEFAULT_STATISTICS);
  const [is_loading, set_is_loading] = useState(true);
  const [current_domain, set_current_domain] = useState('');

  const LoadCurrentDomain = useCallback(async () => {
    if (!IsChromeExtension()) {
      set_current_domain('example.com');
      return;
    }
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      });
      if (tab?.url) {
        const url = new URL(tab.url);
        set_current_domain(url.hostname);
      }
    } catch (error) {
      console.error('Failed to get current domain:', error);
    }
  }, []);

  const LoadSettings = useCallback(async () => {
    try {
      if (IsChromeExtension()) {
        const response = await chrome.runtime.sendMessage({
          action: 'get-settings'
        });
        set_settings(response || DEFAULT_SETTINGS);
      } else {
        const stored = localStorage.getItem('be_settings');
        if (stored) {
          set_settings(JSON.parse(stored) as Settings);
        }
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }, []);

  const LoadRules = useCallback(async (domain: string) => {
    if (!domain) return;
    try {
      if (IsChromeExtension()) {
        const response = await chrome.runtime.sendMessage({
          action: 'get-rules',
          domain
        });
        set_rules((response as Rule[]) || []);
      } else {
        const stored = localStorage.getItem(`be_rules_${domain}`);
        if (stored) {
          set_rules(JSON.parse(stored) as Rule[]);
        } else {
          set_rules([]);
        }
      }
    } catch (error) {
      console.error('Failed to load rules:', error);
    }
  }, []);

  const LoadStatistics = useCallback(async () => {
    try {
      if (IsChromeExtension()) {
        const response = await chrome.runtime.sendMessage({
          action: 'get-statistics'
        });
        set_statistics((response as Statistics) || DEFAULT_STATISTICS);
      } else {
        const stored = localStorage.getItem('be_statistics');
        if (stored) {
          set_statistics(JSON.parse(stored) as Statistics);
        }
      }
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  }, []);

  const LoadAll = useCallback(async () => {
    set_is_loading(true);
    try {
      await LoadCurrentDomain();
    } finally {
      set_is_loading(false);
    }
  }, [LoadCurrentDomain]);

  useEffect(() => {
    void LoadAll();
  }, [LoadAll]);

  useEffect(() => {
    if (!is_loading) {
      void LoadSettings();
      void LoadStatistics();
    }
  }, [is_loading, LoadSettings, LoadStatistics]);

  useEffect(() => {
    if (current_domain) {
      void LoadRules(current_domain);
    }
  }, [current_domain, LoadRules]);

  const SaveSettings = useCallback(async (new_settings: Settings) => {
    try {
      if (IsChromeExtension()) {
        await chrome.runtime.sendMessage({
          action: 'save-settings',
          settings: new_settings
        });
      } else {
        localStorage.setItem('be_settings', JSON.stringify(new_settings));
      }
      set_settings(new_settings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }, []);

  const SaveRule = useCallback(
    async (rule: Omit<Rule, 'id' | 'created_at'>) => {
      try {
        if (IsChromeExtension()) {
          const saved_rule = await chrome.runtime.sendMessage({
            action: 'save-rule',
            rule
          });
          set_rules(prev => [...prev, saved_rule as Rule]);
        } else {
          const new_rule: Rule = {
            ...rule,
            id: crypto.randomUUID(),
            created_at: new Date().toISOString()
          };
          const updated = [...rules, new_rule];
          localStorage.setItem(
            `be_rules_${rule.domain}`,
            JSON.stringify(updated)
          );
          set_rules(updated);
        }
        await LoadStatistics();
      } catch (error) {
        console.error('Failed to save rule:', error);
      }
    },
    [rules, LoadStatistics]
  );

  const DeleteRule = useCallback(
    async (rule_id: string) => {
      try {
        if (IsChromeExtension()) {
          await chrome.runtime.sendMessage({
            action: 'delete-rule',
            rule_id,
            domain: current_domain
          });
        } else {
          const updated = rules.filter(r => r.id !== rule_id);
          localStorage.setItem(
            `be_rules_${current_domain}`,
            JSON.stringify(updated)
          );
        }
        set_rules(prev => prev.filter(r => r.id !== rule_id));
        await LoadStatistics();
      } catch (error) {
        console.error('Failed to delete rule:', error);
      }
    },
    [current_domain, rules, LoadStatistics]
  );

  const ToggleRule = useCallback(
    async (rule_id: string, is_enabled: boolean) => {
      try {
        if (IsChromeExtension()) {
          await chrome.runtime.sendMessage({
            action: 'toggle-rule',
            rule_id,
            domain: current_domain,
            is_enabled
          });
        } else {
          const updated = rules.map(r =>
            r.id === rule_id ? { ...r, is_enabled } : r
          );
          localStorage.setItem(
            `be_rules_${current_domain}`,
            JSON.stringify(updated)
          );
        }
        set_rules(prev =>
          prev.map(r => (r.id === rule_id ? { ...r, is_enabled } : r))
        );
      } catch (error) {
        console.error('Failed to toggle rule:', error);
      }
    },
    [current_domain, rules]
  );

  const AddToWhitelist = useCallback(
    async (domain: string) => {
      try {
        if (IsChromeExtension()) {
          await chrome.runtime.sendMessage({
            action: 'add-to-whitelist',
            domain
          });
        }
        const updated_settings: Settings = {
          ...settings,
          whitelist_domains: [...settings.whitelist_domains, domain]
        };
        set_settings(updated_settings);
        if (!IsChromeExtension()) {
          localStorage.setItem('be_settings', JSON.stringify(updated_settings));
        }
      } catch (error) {
        console.error('Failed to add to whitelist:', error);
      }
    },
    [settings]
  );

  const RemoveFromWhitelist = useCallback(
    async (domain: string) => {
      try {
        if (IsChromeExtension()) {
          await chrome.runtime.sendMessage({
            action: 'remove-from-whitelist',
            domain
          });
        }
        const updated_settings: Settings = {
          ...settings,
          whitelist_domains: settings.whitelist_domains.filter(
            d => d !== domain
          )
        };
        set_settings(updated_settings);
        if (!IsChromeExtension()) {
          localStorage.setItem('be_settings', JSON.stringify(updated_settings));
        }
      } catch (error) {
        console.error('Failed to remove from whitelist:', error);
      }
    },
    [settings]
  );

  const EnsureContentScript = useCallback(async (tab_id: number) => {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab_id },
        files: ['content.js']
      });
    } catch {}
  }, []);

  const ActivatePicker = useCallback(async () => {
    if (!IsChromeExtension()) return;
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      });
      if (!tab?.id) return;
      try {
        await chrome.tabs.sendMessage(tab.id, { action: 'activate-picker' });
      } catch {
        await EnsureContentScript(tab.id);
        await chrome.tabs.sendMessage(tab.id, { action: 'activate-picker' });
      }
    } catch (error) {
      console.error('Failed to activate picker:', error);
    }
  }, [EnsureContentScript]);

  const DeactivatePicker = useCallback(async () => {
    if (!IsChromeExtension()) return;
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      });
      if (!tab?.id) return;
      try {
        await chrome.tabs.sendMessage(tab.id, { action: 'deactivate-picker' });
      } catch {}
    } catch (error) {
      console.error('Failed to deactivate picker:', error);
    }
  }, []);

  const ImportRules = useCallback(
    async (imported_rules: Rule[]) => {
      try {
        if (IsChromeExtension()) {
          const saved_rules = await chrome.runtime.sendMessage({
            action: 'import-rules',
            rules: imported_rules
          });
          if (saved_rules) {
            await LoadRules(current_domain);
          }
        } else {
          const existing = rules.filter(
            r => !imported_rules.some(ir => ir.selector === r.selector)
          );
          const merged = [...existing, ...imported_rules];
          localStorage.setItem(
            `be_rules_${current_domain}`,
            JSON.stringify(merged)
          );
          set_rules(merged);
        }
        await LoadStatistics();
      } catch (error) {
        console.error('Failed to import rules:', error);
      }
    },
    [current_domain, rules, LoadRules, LoadStatistics]
  );

  const UpdateTheme = useCallback(
    async (theme: Theme) => {
      await SaveSettings({ ...settings, theme });
    },
    [settings, SaveSettings]
  );

  const ToggleExtension = useCallback(
    async (enabled: boolean) => {
      await SaveSettings({ ...settings, enabled });
    },
    [settings, SaveSettings]
  );

  return {
    settings,
    rules,
    statistics,
    is_loading,
    current_domain,
    SaveSettings,
    SaveRule,
    DeleteRule,
    ToggleRule,
    AddToWhitelist,
    RemoveFromWhitelist,
    ActivatePicker,
    DeactivatePicker,
    ImportRules,
    UpdateTheme,
    ToggleExtension
  };
}
