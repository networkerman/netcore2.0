
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDashboardData, UserSegment } from "@/services/mockData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users, ChevronRight } from "lucide-react";
import { PieChart } from "@/components/dashboard/PieChart";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Segmentation = () => {
  const [isNewSegmentDialogOpen, setIsNewSegmentDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const { data, isLoading } = useQuery({
    queryKey: ["segmentationData"],
    queryFn: () => getDashboardData(),
  });

  const handleCreateSegment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsNewSegmentDialogOpen(false);
    toast({
      title: "Segment created",
      description: "Your new segment has been created successfully.",
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading segmentation data...</div>;
  }

  const { userSegments } = data;

  // Preparing data for the pie chart
  const segmentChartData = userSegments.map((segment, index) => {
    const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"];
    return {
      name: segment.name,
      value: segment.count,
      color: colors[index % colors.length]
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Segmentation</h1>
          <p className="text-muted-foreground">
            Create and manage audience segments based on CTWA interactions
          </p>
        </div>
        <Button onClick={() => setIsNewSegmentDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Segment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Segment Distribution</CardTitle>
            <CardDescription>
              User distribution across different segments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart 
              data={segmentChartData}
              height={300}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ad Performance by Segment</CardTitle>
            <CardDescription>
              How different segments interact with your CTWA ads
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Clicked but did not purchase</div>
                  <div className="text-sm text-muted-foreground">CTR: 2.8%</div>
                </div>
                <Badge variant="outline" className="bg-blue-50">High Value</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Abandoned cart</div>
                  <div className="text-sm text-muted-foreground">CTR: 3.2%</div>
                </div>
                <Badge variant="outline" className="bg-orange-50">Medium Value</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">High-value conversions</div>
                  <div className="text-sm text-muted-foreground">CTR: 4.5%</div>
                </div>
                <Badge variant="outline" className="bg-green-50">Top Priority</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Multi-purchase customers</div>
                  <div className="text-sm text-muted-foreground">CTR: 5.1%</div>
                </div>
                <Badge variant="outline" className="bg-purple-50">VIP</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold mt-6">Available Segments</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userSegments.map((segment) => (
          <Card key={segment.id}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-muted-foreground" />
                {segment.name}
              </CardTitle>
              <CardDescription>{segment.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <span className="font-medium">Criteria:</span> {segment.criteria}
              </div>
              <div className="mt-2 text-sm">
                <span className="font-medium">Users:</span> {segment.count.toLocaleString()}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">Edit</Button>
              <Button variant="ghost" size="sm" className="text-blue-600">
                View Users
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Create New Segment Dialog */}
      <Dialog open={isNewSegmentDialogOpen} onOpenChange={setIsNewSegmentDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Create New Segment</DialogTitle>
            <DialogDescription>
              Define a new user segment based on CTWA interactions and behavior
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateSegment}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="segment-name">Segment Name</Label>
                <Input
                  id="segment-name"
                  placeholder="e.g., Abandoned Cart Users"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="segment-description">Description</Label>
                <Textarea
                  id="segment-description"
                  placeholder="Describe the purpose of this segment"
                  rows={3}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="segment-criteria">Criteria</Label>
                <Input
                  id="segment-criteria"
                  placeholder="e.g., Clicked on Meta ads but did not purchase"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label>Source</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="cursor-pointer bg-blue-50">Meta Ads</Badge>
                  <Badge variant="outline" className="cursor-pointer">Google Ads</Badge>
                  <Badge variant="outline" className="cursor-pointer">Conversation</Badge>
                  <Badge variant="outline" className="cursor-pointer">Conversion</Badge>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsNewSegmentDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Segment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Segmentation;
