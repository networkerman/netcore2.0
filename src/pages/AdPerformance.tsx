
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { getDashboardData, AdCampaign } from "@/services/mockData";
import { DataTable } from "@/components/dashboard/DataTable";
import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { DateRange } from "react-day-picker";
import { LineChart } from "@/components/dashboard/LineChart";
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

const AdPerformance = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");
  
  const { data, isLoading } = useQuery({
    queryKey: ["adPerformanceData"],
    queryFn: () => getDashboardData(30),
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading ad performance data...</div>;
  }

  const { adCampaigns, adMetrics } = data;

  const columns = [
    {
      header: "Campaign",
      accessorKey: "name" as keyof AdCampaign,
      cell: (campaign: AdCampaign) => (
        <div className="font-medium">{campaign.name}</div>
      ),
    },
    {
      header: "Platform",
      accessorKey: "platform" as keyof AdCampaign,
      cell: (campaign: AdCampaign) => (
        <Badge variant="outline" className={campaign.platform === "Meta" ? "bg-blue-50" : "bg-red-50"}>
          {campaign.platform}
        </Badge>
      ),
    },
    {
      header: "Start Date",
      accessorKey: "startDate" as keyof AdCampaign,
      cell: (campaign: AdCampaign) => format(new Date(campaign.startDate), "MMM dd, yyyy"),
    },
    {
      header: "End Date",
      accessorKey: "endDate" as keyof AdCampaign,
      cell: (campaign: AdCampaign) => campaign.endDate ? format(new Date(campaign.endDate), "MMM dd, yyyy") : "Ongoing",
    },
    {
      header: "Budget",
      accessorKey: "budget" as keyof AdCampaign,
      cell: (campaign: AdCampaign) => formatCurrency(campaign.budget),
    },
    {
      header: "Spent",
      accessorKey: "spent" as keyof AdCampaign,
      cell: (campaign: AdCampaign) => formatCurrency(campaign.spent),
    },
    {
      header: "Progress",
      accessorKey: "spent" as keyof AdCampaign,
      cell: (campaign: AdCampaign) => {
        const percentage = Math.round((campaign.spent / campaign.budget) * 100);
        return (
          <div className="flex items-center gap-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <span className="text-xs font-medium">{percentage}%</span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ad Performance</h1>
          <p className="text-muted-foreground">
            Track and analyze your ad campaign performance metrics
          </p>
        </div>
        <DateRangePicker
          onDateRangeChange={setDateRange}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>
                Compare the performance of your CTWA ad campaigns
              </CardDescription>
            </div>
            <Select 
              value={selectedCampaign}
              onValueChange={setSelectedCampaign}
            >
              <SelectTrigger className="w-[180px] mt-2 sm:mt-0">
                <SelectValue placeholder="Select campaign" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campaigns</SelectItem>
                {adCampaigns.map((campaign) => (
                  <SelectItem key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={adCampaigns}
            columns={columns}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Clicks vs. Impressions</CardTitle>
            <CardDescription>
              Track your ad visibility and engagement over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart
              data={adMetrics}
              xAxisKey="date"
              xAxisFormatter={(value) => format(new Date(value), "MMM dd")}
              lines={[
                { dataKey: "impressions", name: "Impressions", color: "#64748b" },
                { dataKey: "clicks", name: "Clicks", color: "#3b82f6" },
              ]}
              yAxisFormatter={formatNumber}
              height={300}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spend vs. Revenue</CardTitle>
            <CardDescription>
              Compare your ad spend with generated revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart
              data={adMetrics}
              xAxisKey="date"
              xAxisFormatter={(value) => format(new Date(value), "MMM dd")}
              lines={[
                { dataKey: "spent", name: "Ad Spend", color: "#ef4444" },
                { dataKey: "revenue", name: "Revenue", color: "#10b981" },
              ]}
              yAxisFormatter={(value) => formatCurrency(value)}
              height={300}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdPerformance;
