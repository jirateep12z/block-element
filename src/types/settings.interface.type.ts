import type { Theme } from './common.type';

export interface Settings {
  enabled: boolean;
  theme: Theme;
  whitelist_domains: string[];
}
