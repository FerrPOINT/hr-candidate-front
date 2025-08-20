import React from 'react';
// import svgPaths from "../../imports/svg-qp29upppxq";
// import { cn } from './utils';

// Простые заглушки
const cn = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ');
const svgPaths = {
  p20c0f400: '',
  p5fe3080: '',
  pf5f7400: '',
  p120a9500: '',
  p15b5ac80: '',
  p3ba5fe00: '',
  p12d47180: '',
  p18122e80: '',
  p301d0e00: '',
  p37016f00: '',
  p3b6a45a0: '',
};

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

/**
 * Latest Figma Icons using the newest SVG paths
 */

export function SuitcaseLineIconV3({ className, size = 20 }: IconProps) {
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="suitcase-line">
          <path
            d={svgPaths.p20c0f400}
            fill="#525866"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

export function PieChartLineIconV3({ className, size = 20 }: IconProps) {
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="pie-chart-line">
          <path
            d={svgPaths.p5fe3080}
            fill="#525866"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

export function TeamLineIconV3({ className, size = 20 }: IconProps) {
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="team-line">
          <path
            d={svgPaths.pf5f7400}
            fill="#525866"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

export function Notification4LineIconV3({ className, size = 24 }: IconProps) {
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="notification-4-line">
          <path
            d={svgPaths.p120a9500}
            fill="#0A0D14"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

export function StarSmileLineIconV3({ className, size = 20 }: IconProps) {
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="star-smile-line">
          <path
            d={svgPaths.p15b5ac80}
            fill="#525866"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

export function GroupLineIconV3({ className, size = 20 }: IconProps) {
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="group-line">
          <path
            d={svgPaths.p3ba5fe00}
            fill="#525866"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

export function UserLineIconV3({ className, size = 20 }: IconProps) {
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="user-line">
          <path
            d={svgPaths.p12d47180}
            fill="#525866"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

export function InformationLineIconV3({ className, size = 20 }: IconProps) {
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="information-line">
          <path
            d={svgPaths.p18122e80}
            fill="#525866"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

export function AddLineIconV3({ className, size = 20 }: IconProps) {
  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

export function SquarePenIconV3({ className, size = 20 }: IconProps) {
  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

export function TrashIconV3({ className, size = 20 }: IconProps) {
  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <path d="M4 7H20M10 11V17M14 11V17M5 7L6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19L19 7M8 7V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}