import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { StatisticsCardProps } from '@/types';
import { BarChart3, Globe, MousePointer2, TrendingUp } from 'lucide-react';

export function StatisticsCard({
  statistics,
  domain,
  domain_rule_count
}: StatisticsCardProps) {
  const FormatDate = (date_string: string | null): string => {
    if (!date_string) return 'Never';
    const date = new Date(date_string);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <BarChart3 className="h-4 w-4" />
          Statistics
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-4 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-muted-foreground flex items-center gap-1 text-xs">
              <TrendingUp className="h-3 w-3" />
              Total Rules
            </p>
            <p className="text-2xl font-bold">{statistics.total_blocked}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground flex items-center gap-1 text-xs">
              <Globe className="h-3 w-3" />
              Sites
            </p>
            <p className="text-2xl font-bold">
              {statistics.domains_with_rules}
            </p>
          </div>
        </div>
        <Separator />
        <div className="space-y-2">
          <p className="text-muted-foreground flex items-center gap-1 text-xs">
            <MousePointer2 className="h-3 w-3" />
            Current site
          </p>
          <div className="flex items-center justify-between">
            <Badge
              variant="secondary"
              className="max-w-[200px] truncate text-xs"
            >
              {domain || 'No domain'}
            </Badge>
            <span className="text-sm font-semibold">
              {domain_rule_count} {domain_rule_count === 1 ? 'rule' : 'rules'}
            </span>
          </div>
        </div>
        <Separator />
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs">Last rule created</p>
          <p className="text-sm font-medium">
            {FormatDate(statistics.last_rule_created)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
