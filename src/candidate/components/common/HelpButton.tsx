import { HelpCircle } from 'lucide-react';

interface HelpButtonProps {
  onClick: () => void;
  className?: string;
}

export function HelpButton({ onClick, className = '' }: HelpButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${className}`}
              style={{ color: '#3b82f6' }}
    >
      <HelpCircle className="w-6 h-6" />
    </button>
  );
} 