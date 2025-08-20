interface ChatMessageProps {
  message: {
    id: number;
    text: string;
    sender: 'ai' | 'user';
  };
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAI = message.sender === 'ai';

  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-6`}>
      <div
        className={`max-w-lg rounded-[20px] px-6 py-4 relative ${
          isAI
            ? 'bg-secondary text-secondary-foreground'
            : 'bg-[#e16349] text-white'
        }`}
      >
        <p className="m-0 leading-relaxed">{message.text}</p>
        
        {/* Chat bubble tail */}
        <div
          className={`absolute w-3 h-3 -bottom-1 ${
            isAI 
              ? 'left-4 bg-secondary'
              : 'right-4 bg-[#e16349]'
          }`}
          style={{
            clipPath: isAI 
              ? 'polygon(0 0, 100% 100%, 0 100%)'
              : 'polygon(100% 0, 0 100%, 100% 100%)'
          }}
        />
      </div>
    </div>
  );
}
