import { Logo, HelpButton } from '../';

interface HeaderProps {
  onHelpClick: () => void;
}

export function Header({ onHelpClick }: HeaderProps) {
  return (
    <div className="flex items-center justify-between w-full h-16 px-6">
      <Logo size="medium" />
      <HelpButton onClick={onHelpClick} />
    </div>
  );
}
