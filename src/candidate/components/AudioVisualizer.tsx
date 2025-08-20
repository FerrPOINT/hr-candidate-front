import { useEffect, useState } from 'react';

interface AudioVisualizerProps {
  isActive?: boolean;
  color?: string;
}

export function AudioVisualizer({ isActive = false, color }: AudioVisualizerProps) {
  const [bars, setBars] = useState<number[]>(Array(20).fill(8));
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setBars(Array(20).fill(8));
      setAnimationPhase(0);
      return;
    }

    let phase = 0;
    const interval = setInterval(() => {
      phase += 0.3;
      setAnimationPhase(phase);
      
      setBars(prev => prev.map((_, index) => {
        // Create wave-like pattern
        const wave = Math.sin(phase + index * 0.5) * 30;
        const randomVariation = Math.random() * 40;
        const baseHeight = 8 + Math.abs(wave) + randomVariation;
        
        // Occasionally create peaks for realistic speech pattern
        const isPeak = Math.random() < 0.15;
        return isPeak ? Math.min(95, baseHeight + 30) : Math.min(80, baseHeight);
      }));
    }, 120);

    return () => clearInterval(interval);
  }, [isActive]);

  const defaultColor = color || '#e16349';
  const inactiveColor = color ? `${color}40` : '#e5e7eb';

  return (
    <div className="flex items-end justify-center gap-[2px] h-full w-full">
      {bars.map((height, index) => (
        <div
          key={index}
          className="rounded-full transition-all duration-100 ease-out"
          style={{ 
            height: `${height}%`,
            width: '3px',
            minHeight: '4px',
            backgroundColor: isActive ? defaultColor : inactiveColor,
            opacity: isActive ? 0.8 + (height / 100) * 0.2 : 0.3,
            transform: isActive ? `scaleY(${0.8 + (height / 100) * 0.4})` : 'scaleY(1)'
          }}
        />
      ))}
    </div>
  );
}
