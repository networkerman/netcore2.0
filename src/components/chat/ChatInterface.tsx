import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  sender: 'customer' | 'business';
  timestamp: number;
}

interface ChatInterfaceProps {
  onSendMessage: (message: string) => Promise<string>;
  autoReplyEnabled?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onSendMessage,
  autoReplyEnabled = false
}) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = async () => {
    if (!message.trim() || isSending) return;

    setIsSending(true);
    try {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        text: message,
        sender: 'customer',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, userMessage]);
      setMessage('');

      // Get response
      const response = await onSendMessage(message);
      
      // Add bot response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'business',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2 ${
                msg.sender === 'customer' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'business' && (
                <Bot className="h-6 w-6 text-blue-500" />
              )}
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  msg.sender === 'customer'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100'
                }`}
              >
                {msg.text}
              </div>
              {msg.sender === 'customer' && (
                <User className="h-6 w-6 text-blue-500" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isSending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || isSending}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface; 