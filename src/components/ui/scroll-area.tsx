'use client';

import {
  Corner as ScrollAreaCornerPrimitive,
  Root as ScrollAreaRootPrimitive,
  ScrollAreaScrollbar as ScrollAreaScrollbarPrimitive,
  ScrollAreaThumb as ScrollAreaThumbPrimitive,
  Viewport as ScrollAreaViewportPrimitive
} from '@radix-ui/react-scroll-area';
import type { ComponentProps } from 'react';

import { Cn } from '@/utils';

function ScrollArea({
  className,
  children,
  ...props
}: ComponentProps<typeof ScrollAreaRootPrimitive>) {
  return (
    <ScrollAreaRootPrimitive
      data-slot="scroll-area"
      className={Cn('relative', className)}
      {...props}
    >
      <ScrollAreaViewportPrimitive
        data-slot="scroll-area-viewport"
        className="focus-visible:ring-ring/50 size-full rounded-[inherit] outline-none focus-visible:ring-[3px] focus-visible:outline-1"
      >
        {children}
      </ScrollAreaViewportPrimitive>
      <ScrollBar />
      <ScrollAreaCornerPrimitive />
    </ScrollAreaRootPrimitive>
  );
}

function ScrollBar({
  className,
  orientation = 'vertical',
  ...props
}: ComponentProps<typeof ScrollAreaScrollbarPrimitive>) {
  return (
    <ScrollAreaScrollbarPrimitive
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={Cn(
        'flex touch-none p-px select-none',
        orientation === 'vertical' &&
          'h-full w-2.5 border-l border-l-transparent',
        orientation === 'horizontal' &&
          'h-2.5 flex-col border-t border-t-transparent',
        className
      )}
      {...props}
    >
      <ScrollAreaThumbPrimitive
        data-slot="scroll-area-thumb"
        className="bg-border relative flex-1 rounded-full"
      />
    </ScrollAreaScrollbarPrimitive>
  );
}

export { ScrollArea, ScrollBar };
