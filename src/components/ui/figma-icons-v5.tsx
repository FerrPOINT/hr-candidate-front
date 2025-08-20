import React from 'react';
// import svgPaths from "../../imports/svg-oub46fne2h";
// import { cn } from './utils';

// Простые заглушки
const cn = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ');
const svgPaths = {
  p20c0f400: '',
  p5fe3080: '',
  pf5f7400: '',
  p120a9500: '',
  p301d0e00: '',
  p2c6f4a00: '',
  p20e8bc80: '',
  p34d12c00: '',
  p31e0cc80: '',
  p18924d00: '',
  pcd46480: '',
  p53b5880: '',
  p39be50: '',
  p33e02180: '',
};

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

/**
 * Latest Figma Icons using the newest SVG paths v5
 */

export function SuitcaseLineIconV5({ className, size = 20, color = "#525866" }: IconProps) {
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
            fill={color}
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

export function PieChartLineIconV5({ className, size = 20, color = "#525866" }: IconProps) {
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
            fill={color}
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

export function TeamLineIconV5({ className, size = 20, color = "#525866" }: IconProps) {
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
            fill={color}
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

export function Notification4LineIconV5({ className, size = 24 }: IconProps) {
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

export function AddFillIcon({ className, size = 20 }: IconProps) {
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="add-fill">
          <path
            d={svgPaths.p301d0e00}
            fill="white"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

export function ArrowDownSLineIcon({ className, size = 20 }: IconProps) {
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="arrow-down-s-line">
          <path
            d={svgPaths.p2c6f4a00}
            fill="#868C98"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

export function ArrowUpSLineIcon({ className, size = 20 }: IconProps) {
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="arrow-up-s-line">
          <path
            d={svgPaths.p20e8bc80}
            fill="#E16349"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

export function Search2LineIcon({ className, size = 20 }: IconProps) {
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="search-2-line">
          <path
            d={svgPaths.p34d12c00}
            fill="#525866"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

export function FilePdf2LineIcon({ className, size = 20 }: IconProps) {
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="file-pdf-2-line">
          <path
            d={svgPaths.p31e0cc80}
            fill="#E16349"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

export function LinkIcon({ className, size = 20 }: IconProps) {
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="link">
          <path
            d={svgPaths.p18924d00}
            fill="#E16349"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

export function FlashlightLineIcon({ className, size = 20 }: IconProps) {
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="flashlight-line">
          <path
            d={svgPaths.pcd46480}
            fill="#E16349"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

export function FluentPeople20RegularIcon({ className, size = 24 }: IconProps) {
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="fluent:people-20-regular">
          <path
            d={svgPaths.p53b5880}
            fill="#868C98"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

export function LucideCheckIcon({ className, size = 16 }: IconProps) {
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 16 16"
      >
        <g id="lucide/check">
          <path
            d={svgPaths.p39be50}
            id="Vector"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
}

export function LucideXIcon({ className, size = 16 }: IconProps) {
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 16 16"
      >
        <g id="lucide/x">
          <path
            d="M12 4L4 12M4 4L12 12"
            id="Vector"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
}

export function LucideMessageCircleIcon({ className, size = 14 }: IconProps) {
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 14 14"
      >
        <g id="lucide/message-circle">
          <path
            d={svgPaths.p33e02180}
            id="Vector"
            stroke="black"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
}