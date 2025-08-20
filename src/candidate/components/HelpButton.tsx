import { HelpCircle } from 'lucide-react';

export function HelpButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-2 py-1 hover:bg-white/20 rounded-xl transition-all text-[#e16349] hover:text-[#d55a42]"
    >
      <HelpCircle className="w-5 h-5" />
      <span className="text-sm font-medium">
        Помощь
      </span>
    </button>
  );
} 