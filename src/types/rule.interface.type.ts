export interface Rule {
  id: string;
  selector: string;
  domain: string;
  is_enabled: boolean;
  created_at: string;
  label?: string;
}

export interface Statistics {
  total_blocked: number;
  domains_with_rules: number;
  last_rule_created: string | null;
}
