import type { Settings, Statistics } from '@/types';

export const DEFAULT_SETTINGS: Settings = {
  enabled: true,
  theme: 'system',
  whitelist_domains: []
};

export const DEFAULT_STATISTICS: Statistics = {
  total_blocked: 0,
  domains_with_rules: 0,
  last_rule_created: null
};

export const STORAGE_KEYS = {
  SETTINGS: 'be_settings',
  RULES: 'be_rules',
  STATISTICS: 'be_statistics'
} as const;
