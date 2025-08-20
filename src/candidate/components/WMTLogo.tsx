import svgPaths from "../imports/svg-wry4hew4nf";

interface WMTLogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function WMTLogo({ size = 'medium', className = "" }: WMTLogoProps) {
  const sizeClasses = {
    small: "h-8",     
    medium: "h-14",   
    large: "h-18"     
  };

  return (
    <div className={`${sizeClasses[size]} w-auto ${className}`}>
      <div className="relative size-full" data-name="Synergy">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 80 80"
        >
          <g filter="url(#filter0_i_49_128)" id=" Synergy">
            <rect fill="#E1634A" height="80" rx="40" width="80" />
            <rect
              fill="white"
              fillOpacity="0.1"
              height="80"
              rx="40"
              width="80"
            />
            <path
              d={svgPaths.p15a9cf40}
              fill="url(#paint0_linear_49_128)"
              fillOpacity="0.88"
              id="Vector"
              stroke="url(#paint1_linear_49_128)"
            />
          </g>
          <defs>
            <filter
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
              height="84"
              id="filter0_i_49_128"
              width="80"
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
                result="effect1_innerShadow_49_128"
              />
            </filter>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              id="paint0_linear_49_128"
              x1="40"
              x2="40"
              y1="8.88932"
              y2="103.24"
            >
              <stop offset="0.313079" stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              id="paint1_linear_49_128"
              x1="149.828"
              x2="-33.2452"
              y1="-142.131"
              y2="6.38564"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
} 