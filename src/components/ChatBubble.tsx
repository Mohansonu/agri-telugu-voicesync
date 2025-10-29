import { User, Bot } from "lucide-react";

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  image?: string;
}

const ChatBubble = ({ message, isUser, image }: ChatBubbleProps) => {
  return (
    <div className={`flex gap-3 mb-4 animate-slide-up ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
          <Bot className="w-6 h-6 text-accent-foreground" />
        </div>
      )}
      
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[75%]`}>
        <div className={isUser ? 'chat-bubble-user' : 'chat-bubble-assistant'}>
          <p className="text-base leading-relaxed whitespace-pre-wrap">{message}</p>
          {image && (
            <img 
              src={image} 
              alt="Reference" 
              className="mt-3 rounded-lg max-w-[200px] border border-border"
            />
          )}
        </div>
      </div>
      
      {isUser && (
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 text-primary-foreground" />
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
