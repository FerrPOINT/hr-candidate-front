import { useEffect, useState } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

export function TypewriterText({ 
  text, 
  speed = 15, 
  onComplete,
  className = ""
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length && !isComplete) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (currentIndex >= text.length && !isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [currentIndex, text, speed, onComplete, isComplete]);

  // Reset when text changes
  useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  return (
    <div className={className}>
      {displayText}
      {!isComplete && (
        <span className="animate-pulse">|</span>
      )}
    </div>
  );
}
