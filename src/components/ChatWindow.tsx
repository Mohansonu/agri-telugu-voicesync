import { useState, useRef, useEffect } from "react";
import { Send, Mic, Volume2, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ChatBubble from "./ChatBubble";
import TypingIndicator from "./TypingIndicator";

import ControlsBar from "./ControlsBar";
import { startVoiceRecording, speakText, isSpeechRecognitionSupported } from "@/utils/speech";

interface Message {
  text: string;
  isUser: boolean;
  image?: string;
}

const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "నమస్కారం! నేను AgriAssist. వ్యవసాయ సలహాల కోసం నన్ను అడగండి. 🌾\n\nHello! I'm AgriAssist. Ask me for agricultural advice in Telugu or English.",
      isUser: false,
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { text: text.trim(), isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.isUser ? "user" : "assistant",
        content: m.text
      }));

      const { data, error } = await supabase.functions.invoke('chat', {
        body: { message: text, history }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        text: data.message,
        isUser: false,
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Auto-speak response
      if (isSpeechRecognitionSupported()) {
        setIsSpeaking(true);
        await speakText(data.message).catch(err => {
          console.error("TTS error:", err);
        });
        setIsSpeaking(false);
      }

    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    recognitionRef.current = startVoiceRecording(
      (transcript) => {
        setInput(transcript);
        setIsRecording(false);
        toast({
          title: "Voice recognized",
          description: transcript,
        });
      },
      (error) => {
        setIsRecording(false);
        toast({
          title: "Voice error",
          description: error,
          variant: "destructive",
        });
      }
    );
  };

  const handleFormatChange = (format: string) => {
    toast({
      title: "Format applied",
      description: `Text formatted as: ${format}`,
    });
  };


  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gradient-sunrise mb-2">
            🌾 AgriAssist
          </h1>
          <p className="text-primary-foreground/90">
            వ్యవసాయ సలహా సహాయకుడు • Agricultural Advisory Assistant
          </p>
        </div>
      </header>

      {/* Controls Bar */}
      <div className="max-w-4xl mx-auto w-full p-4">
        <ControlsBar onFormatChange={handleFormatChange} />
      </div>


      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg, idx) => (
            <ChatBubble key={idx} message={msg.text} isUser={msg.isUser} image={msg.image} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card/50 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <Button
            onClick={handleVoiceInput}
            variant={isRecording ? "destructive" : "secondary"}
            size="icon"
            className={`btn-3d flex-shrink-0 ${isRecording ? 'voice-active glow-green' : ''}`}
            disabled={isLoading || isSpeaking}
            aria-label={isRecording ? "Stop recording" : "Start voice input"}
          >
            {isRecording ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </Button>

          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder="మీ ప్రశ్న టైప్ చేయండి... Type your question..."
            className="flex-1 min-h-[60px] max-h-[120px] text-lg resize-none"
            disabled={isLoading || isSpeaking}
            aria-label="Message input"
          />

          <Button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading || isSpeaking}
            size="icon"
            className="btn-3d flex-shrink-0"
            aria-label="Send message"
          >
            {isSpeaking ? (
              <Volume2 className="w-5 h-5 animate-pulse" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
