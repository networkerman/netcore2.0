
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDashboardData, calculateSummaryMetrics, AdMetrics } from "@/services/mockData";
import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { DateRange } from "react-day-picker";
import { format, differenceInDays } from "date-fns";
import { StatCard } from "@/components/dashboard/StatCard";
import { LineChart } from "@/components/dashboard/LineChart";
import { PieChart } from "@/components/dashboard/PieChart";
import { 
  Users, 
  MousePointerClick, 
  MessageSquareText, 
  ShoppingCart, 
  DollarSign,
  BarChart4
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });

  const [timePeriod, setTimePeriod] = useState<string>("30days");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["dashboardData", timePeriod],
    queryFn: () => {
      const days = timePeriod === "7days" ? 7 : timePeriod === "30days" ? 30 : 90;
      return getDashboardData(days);
    },
  });

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      const days = differenceInDays(dateRange.to, dateRange.from) + 1;
      if (days <= 7) setTimePeriod("7days");
      else if (days <= 30) setTimePeriod("30days");
      else setTimePeriod("90days");
      refetch();
    }
  }, [dateRange, refetch]);

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

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading dashboard data...</div>;
  }

  if (isError) {
    return <div className="flex items-center justify-center h-full">Error loading dashboard data</div>;
  }

  const { adMetrics, summaryMetrics } = data;

  // Calculate metrics
  const totalImpressions = summaryMetrics.totalImpressions;
  const totalClicks = summaryMetrics.totalClicks;
  const totalConversations = summaryMetrics.totalConversations;
  const totalConversions = summaryMetrics.totalConversions;
  const totalSpent = summaryMetrics.totalSpent;
  const totalRevenue = summaryMetrics.totalRevenue;
  
  const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
  const roas = totalSpent > 0 ? totalRevenue / totalSpent : 0;
  const cpc = totalClicks > 0 ? totalSpent / totalClicks : 0;
  const cpa = totalConversions > 0 ? totalSpent / totalConversions : 0;

  // Create data for platform distribution
  const platformData = [
    { name: "Meta", value: Math.round(totalClicks * 0.65), color: "#4267B2" },
    { name: "Google", value: Math.round(totalClicks * 0.35), color: "#DB4437" },
  ];

  // Create data for conversion funnel
  const funnelData = [
    { name: "Impressions", value: totalImpressions, color: "#64748b" },
    { name: "Clicks", value: totalClicks, color: "#3b82f6" },
    { name: "Conversations", value: totalConversations, color: "#10b981" },
    { name: "Conversions", value: totalConversions, color: "#8b5cf6" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CTWA ROI Dashboard</h1>
          <p className="text-muted-foreground">
            Track and analyze your Click-to-WhatsApp campaign performance
          </p>
        </div>
        <DateRangePicker
          onDateRangeChange={setDateRange}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Impressions"
          value={formatNumber(totalImpressions)}
          icon={<Users className="h-4 w-4" />}
          trend={{ value: 5.2, positive: true }}
          description="vs. previous period"
        />
        <StatCard
          title="Clicks"
          value={formatNumber(totalClicks)}
          icon={<MousePointerClick className="h-4 w-4" />}
          trend={{ value: 7.1, positive: true }}
          description="vs. previous period"
        />
        <StatCard
          title="Conversations"
          value={formatNumber(totalConversations)}
          icon={<MessageSquareText className="h-4 w-4" />}
          trend={{ value: 3.5, positive: true }}
          description="vs. previous period"
        />
        <StatCard
          title="Conversions"
          value={formatNumber(totalConversions)}
          icon={<ShoppingCart className="h-4 w-4" />}
          trend={{ value: 8.3, positive: true }}
          description="vs. previous period"
        />
        <StatCard
          title="Ad Spend"
          value={formatCurrency(totalSpent)}
          icon={<DollarSign className="h-4 w-4" />}
          trend={{ value: 2.1, positive: false }}
          description="vs. previous period"
        />
        <StatCard
          title="Revenue"
          value={formatCurrency(totalRevenue)}
          icon={<BarChart4 className="h-4 w-4" />}
          trend={{ value: 9.7, positive: true }}
          description="vs. previous period"
        />
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="roi">ROI Metrics</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>
                Track your CTWA campaign performance metrics over time
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
                  { dataKey: "conversations", name: "Conversations", color: "#10b981" },
                  { dataKey: "conversions", name: "Conversions", color: "#8b5cf6" }
                ]}
                yAxisFormatter={formatNumber}
                height={350}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="roi" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>ROI Metrics</CardTitle>
                <CardDescription>
                  Key return on investment metrics for your campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <StatCard
                    title="Click-Through Rate (CTR)"
                    value={formatPercent(ctr)}
                    description="Clicks ÷ Impressions"
                  />
                  <StatCard
                    title="Conversion Rate"
                    value={formatPercent(conversionRate)}
                    description="Conversions ÷ Clicks"
                  />
                  <StatCard
                    title="Cost Per Click (CPC)"
                    value={formatCurrency(cpc)}
                    description="Spend ÷ Clicks"
                  />
                  <StatCard
                    title="Cost Per Acquisition (CPA)"
                    value={formatCurrency(cpa)}
                    description="Spend ÷ Conversions"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Return on Ad Spend</CardTitle>
                <CardDescription>
                  ROAS comparison over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={adMetrics}
                  xAxisKey="date"
                  xAxisFormatter={(value) => format(new Date(value), "MMM dd")}
                  lines={[
                    { 
                      dataKey: "revenue", 
                      name: "Revenue", 
                      color: "#10b981" 
                    },
                    { 
                      dataKey: "spent", 
                      name: "Ad Spend", 
                      color: "#ef4444" 
                    },
                  ]}
                  yAxisFormatter={(value) => formatCurrency(value)}
                  height={245}
                />
                <div className="mt-4 border-t pt-4">
                  <div className="text-2xl font-bold text-center">
                    ROAS: {roas.toFixed(2)}x
                  </div>
                  <p className="text-center text-sm text-muted-foreground mt-1">
                    For every $1 spent on ads, you get ${roas.toFixed(2)} in revenue
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="distribution" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Platform Distribution</CardTitle>
                <CardDescription>
                  Clicks distribution across ad platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={platformData}
                  formatter={formatNumber}
                  height={300}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>
                  Track user journey from impressions to conversions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={funnelData}
                  formatter={formatNumber}
                  height={300}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
