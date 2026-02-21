import {
  Indicator as CheckboxIndicatorPrimitive,
  Root as CheckboxRootPrimitive
} from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

import { Cn } from '@/utils';

function Checkbox({
  className,
  ...props
}: ComponentProps<typeof CheckboxRootPrimitive>) {
  return (
    <CheckboxRootPrimitive
      data-slot="checkbox"
      className={Cn(
        'peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      <CheckboxIndicatorPrimitive
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxIndicatorPrimitive>
    </CheckboxRootPrimitive>
  );
}

export { Checkbox };
