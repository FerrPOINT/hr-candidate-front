import { motion } from 'framer-motion';
import Synergy from '../imports/Synergy-49-121';

interface AIAvatarWithWavesProps {
  size?: 'small' | 'medium' | 'large';
  isSpeaking?: boolean;
}

export function AIAvatarWithWaves({ size = 'large', isSpeaking = false }: AIAvatarWithWavesProps) {
  const avatarSize = size === 'large' ? 'w-20 h-20' : size === 'medium' ? 'w-18 h-18' : 'w-16 h-16';
  const containerSize = size === 'large' ? 'w-28 h-28' : size === 'medium' ? 'w-26 h-26' : 'w-24 h-24';
  
  return (
    <div className={`relative ${containerSize} flex items-center justify-center`}>
      
      {/* Only 2 main liquid sound waves */}
      {isSpeaking && (
        <>
          {/* Wave 1 - inner liquid blob */}
          <motion.div
            className="absolute"
            style={{ 
              width: size === 'large' ? '90px' : '74px',
              height: size === 'large' ? '90px' : '74px',
              background: `radial-gradient(ellipse 70% 80% at 35% 40%, 
                rgba(225, 99, 73, 0.5) 0%, 
                rgba(225, 99, 73, 0.4) 30%, 
                rgba(225, 99, 73, 0.25) 60%, 
                rgba(225, 99, 73, 0) 100%)`,
              borderRadius: '50% 40% 60% 35%',
            }}
            animate={{
              borderRadius: [
                '50% 40% 60% 35%',
                '35% 60% 40% 50%', 
                '40% 50% 35% 60%',
                '60% 35% 50% 40%',
                '50% 40% 60% 35%'
              ],
              scale: [1, 1.08, 0.96, 1.05, 1],
              rotate: [0, 12, -8, 15, 0],
              x: [0, 1, -1, 1, 0],
              y: [0, -1, 1, -1, 0]
            }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          />
          
          {/* Wave 2 - outer liquid blob */}
          <motion.div
            className="absolute"
            style={{ 
              width: size === 'large' ? '106px' : '90px',
              height: size === 'large' ? '106px' : '90px',
              background: `radial-gradient(ellipse 80% 65% at 60% 35%, 
                rgba(225, 99, 73, 0.4) 0%, 
                rgba(225, 99, 73, 0.3) 35%, 
                rgba(225, 99, 73, 0.18) 65%, 
                rgba(225, 99, 73, 0) 100%)`,
              borderRadius: '40% 60% 35% 50%',
            }}
            animate={{
              borderRadius: [
                '40% 60% 35% 50%',
                '60% 35% 50% 40%',
                '35% 50% 40% 60%', 
                '50% 40% 60% 35%',
                '40% 60% 35% 50%'
              ],
              scale: [1, 0.94, 1.12, 0.98, 1],
              rotate: [0, -15, 8, -12, 0],
              x: [0, -1, 1, -1, 0],
              y: [0, 1, -1, 1, 0]
            }}
            transition={{
              duration: 4.1,
              repeat: Infinity,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.6
            }}
          />
        </>
      )}
      
      {/* Main Avatar with enhanced glow */}
      <motion.div 
        className={`relative ${avatarSize} z-10 flex items-center justify-center`}
        animate={isSpeaking ? { 
          scale: [1, 1.04, 1],
          filter: [
            'drop-shadow(0 0 15px rgba(225, 99, 73, 0.35))',
            'drop-shadow(0 0 25px rgba(225, 99, 73, 0.55))',
            'drop-shadow(0 0 15px rgba(225, 99, 73, 0.35))'
          ]
        } : {}}
        transition={{ 
          duration: 2.8, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-full h-full">
          <Synergy />
        </div>
      </motion.div>
    </div>
  );
}
