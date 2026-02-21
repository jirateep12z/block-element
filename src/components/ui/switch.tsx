'use client';

import {
  Root as SwitchRootPrimitive,
  Thumb as SwitchThumbPrimitive
} from '@radix-ui/react-switch';
import type { ComponentProps } from 'react';

import { Cn } from '@/utils';

function Switch({
  className,
  ...props
}: ComponentProps<typeof SwitchRootPrimitive>) {
  return (
    <SwitchRootPrimitive
      data-slot="switch"
      className={Cn(
        'peer data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent transition-[opacity] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-green-600',
        className
      )}
      {...props}
    >
      <SwitchThumbPrimitive
        data-slot="switch-thumb"
        className={Cn(
          'pointer-events-none block size-4 rounded-full bg-white ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0 dark:bg-neutral-200'
        )}
      />
    </SwitchRootPrimitive>
  );
}

export { Switch };
