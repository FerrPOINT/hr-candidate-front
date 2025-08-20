import { ImageWithFallback } from '../figma/ImageWithFallback';
import SynergyLogo from '../ui/SynergyLogo';

interface WMTLogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function WMTLogo({ size = 'large', className = '' }: WMTLogoProps) {
  const sizeClasses = {
    small: 'h-6',
    medium: 'h-8',
    large: 'h-10',
  };

  return (
    <div className={`${sizeClasses[size]} w-auto object-contain ${className}`}>
      <SynergyLogo />
    </div>
  );
} 