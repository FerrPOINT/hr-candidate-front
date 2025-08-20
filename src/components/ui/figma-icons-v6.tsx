import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

// Заглушки для иконок - можно заменить на реальные SVG позже
export function AddFillIconV6({ className, size = 20 }: IconProps) {
  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

export function FlashlightLineIconV6({ className, size = 20 }: IconProps) {
  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <path d="M9 2L6 5H3V8L1 10V14L3 16V19H6L9 22H15L18 19H21V16L23 14V10L21 8V5H18L15 2H9Z" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

export function ArrowDownSLineIconV6({ className, size = 20 }: IconProps) {
  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

export function LucideSparklesIconV6({ className, size = 20 }: IconProps) {
  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <path d="M12 3L13.09 8.26L20 9L13.09 9.74L12 15L10.91 9.74L4 9L10.91 8.26L12 3Z" fill="currentColor"/>
      </svg>
    </div>
  );
}

export function DeleteBinLineIconV6({ className, size = 20 }: IconProps) {
  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <path d="M4 7H20M10 11V17M14 11V17M5 7L6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19L19 7M8 7V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

export function LucideRotateCcwIcon({ className, size = 20 }: IconProps) {
  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

export function LucideRotateCwIcon({ className, size = 20 }: IconProps) {
  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 7V12L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}