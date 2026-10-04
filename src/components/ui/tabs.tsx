import * as React from 'react';
import { cn } from '../../lib/utils.ts';

interface TabsContextValue {
  value: string;
  onValueChange: (val: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

export function Tabs({
  value,
  onValueChange,
  defaultValue,
  className,
  children,
}: {
  value?: string;
  onValueChange?: (val: string) => void;
  defaultValue?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [internalVal, setInternalVal] = React.useState(defaultValue || '');
  const activeVal = value !== undefined ? value : internalVal;
  const changeHandler = onValueChange || setInternalVal;

  return (
    <TabsContext.Provider value={{ value: activeVal, onValueChange: changeHandler }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-start rounded-md bg-zinc-950 p-1 text-zinc-400 border border-zinc-800',
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  className,
  children,
  icon,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error('TabsTrigger must be used inside Tabs');

  const isActive = ctx.value === value;

  return (
    <button
      type="button"
      onClick={() => ctx.onValueChange(value)}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded px-3 py-1.5 text-xs sm:text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/60 select-none cursor-pointer tracking-tight',
        isActive
          ? 'bg-zinc-850 text-white border border-zinc-700 shadow-sm font-medium'
          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900',
        className
      )}
    >
      {icon && <span className="w-3.5 h-3.5 text-zinc-400">{icon}</span>}
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error('TabsContent must be used inside Tabs');

  if (ctx.value !== value) return null;

  return (
    <div
      className={cn(
        'mt-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50',
        className
      )}
    >
      {children}
    </div>
  );
}
