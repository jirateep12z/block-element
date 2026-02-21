import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';

import { Cn } from '@/utils';

interface SelectContextValue {
  value: string;
  open: boolean;
  set_open: (open: boolean) => void;
  OnValueChange: (value: string) => void;
  label_map: Record<string, ReactNode>;
  RegisterLabel: (value: string, label: ReactNode) => void;
}

const SelectContext = createContext<SelectContextValue | null>(null);

interface SelectProps {
  value?: string;
  defaultValue?: string;
  OnValueChange?: (value: string) => void;
  children: ReactNode;
}

function Select({ value, defaultValue, OnValueChange, children }: SelectProps) {
  const [internal_value, set_internal_value] = useState(defaultValue || '');
  const [open, set_open] = useState(false);
  const [label_map, set_label_map] = useState<Record<string, ReactNode>>({});

  const current_value = value !== undefined ? value : internal_value;

  const HandleValueChange = useCallback(
    (new_value: string) => {
      if (value === undefined) {
        set_internal_value(new_value);
      }
      OnValueChange?.(new_value);
      set_open(false);
    },
    [value, OnValueChange]
  );

  const RegisterLabel = useCallback((item_value: string, label: ReactNode) => {
    set_label_map(prev => {
      if (prev[item_value] === label) return prev;
      return { ...prev, [item_value]: label };
    });
  }, []);

  return (
    <SelectContext.Provider
      value={{
        value: current_value,
        open,
        set_open,
        OnValueChange: HandleValueChange,
        label_map,
        RegisterLabel
      }}
    >
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
}

function SelectGroup({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

function SelectValue({ placeholder }: { placeholder?: string }) {
  const context = useContext(SelectContext);
  const label = context?.label_map[context.value];

  return <span className="text-foreground">{label || placeholder}</span>;
}

interface SelectTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'default';
}

const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, size = 'default', children, ...props }, ref) => {
    const context = useContext(SelectContext);

    return (
      <button
        ref={ref}
        type="button"
        data-slot="select-trigger"
        data-size={size}
        className={Cn(
          'border-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 dark:hover:bg-input/50 flex w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
          size === 'default' ? 'h-9' : 'h-8',
          className
        )}
        onClick={() => context?.set_open(!context.open)}
        {...props}
      >
        {children}
        <ChevronDownIcon
          className={Cn(
            'size-4 opacity-50 transition-transform',
            context?.open && 'rotate-180'
          )}
        />
      </button>
    );
  }
);
SelectTrigger.displayName = 'SelectTrigger';

interface SelectContentProps {
  children: ReactNode;
  className?: string;
}

function SelectContent({ children, className }: SelectContentProps) {
  const context = useContext(SelectContext);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const HandleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        const trigger = ref.current.previousElementSibling;
        if (!trigger?.contains(event.target as Node)) {
          context?.set_open(false);
        }
      }
    };
    if (context?.open) {
      setTimeout(() => {
        document.addEventListener('click', HandleClickOutside);
      }, 0);
    }
    return () => {
      document.removeEventListener('click', HandleClickOutside);
    };
  }, [context?.open, context]);

  return (
    <>
      <div className="hidden">{children}</div>
      {context?.open && (
        <div
          ref={ref}
          data-slot="select-content"
          className={Cn(
            'bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 absolute top-full left-0 z-50 mt-1 max-h-60 w-full min-w-[8rem] overflow-y-auto rounded-md border p-1',
            className
          )}
        >
          {children}
        </div>
      )}
    </>
  );
}

function SelectLabel({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="select-label"
      className={Cn('text-muted-foreground px-2 py-1.5 text-xs', className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface SelectItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

function SelectItem({ className, children, value, ...props }: SelectItemProps) {
  const context = useContext(SelectContext);
  const is_selected = context?.value === value;

  useEffect(() => {
    context?.RegisterLabel(value, children);
  }, [value, children, context]);

  return (
    <div
      data-slot="select-item"
      data-selected={is_selected}
      className={Cn(
        'hover:bg-accent hover:text-accent-foreground relative flex w-full cursor-pointer items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm select-none',
        is_selected && 'bg-accent text-accent-foreground',
        className
      )}
      onClick={() => context?.OnValueChange(value)}
      {...props}
    >
      {children}
      {is_selected && (
        <span className="absolute right-2 flex size-3.5 items-center justify-center">
          <CheckIcon className="size-4" />
        </span>
      )}
    </div>
  );
}

function SelectSeparator({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="select-separator"
      className={Cn('bg-border pointer-events-none -mx-1 my-1 h-px', className)}
      {...props}
    />
  );
}

function SelectScrollUpButton() {
  return null;
}

function SelectScrollDownButton() {
  return null;
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue
};
