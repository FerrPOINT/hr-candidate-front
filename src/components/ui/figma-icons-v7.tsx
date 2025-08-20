import React from 'react';
import svgPaths from "../imports/svg-fbh3n802r9";
import { cn } from './utils';

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

export function SynergyIconV7({ className, size = 52 }: IconProps) {
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 52 52"
      >
        <g filter="url(#filter0_i_1_29717)" id=" Synergy">
          <rect fill="#E1634A" height="52" rx="26" width="52" />
          <rect
            fill="white"
            fillOpacity="0.1"
            height="52"
            rx="26"
            width="52"
          />
          <path
            d={svgPaths.p3f40a580}
            fill="url(#paint0_linear_1_29717)"
            fillOpacity="0.88"
            id="Vector"
            stroke="url(#paint1_linear_1_29717)"
          />
        </g>
        <defs>
          <filter
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
            height="56"
            id="filter0_i_1_29717"
            width="52"
            x="0"
            y="-4"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              in="SourceGraphic"
              in2="BackgroundImageFix"
              mode="normal"
              result="shape"
            />
            <feColorMatrix
              in="SourceAlpha"
              result="hardAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset dy="-4" />
            <feGaussianBlur stdDeviation="4" />
            <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.64 0"
            />
            <feBlend
              in2="shape"
              mode="normal"
              result="effect1_innerShadow_1_29717"
            />
          </filter>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="paint0_linear_1_29717"
            x1="26"
            x2="26"
            y1="5.77806"
            y2="67.1062"
          >
            <stop offset="0.313079" stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="paint1_linear_1_29717"
            x1="97.3882"
            x2="-21.6094"
            y1="-92.3854"
            y2="4.15067"
          >
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export function SuitcaseLineIconV7({ className, size = 20, color = "#525866" }: IconProps) {
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

export function PieChartLineIconV7({ className, size = 20, color = "#525866" }: IconProps) {
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

export function TeamLineIconV7({ className, size = 20, color = "#525866" }: IconProps) {
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

export function Notification4LineIconV7({ className, size = 24 }: IconProps) {
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

export function AddFillIconV7({ className, size = 20 }: IconProps) {
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

export function ArrowDownSLineIconV7({ className, size = 20 }: IconProps) {
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

export function Search2LineIconV7({ className, size = 20 }: IconProps) {
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

export function FilePdf2LineIconV7({ className, size = 20, color }: IconProps) {
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
            fill={color || "currentColor"}
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

export function LinkIconV7({ className, size = 20 }: IconProps) {
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

export function FluentPeople20RegularV7({ className, size = 24 }: IconProps) {
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

export function ChartLegendDotsIcon({ className, size = 20 }: IconProps) {
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g clipPath="url(#clip0_2_54980)" id="Chart Legend Dots [1.0]">
          <g filter="url(#filter0_d_2_54980)" id="Ellipse">
            <circle cx="10" cy="10" fill="#38C793" r="6" />
          </g>
        </g>
        <defs>
          <filter
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
            height="20"
            id="filter0_d_2_54980"
            width="20"
            x="0"
            y="2"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              result="hardAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset dy="2" />
            <feGaussianBlur stdDeviation="2" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.105882 0 0 0 0 0.109804 0 0 0 0 0.113725 0 0 0 0.04 0"
            />
            <feBlend
              in2="BackgroundImageFix"
              mode="normal"
              result="effect1_dropShadow_2_54980"
            />
            <feBlend
              in="SourceGraphic"
              in2="effect1_dropShadow_2_54980"
              mode="normal"
              result="shape"
            />
          </filter>
          <clipPath id="clip0_2_54980">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

export function AccountCircleLineIcon({ className, size = 20 }: IconProps) {
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="account-circle-line">
          <path
            d={svgPaths.p37b3e300}
            fill="#868C98"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

export function Filter3LineIcon({ className, size = 20 }: IconProps) {
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="filter-3-line">
          <path
            d={svgPaths.p3f0b980}
            fill="#525866"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

export function SortDescIcon({ className, size = 20 }: IconProps) {
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="sort-desc">
          <path
            d={svgPaths.p2c79f680}
            fill="#868C98"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

export function ExpandUpDownFillIcon({ className, size = 20 }: IconProps) {
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="expand-up-down-fill">
          <path
            d={svgPaths.p192db800}
            fill="#868C98"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
} 