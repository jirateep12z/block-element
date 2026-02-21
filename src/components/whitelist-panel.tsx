import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import type { WhitelistPanelProps } from '@/types';
import { Globe, Info, Plus, Shield, X } from 'lucide-react';
import { useState } from 'react';

export function WhitelistPanel({
  whitelist_domains,
  OnAddDomain,
  OnRemoveDomain
}: WhitelistPanelProps) {
  const [new_domain, set_new_domain] = useState('');
  const [error, set_error] = useState('');

  const ValidateDomain = (domain: string): boolean => {
    const domain_regex =
      /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    return domain_regex.test(domain);
  };

  const HandleAddDomain = () => {
    const trimmed = new_domain.trim().toLowerCase();
    if (!trimmed) {
      set_error('Please enter a domain');
      return;
    }
    if (!ValidateDomain(trimmed)) {
      set_error('Invalid domain format (e.g., google.com)');
      return;
    }
    if (whitelist_domains.includes(trimmed)) {
      set_error('Domain already in whitelist');
      return;
    }
    OnAddDomain(trimmed);
    set_new_domain('');
    set_error('');
  };

  const HandleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      HandleAddDomain();
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4" />
            Whitelist
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="text-muted-foreground h-4 w-4 cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-[200px]">
                <p className="text-xs">
                  Whitelisted domains will never have elements blocked, even if
                  rules exist.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-4 pt-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              value={new_domain}
              onChange={e => {
                set_new_domain(e.target.value);
                set_error('');
              }}
              onKeyPress={HandleKeyPress}
              placeholder="e.g., google.com"
              className="bg-background focus:ring-ring w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
            />
            {error && <p className="text-destructive mt-1 text-xs">{error}</p>}
          </div>
          <Button size="sm" onClick={HandleAddDomain}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {whitelist_domains.length === 0 ? (
          <div className="text-muted-foreground py-6 text-center">
            <Globe className="mx-auto mb-2 h-8 w-8 opacity-30" />
            <p className="text-xs">No whitelisted domains</p>
          </div>
        ) : (
          <ScrollArea className="max-h-[200px]">
            <div className="space-y-1.5">
              {whitelist_domains.map(domain => (
                <div
                  key={domain}
                  className="bg-secondary flex items-center justify-between rounded-lg px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <Globe className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
                    <span className="text-sm">{domain}</span>
                  </div>
                  <button
                    onClick={() => OnRemoveDomain(domain)}
                    className="text-muted-foreground hover:text-destructive rounded p-0.5"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
