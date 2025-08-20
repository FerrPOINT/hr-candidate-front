import { motion } from 'framer-motion';

interface LiveTranscriptionProps {
  text: string;
  isActive: boolean;
}

export function LiveTranscription({ text, isActive }: LiveTranscriptionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-[20px] p-4 shadow-lg border border-gray-100"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <div className={`w-4 h-4 rounded-full ${isActive ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
        </div>
        
        <div className="flex-1">
          {text ? (
            <p className="text-gray-900 leading-relaxed">
              {text}
              {isActive && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="inline-block w-0.5 h-4 bg-gray-400 ml-1"
                />
              )}
            </p>
          ) : (
            <p className="text-gray-400 italic">
              {isActive ? "Говорите..." : "Нажмите для записи"}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
