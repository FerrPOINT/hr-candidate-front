import { HelpCircle } from 'lucide-react';

interface HelpButtonProps {
  onClick: () => void;
  className?: string;
}

export function HelpButton({ onClick, className = '' }: HelpButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-2 py-1 hover:bg-white/20 rounded-xl transition-all text-[#e16349] hover:text-[#d55a42] ${className}`}
    >
      <HelpCircle className="w-8 h-8" />
      <span className="text-lg font-medium">
        Помощь
      </span>
    </button>
  );
} 