import type { Theme } from './common.type';
import type { Rule, Statistics } from './rule.interface.type';
import type { Settings } from './settings.interface.type';

export interface RulesPanelProps {
  domain: string;
  rules: Rule[];
  is_picker_active: boolean;
  OnToggleRule: (rule_id: string, is_enabled: boolean) => void;
  OnDeleteRule: (rule_id: string) => void;
  OnActivatePicker: () => void;
  OnDeactivatePicker: () => void;
  OnImportRules: (rules: Rule[]) => void;
  OnExportRules: () => void;
}

export interface StatisticsCardProps {
  statistics: Statistics;
  domain: string;
  domain_rule_count: number;
}

export interface WhitelistPanelProps {
  whitelist_domains: string[];
  OnAddDomain: (domain: string) => void;
  OnRemoveDomain: (domain: string) => void;
}

export interface SettingsPanelProps {
  settings: Settings;
  OnSettingsChange: (settings: Settings) => void;
  OnThemeChange: (theme: Theme) => void;
}
