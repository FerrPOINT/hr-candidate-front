import React from 'react';
import svgPaths from "../../imports/svg-xk1f7k590o";

export function SynergyLogoFigma() {
  return (
    <div className="relative shrink-0 size-[52px]" data-name="Synergy">
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