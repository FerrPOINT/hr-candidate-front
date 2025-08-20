import { motion } from 'framer-motion';

interface MessageBubbleProps {
  content: string;
  isUser?: boolean;
  isNew?: boolean;
}

export function MessageBubble({ content, isUser = false, isNew = false }: MessageBubbleProps) {
  if (isNew) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`${
          isUser ? 'bg-[#ffdac2] rounded-bl-[24px]' : 'bg-white rounded-br-[24px]'
        } rounded-tl-[24px] rounded-tr-[24px] border border-[#e2e4e9] px-8 py-6 max-w-[421px]`}
      >
        <p className="text-[#0a0d14] text-[16px] leading-[24px] tracking-[-0.176px] font-medium font-['Inter:Medium',_sans-serif]">
          {content}
        </p>
      </motion.div>
    );
  }

  return (
    <div className={`${
      isUser ? 'bg-[#ffdac2] rounded-bl-[24px]' : 'bg-white rounded-br-[24px]'
    } rounded-tl-[24px] rounded-tr-[24px] border border-[#e2e4e9] px-8 py-6 max-w-[421px]`}>
      <p className="text-[#0a0d14] text-[16px] leading-[24px] tracking-[-0.176px] font-medium font-['Inter:Medium',_sans-serif]">
        {content}
      </p>
    </div>
  );
}
