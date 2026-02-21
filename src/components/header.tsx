import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Crosshair, MousePointer2 } from 'lucide-react';

interface HeaderProps {
  is_picker_active: boolean;
  OnActivatePicker: () => void;
  OnDeactivatePicker: () => void;
}

export function Header({
  is_picker_active,
  OnActivatePicker,
  OnDeactivatePicker
}: HeaderProps) {
  const HandlePickerToggle = () => {
    if (is_picker_active) {
      OnDeactivatePicker();
    } else {
      OnActivatePicker();
    }
  };

  return (
    <header className="flex items-center justify-between border-b pb-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
          <MousePointer2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold">Block Element</h1>
        </div>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={HandlePickerToggle}
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium ${
                is_picker_active
                  ? 'border-green-600 bg-green-600/10 text-green-600 dark:border-green-500 dark:bg-green-500/10 dark:text-green-400'
                  : 'border-border bg-background hover:bg-accent text-foreground'
              }`}
            >
              <Crosshair className="h-3.5 w-3.5" />
              {is_picker_active ? 'Picking...' : 'Pick'}
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {is_picker_active
              ? 'Click to deactivate picker'
              : 'Click then hover & click elements on page to block them'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </header>
  );
}
