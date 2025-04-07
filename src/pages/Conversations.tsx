import { useState, useEffect } from 'react';
import { Conversation, ConversationMessage } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ChatInterface from '@/components/chat/ChatInterface';
import { Message } from '@/lib/types';

export default function Conversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Load conversations from your data source
    // This is just mock data for now
    const mockConversations: Conversation[] = [
      {
        id: '1',
        customerId: 'customer1',
        customerName: 'John Doe',
        lastMessage: 'Hello, I need help',
        timestamp: Date.now(),
        status: 'active'
      },
      // Add more mock conversations as needed
    ];
    setConversations(mockConversations);
  }, []);

  const handleSendMessage = (message: string) => {
    if (!selectedConversation) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'business',
      timestamp: Date.now(),
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || conv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Conversations</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredConversations.map((conversation) => (
          <Card
            key={conversation.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedConversation(conversation)}
          >
            <CardHeader>
              <CardTitle className="text-lg">{conversation.customerName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 truncate">{conversation.lastMessage}</p>
              <p className="text-sm text-gray-400 mt-2">
                {new Date(conversation.timestamp).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedConversation} onOpenChange={() => setSelectedConversation(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Conversation with {selectedConversation?.customerName}
            </DialogTitle>
          </DialogHeader>
          {selectedConversation && (
            <ChatInterface
              conversationId={selectedConversation.id}
              customerId={selectedConversation.customerId}
              onSendMessage={handleSendMessage}
              messages={messages}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
