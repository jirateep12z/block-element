import {
  Arrow as TooltipArrowPrimitive,
  Content as TooltipContentPrimitive,
  Portal as TooltipPortalPrimitive,
  Provider as TooltipProviderPrimitive,
  Root as TooltipRootPrimitive,
  Trigger as TooltipTriggerPrimitive
} from '@radix-ui/react-tooltip';
import type { ComponentProps } from 'react';

import { Cn } from '@/utils';

function TooltipProvider({
  delayDuration = 0,
  ...props
}: ComponentProps<typeof TooltipProviderPrimitive>) {
  return (
    <TooltipProviderPrimitive
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({ ...props }: ComponentProps<typeof TooltipRootPrimitive>) {
  return (
    <TooltipProvider>
      <TooltipRootPrimitive data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({
  ...props
}: ComponentProps<typeof TooltipTriggerPrimitive>) {
  return <TooltipTriggerPrimitive data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: ComponentProps<typeof TooltipContentPrimitive>) {
  return (
    <TooltipPortalPrimitive>
      <TooltipContentPrimitive
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={Cn(
          'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md bg-neutral-50 px-3 py-1.5 text-xs text-balance text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50',
          className
        )}
        {...props}
      >
        {children}
        <TooltipArrowPrimitive className="fill-neutral-50 dark:fill-neutral-800" />
      </TooltipContentPrimitive>
    </TooltipPortalPrimitive>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
