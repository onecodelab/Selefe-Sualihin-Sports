import React from 'react';
import { cn } from '@/lib/utils';

export function MenuToggleIcon({ open, onClick, className, duration = 300 }: { open: boolean, onClick?: () => void, className?: string, duration?: number }) {
  return (
    <button onClick={onClick} className="focus:outline-none p-1">
      <svg
        width="24"
        height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("transition-all", className)}
      style={{ transitionDuration: `${duration}ms` }}
    >
      <line
        x1="3"
        y1="12"
        x2="21"
        y2="12"
        className={cn("transition-all origin-center", open ? "opacity-0 scale-0" : "opacity-100 scale-100")}
      />
      <line
        x1="3"
        y1="6"
        x2="21"
        y2="6"
        className={cn("transition-all origin-center", open ? "rotate-45 translate-y-[6px]" : "rotate-0 translate-y-0")}
      />
      <line
        x1="3"
        y1="18"
        x2="21"
        y2="18"
        className={cn("transition-all origin-center", open ? "-rotate-45 -translate-y-[6px]" : "rotate-0 translate-y-0")}
      />
    </svg>
    </button>
  );
}
