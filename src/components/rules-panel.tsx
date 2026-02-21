import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import type { Rule, RulesPanelProps } from '@/types';
import { Code2, Crosshair, Download, Trash2, Upload, X } from 'lucide-react';
import { useRef } from 'react';

export function RulesPanel({
  domain,
  rules,
  OnToggleRule,
  OnDeleteRule,
  OnImportRules,
  OnExportRules
}: RulesPanelProps) {
  const file_input_ref = useRef<HTMLInputElement>(null);

  const HandleExport = () => {
    OnExportRules();
  };

  const HandleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const content = e.target?.result as string;
        const imported = JSON.parse(content) as Rule[];
        if (Array.isArray(imported)) {
          OnImportRules(imported);
        }
      } catch {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
    if (event.target) event.target.value = '';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Badge variant="secondary" className="max-w-[180px] truncate text-xs">
            {domain || 'No domain'}
          </Badge>
          <Badge variant="outline" className="shrink-0 text-xs">
            {rules.length} {rules.length === 1 ? 'rule' : 'rules'}
          </Badge>
        </div>
        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => file_input_ref.current?.click()}
            title="Import rules"
          >
            <Upload className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={HandleExport}
            disabled={rules.length === 0}
            title="Export rules"
          >
            <Download className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <input
        ref={file_input_ref}
        type="file"
        accept=".json"
        className="hidden"
        onChange={HandleImportFile}
      />
      {rules.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-muted-foreground flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-500/10 dark:bg-neutral-400/10">
                <Crosshair className="h-6 w-6 text-green-600 dark:text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium">No rules yet</p>
                <p className="mt-1 text-xs">
                  Click{' '}
                  <span className="font-medium text-green-600 dark:text-green-500">
                    Pick
                  </span>{' '}
                  then click any element on the page to hide it
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Code2 className="h-4 w-4" />
              CSS Rules
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            <ScrollArea className="max-h-[280px]">
              <div className="divide-y">
                {rules.map(rule => (
                  <RuleItem
                    key={rule.id}
                    rule={rule}
                    OnToggle={OnToggleRule}
                    OnDelete={OnDeleteRule}
                  />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface RuleItemProps {
  rule: Rule;
  OnToggle: (rule_id: string, is_enabled: boolean) => void;
  OnDelete: (rule_id: string) => void;
}

function RuleItem({ rule, OnToggle, OnDelete }: RuleItemProps) {
  const HandleToggle = (checked: boolean) => {
    OnToggle(rule.id, checked);
  };

  const HandleDelete = () => {
    OnDelete(rule.id);
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2.5">
      <Switch
        checked={rule.is_enabled}
        onCheckedChange={HandleToggle}
        className="shrink-0"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <code
          className={`truncate font-mono text-xs ${rule.is_enabled ? 'text-foreground' : 'text-muted-foreground line-through'}`}
          title={rule.selector}
        >
          {rule.selector}
        </code>
        <span className="text-muted-foreground text-[10px]">
          {FormatDate(rule.created_at)}
        </span>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="text-muted-foreground hover:text-destructive shrink-0 rounded p-0.5">
            <X className="h-3.5 w-3.5" />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete rule?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the CSS rule{' '}
              <code className="text-foreground text-xs">{rule.selector}</code>{' '}
              and the element will reappear on next page load.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={HandleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function FormatDate(date_string: string): string {
  const date = new Date(date_string);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

void Trash2;
