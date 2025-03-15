
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { getDashboardData, Conversation } from "@/services/mockData";
import { DataTable } from "@/components/dashboard/DataTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Conversations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  
  const { data, isLoading } = useQuery({
    queryKey: ["conversationsData"],
    queryFn: () => getDashboardData(30),
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading conversations data...</div>;
  }

  const { conversations } = data;

  // Filter conversations based on search term and status
  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch = searchTerm === "" || 
      conversation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.adName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || conversation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      header: "Customer",
      accessorKey: "customerName" as keyof Conversation,
      cell: (conversation: Conversation) => (
        <div className="font-medium">{conversation.customerName}</div>
      ),
    },
    {
      header: "Ad Source",
      accessorKey: "adName" as keyof Conversation,
      cell: (conversation: Conversation) => (
        <div className="max-w-[200px] truncate" title={conversation.adName}>
          {conversation.adName}
        </div>
      ),
    },
    {
      header: "Started",
      accessorKey: "startTime" as keyof Conversation,
      cell: (conversation: Conversation) => format(new Date(conversation.startTime), "MMM dd, yyyy HH:mm"),
    },
    {
      header: "Last Activity",
      accessorKey: "lastMessageTime" as keyof Conversation,
      cell: (conversation: Conversation) => format(new Date(conversation.lastMessageTime), "MMM dd, yyyy HH:mm"),
    },
    {
      header: "Status",
      accessorKey: "status" as keyof Conversation,
      cell: (conversation: Conversation) => {
        const statusStyles = {
          active: "bg-green-100 text-green-800",
          inactive: "bg-gray-100 text-gray-800",
          converted: "bg-purple-100 text-purple-800",
        };
        
        return (
          <Badge className={statusStyles[conversation.status]}>
            {conversation.status.charAt(0).toUpperCase() + conversation.status.slice(1)}
          </Badge>
        );
      },
    },
    {
      header: "Messages",
      accessorKey: "messages" as keyof Conversation,
      cell: (conversation: Conversation) => conversation.messages.length,
    },
    {
      header: "Actions",
      accessorKey: "id" as keyof Conversation,
      cell: (conversation: Conversation) => (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setSelectedConversation(conversation)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Conversations</h1>
        <p className="text-muted-foreground">
          Track and analyze your WhatsApp conversations from CTWA ads
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>CTWA Conversations</CardTitle>
          <CardDescription>
            Conversations initiated from your Click-to-WhatsApp ads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredConversations}
            columns={columns}
          />
        </CardContent>
      </Card>

      {/* Conversation Details Dialog */}
      <Dialog open={!!selectedConversation} onOpenChange={(open) => !open && setSelectedConversation(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedConversation && (
            <>
              <DialogHeader>
                <DialogTitle>Conversation with {selectedConversation.customerName}</DialogTitle>
                <DialogDescription>
                  Started from ad: {selectedConversation.adName}
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">CTWA Click ID</h3>
                    <p className="text-sm">{selectedConversation.ctwaClid}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Ad URL</h3>
                    <p className="text-sm truncate">{selectedConversation.adUrl}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Started</h3>
                    <p className="text-sm">{format(new Date(selectedConversation.startTime), "MMM dd, yyyy HH:mm")}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                    <Badge className={
                      selectedConversation.status === "active" ? "bg-green-100 text-green-800" :
                      selectedConversation.status === "inactive" ? "bg-gray-100 text-gray-800" :
                      "bg-purple-100 text-purple-800"
                    }>
                      {selectedConversation.status.charAt(0).toUpperCase() + selectedConversation.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 mt-4">
                  <h3 className="font-medium mb-4">Conversation History</h3>
                  <div className="space-y-4">
                    {selectedConversation.messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.sender === "customer" ? "justify-start" : "justify-end"}`}
                      >
                        <div 
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            message.sender === "customer" 
                              ? "bg-gray-100 text-gray-800" 
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          <div className="text-sm">{message.message}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {format(new Date(message.time), "MMM dd, HH:mm")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Conversations;
