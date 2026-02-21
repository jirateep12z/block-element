import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { RulesPanel } from '@/components/rules-panel';
import { SettingsPanel } from '@/components/settings-panel';
import { StatisticsCard } from '@/components/statistics-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WhitelistPanel } from '@/components/whitelist-panel';
import { UseChromeStorage } from '@/hooks/use-chrome-storage';
import { UseTheme } from '@/hooks/use-theme';
import type { Rule, Theme } from '@/types';
import { BarChart3, List, Settings, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const {
    settings,
    rules,
    statistics,
    is_loading,
    current_domain,
    SaveSettings,
    DeleteRule,
    ToggleRule,
    AddToWhitelist,
    RemoveFromWhitelist,
    ActivatePicker,
    DeactivatePicker,
    ImportRules,
    UpdateTheme
  } = UseChromeStorage();

  const { ChangeTheme } = UseTheme();
  const [is_picker_active, set_is_picker_active] = useState(false);

  useEffect(() => {
    ChangeTheme(settings.theme);
  }, [settings.theme, ChangeTheme]);

  const HandleActivatePicker = () => {
    set_is_picker_active(true);
    void ActivatePicker();
    window.close();
  };

  const HandleDeactivatePicker = () => {
    set_is_picker_active(false);
    void DeactivatePicker();
  };

  const HandleExportRules = () => {
    const blob = new Blob([JSON.stringify(rules, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `block-element-${current_domain || 'rules'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const HandleThemeChange = (theme: Theme) => {
    void UpdateTheme(theme);
    ChangeTheme(theme);
  };

  const HandleSettingsChange = (new_settings: typeof settings) => {
    void SaveSettings(new_settings);
    if (new_settings.theme !== settings.theme) {
      ChangeTheme(new_settings.theme);
    }
  };

  if (is_loading) {
    return (
      <div className="bg-background flex h-[600px] w-[420px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-[600px] w-[420px] p-4">
      <Header
        is_picker_active={is_picker_active}
        OnActivatePicker={HandleActivatePicker}
        OnDeactivatePicker={HandleDeactivatePicker}
      />
      <div className="mt-4">
        <Tabs defaultValue="rules">
          <TabsList className="w-full">
            <TabsTrigger value="rules" className="flex-1 gap-1">
              <List className="h-3.5 w-3.5" />
              Rules
            </TabsTrigger>
            <TabsTrigger value="whitelist" className="flex-1 gap-1">
              <Shield className="h-3.5 w-3.5" />
              Whitelist
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1 gap-1">
              <Settings className="h-3.5 w-3.5" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex-1 gap-1">
              <BarChart3 className="h-3.5 w-3.5" />
              Stats
            </TabsTrigger>
          </TabsList>
          <div className="mt-3">
            <TabsContent value="rules">
              <RulesPanel
                domain={current_domain}
                rules={rules}
                is_picker_active={is_picker_active}
                OnToggleRule={(rule_id, is_enabled) =>
                  void ToggleRule(rule_id, is_enabled)
                }
                OnDeleteRule={rule_id => void DeleteRule(rule_id)}
                OnActivatePicker={HandleActivatePicker}
                OnDeactivatePicker={HandleDeactivatePicker}
                OnImportRules={(imported: Rule[]) => void ImportRules(imported)}
                OnExportRules={HandleExportRules}
              />
            </TabsContent>
            <TabsContent value="whitelist">
              <WhitelistPanel
                whitelist_domains={settings.whitelist_domains}
                OnAddDomain={domain => void AddToWhitelist(domain)}
                OnRemoveDomain={domain => void RemoveFromWhitelist(domain)}
              />
            </TabsContent>
            <TabsContent value="settings">
              <SettingsPanel
                settings={settings}
                OnSettingsChange={HandleSettingsChange}
                OnThemeChange={HandleThemeChange}
              />
            </TabsContent>
            <TabsContent value="stats">
              <StatisticsCard
                statistics={statistics}
                domain={current_domain}
                domain_rule_count={rules.length}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}

export default App;
