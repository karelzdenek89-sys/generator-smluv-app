'use client';

import type { ReactNode } from 'react';

/** Native disclosure navigation, closed after selecting a destination. */
export default function NavigationMenu({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <details
      className={className}
      onClick={(event) => {
        if (event.target instanceof Element && event.target.closest('a[href]')) {
          event.currentTarget.open = false;
        }
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && event.currentTarget.open) {
          event.currentTarget.open = false;
          event.currentTarget.querySelector('summary')?.focus();
        }
      }}
    >
      {children}
    </details>
  );
}
