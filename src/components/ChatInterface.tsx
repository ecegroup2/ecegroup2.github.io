
import { useState, useEffect, useRef } from "react";
import { Send, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mock responses for the AI chatbot
const mockResponses = [
  "Based on your heart rate readings, I recommend you consult with a cardiologist for further evaluation.",
  "Your SpO2 levels appear to be within the normal range. Continue monitoring and maintain good health practices.",
  "I notice your ECG readings show some irregularities. It would be advisable to have this checked by a specialist.",
  "Your vitals are looking good overall. Keep up your healthy lifestyle.",
  "Based on the pattern in your readings, you might benefit from a consultation with a cardiac specialist. Would you like me to suggest some doctors?",
];

const ChatInterface = () => {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean; timestamp: Date }[]>([
    {
      text: "Hello! I'm your AI health assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response after a short delay
    setTimeout(() => {
      const randomResponse =
        mockResponses[Math.floor(Math.random() * mockResponses.length)];
      const aiMessage = {
        text: randomResponse,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full rounded-xl glass-morphism overflow-hidden animate-float-up">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">AI Health Consultation</h2>
        <p className="text-sm text-muted-foreground">
          Ask questions about your health data and get personalized advice
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex items-start gap-3 transition-all",
              message.isUser ? "justify-end" : "justify-start",
              {
                "animate-float-up": index === messages.length - 1,
              }
            )}
          >
            {!message.isUser && (
              <div className="flex-shrink-0 bg-primary/10 p-2 rounded-full">
                <Bot size={16} className="text-primary" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[75%] rounded-2xl p-4",
                message.isUser
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              )}
            >
              <p className="text-sm">{message.text}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            {message.isUser && (
              <div className="flex-shrink-0 bg-primary/10 p-2 rounded-full">
                <User size={16} className="text-primary" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 bg-primary/10 p-2 rounded-full">
              <Bot size={16} className="text-primary" />
            </div>
            <div className="bg-secondary text-secondary-foreground max-w-[75%] rounded-2xl p-4">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your health question..."
            className="flex-1 px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <Button type="submit" size="icon">
            <Send size={18} />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
