import React from 'react';
import ChatInterface from '@/components/chat/ChatInterface';
import { AutoReplyService } from '@/lib/services/auto-reply.service';
import { AIService } from '@/lib/services/ai.service';

export const ChatPage: React.FC = () => {
  const autoReplyService = AutoReplyService.getInstance();
  const aiService = AIService.getInstance();

  const handleSendMessage = async (message: string) => {
    try {
      // Find matching response
      const response = autoReplyService.findMatchingResponse(message);
      
      if (response) {
        // If there's a matching response, send it
        return response.text;
      }
      
      // If no matching response, generate one using AI
      return await aiService.generateResponse(message, 'English');
    } catch (error) {
      console.error('Error sending message:', error);
      return 'Sorry, I encountered an error processing your message.';
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Chat</h1>
        <ChatInterface
          onSendMessage={handleSendMessage}
          autoReplyEnabled={true}
        />
      </div>
    </div>
  );
}; 