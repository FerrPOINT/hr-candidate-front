import React from 'react';

interface TeamMemberAvatarProps {
  initials: string;
  className?: string;
}

/**
 * Team Member Avatar Component
 * Точное воспроизведение аватара участника команды из Figma дизайна
 */
export function TeamMemberAvatar({ initials, className }: TeamMemberAvatarProps) {
  return (
    <div
      className={`bg-[#cac2ff] relative rounded-[999px] shrink-0 size-10 ${className}`}
      data-name="Avatar [1.0]"
    >
      <div className="absolute inset-0" data-name="BG">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          role="presentation"
          viewBox="0 0 40 40"
        >
          <g filter="url(#filter0_i_1_34072)" id="BG">
            <circle cx="20" cy="20" fill="#CAC2FF" r="20" />
          </g>
          <defs>
            <filter
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
              height="48"
              id="filter0_i_1_34072"
              width="40"
              x="0"
              y="-8"
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
              <feOffset dy="-8" />
              <feGaussianBlur stdDeviation="8" />
              <feComposite
                in2="hardAlpha"
                k2="-1"
                k3="1"
                operator="arithmetic"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.431292 0 0 0 0 0.248526 0 0 0 0 0.951474 0 0 0 0.24 0"
              />
              <feBlend
                in2="shape"
                mode="normal"
                result="effect1_innerShadow_1_34072"
              />
            </filter>
          </defs>
        </svg>
      </div>
      <div className="absolute bottom-[20%] css-nqobij font-['Inter:Medium',_sans-serif] font-medium leading-[0] left-0 not-italic right-0 text-[#2b1664] text-[16px] text-center top-[20%] tracking-[-0.176px]">
        <p className="adjustLetterSpacing block leading-[24px]">{initials}</p>
      </div>
    </div>
  );
} 