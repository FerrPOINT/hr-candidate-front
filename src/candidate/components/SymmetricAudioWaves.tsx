import { useEffect, useState, useRef } from 'react';

interface SymmetricAudioWavesProps {
  isSpeaking?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function SymmetricAudioWaves({ 
  isSpeaking = false, 
  size = 'large',
  className = ""
}: SymmetricAudioWavesProps) {
  const [waveHeights, setWaveHeights] = useState<number[]>([]);
  const previousHeightsRef = useRef<number[]>([]);
  const targetHeightsRef = useRef<number[]>([]);

  // Generate symmetric wave heights with smooth interpolation
  useEffect(() => {
    if (!isSpeaking) {
      setWaveHeights([]);
      previousHeightsRef.current = [];
      targetHeightsRef.current = [];
      return;
    }

    // Initialize with base heights if empty
    if (previousHeightsRef.current.length === 0) {
      const initialHeights = Array.from({ length: 6 }, () => 40 + Math.random() * 30);
      const symmetricHeights = [...initialHeights.slice().reverse(), ...initialHeights];
      previousHeightsRef.current = symmetricHeights;
      targetHeightsRef.current = symmetricHeights;
      setWaveHeights(symmetricHeights);
    }

    const generateNewTargets = () => {
      // Create new target heights with smaller random variations
      const baseHeights = Array.from({ length: 6 }, () => {
        const baseHeight = 40 + Math.random() * 35; // 40-75 range for more controlled variation
        return baseHeight;
      });
      
      // Create symmetric pattern: left side mirrors right side  
      const leftWaves = baseHeights.slice().reverse();
      const rightWaves = baseHeights.slice();
      
      targetHeightsRef.current = [...leftWaves, ...rightWaves];
    };

    const smoothAnimation = () => {
      const current = previousHeightsRef.current;
      const target = targetHeightsRef.current;
      
      if (current.length === 0 || target.length === 0) return;

      // Interpolate between current and target (smoother transitions)
      const interpolationFactor = 0.25; // Faster, but still smooth transitions
      const newHeights = current.map((currentHeight, index) => {
        const targetHeight = target[index];
        return currentHeight + (targetHeight - currentHeight) * interpolationFactor;
      });

      previousHeightsRef.current = newHeights;
      setWaveHeights(newHeights);
    };

    // Generate new targets every 300ms (faster changes)
    const targetInterval = setInterval(generateNewTargets, 300);
    
    // Animate smoothly every 50ms (smooth interpolation)
    const animationInterval = setInterval(smoothAnimation, 50);

    // Initial target generation
    generateNewTargets();

    return () => {
      clearInterval(targetInterval);
      clearInterval(animationInterval);
    };
  }, [isSpeaking]);

  const sizeConfig = {
    small: {
      container: "h-16",
      waveWidth: "w-1",
      maxHeight: 60
    },
    medium: {
      container: "h-20", 
      waveWidth: "w-1.5",
      maxHeight: 80
    },
    large: {
      container: "h-24",
      waveWidth: "w-2",
      maxHeight: 96
    }
  };

  const config = sizeConfig[size];

  if (!isSpeaking) {
    return (
      <div className={`flex items-end justify-center ${config.container} ${className}`}>
        <div className="flex items-end gap-1 relative" style={{ height: '100%', alignItems: 'flex-end' }}>
          {Array.from({ length: 12 }, (_, index) => {
            // Create gentle height variation for static state
            const heightVariation = 8 + (index % 3) * 2; // 8px, 10px, 12px pattern
            return (
              <div
                key={index}
                className={`${config.waveWidth} rounded-full transition-all duration-500`}
                style={{ 
                  height: `${heightVariation}px`,
                  background: 'linear-gradient(to top, rgb(225 99 73 / 0.4), rgb(225 99 73 / 0.3))',
                  alignSelf: 'flex-end', // Зафиксировать снизу
                  transformOrigin: 'bottom', // Анимация от низа
                  position: 'relative',
                  bottom: '0'
                }}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-end justify-center ${config.container} ${className}`}>
      <div className="flex items-end gap-1" style={{ height: '100%' }}>
        {waveHeights.length > 0 ? (
          waveHeights.map((height, index) => {
            const centerDistance = Math.abs(index - waveHeights.length / 2);
            const opacity = Math.max(0.6, 1 - centerDistance * 0.08);
            
            return (
              <div
                key={index}
                className={`${config.waveWidth} rounded-full transition-all duration-200 ease-out shadow-lg`}
                style={{
                  height: `${Math.max(height, 12)}px`,
                  background: `linear-gradient(to top, rgb(225 99 73 / ${opacity}), rgb(225 99 73 / ${Math.min(opacity + 0.2, 1)}))`,
                  alignSelf: 'flex-end', // Зафиксировать снизу
                  transformOrigin: 'bottom', // Анимация от низа
                  position: 'relative',
                  bottom: '0',
                  boxShadow: `0 0 8px rgb(225 99 73 / ${opacity * 0.5})`
                }}
              />
            );
          })
        ) : (
          // Fallback while generating - smooth growing animation
          Array.from({ length: 12 }, (_, index) => {
            const centerIndex = 6;
            const distanceFromCenter = Math.abs(index - centerIndex);
            const baseHeight = 20 + Math.sin(index * 0.8) * 10; // Smooth sine wave pattern
            const opacity = Math.max(0.6, 0.9 - distanceFromCenter * 0.08);
            
            return (
              <div
                key={index}
                className={`${config.waveWidth} rounded-full transition-all duration-400 ease-in-out shadow-lg`}
                style={{
                  height: `${baseHeight}px`,
                  background: `linear-gradient(to top, rgb(225 99 73 / ${opacity}), rgb(225 99 73 / ${Math.min(opacity + 0.2, 1)}))`,
                  alignSelf: 'flex-end', // Зафиксировать снизу
                  transformOrigin: 'bottom', // Анимация от низа
                  position: 'relative',
                  bottom: '0',
                  animationDelay: `${index * 80}ms`,
                  boxShadow: `0 0 6px rgb(225 99 73 / ${opacity * 0.4})`
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
