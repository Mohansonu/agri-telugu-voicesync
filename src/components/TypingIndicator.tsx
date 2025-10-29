import { Bot } from "lucide-react";

const TypingIndicator = () => {
  return (
    <div className="flex gap-3 mb-4 animate-fade-in">
      <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
        <Bot className="w-6 h-6 text-accent-foreground" />
      </div>
      <div className="chat-bubble-assistant flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-muted-foreground typing-dot"></div>
        <div className="w-2 h-2 rounded-full bg-muted-foreground typing-dot"></div>
        <div className="w-2 h-2 rounded-full bg-muted-foreground typing-dot"></div>
      </div>
    </div>
  );
};

export default TypingIndicator;
