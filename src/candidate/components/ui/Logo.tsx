import React from "react";

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  'data-testid'?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'large', className = "", ...props }) => {
  const sizeClasses = {
    small: 'h-12',
    medium: 'h-16', 
    large: 'h-20',
  };

  return (
    <div className={`${sizeClasses[size]} w-auto object-contain ${className}`} {...props}>
      <img 
        src={`${process.env.PUBLIC_URL}/images/logo.webp`}
        alt="Company Logo" 
        className="w-full h-full object-contain"
      />
    </div>
  );
};

// Также экспортируем как default для совместимости
export default Logo; 