import type { Rule } from './rule.interface.type';
import type { Settings } from './settings.interface.type';

export interface GetRulesMessage {
  action: 'get-rules';
  domain: string;
}

export interface GetAllRulesMessage {
  action: 'get-all-rules';
}

export interface SaveRuleMessage {
  action: 'save-rule';
  rule: Omit<Rule, 'id' | 'created_at'>;
}

export interface DeleteRuleMessage {
  action: 'delete-rule';
  rule_id: string;
  domain: string;
}

export interface ToggleRuleMessage {
  action: 'toggle-rule';
  rule_id: string;
  domain: string;
  is_enabled: boolean;
}

export interface GetSettingsMessage {
  action: 'get-settings';
}

export interface SaveSettingsMessage {
  action: 'save-settings';
  settings: Settings;
}

export interface GetStatisticsMessage {
  action: 'get-statistics';
}

export interface AddToWhitelistMessage {
  action: 'add-to-whitelist';
  domain: string;
}

export interface RemoveFromWhitelistMessage {
  action: 'remove-from-whitelist';
  domain: string;
}

export interface ActivatePickerMessage {
  action: 'activate-picker';
}

export interface DeactivatePickerMessage {
  action: 'deactivate-picker';
}

export interface ImportRulesMessage {
  action: 'import-rules';
  rules: Rule[];
}

export type BackgroundMessage =
  | GetRulesMessage
  | GetAllRulesMessage
  | SaveRuleMessage
  | DeleteRuleMessage
  | ToggleRuleMessage
  | GetSettingsMessage
  | SaveSettingsMessage
  | GetStatisticsMessage
  | AddToWhitelistMessage
  | RemoveFromWhitelistMessage
  | ImportRulesMessage;

export type ContentMessage = ActivatePickerMessage | DeactivatePickerMessage;
