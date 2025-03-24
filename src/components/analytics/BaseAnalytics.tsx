import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface BaseAnalyticsProps {
  title: string;
  description?: string;
  metrics: {
    label: string;
    value: string | number;
    change?: string | number;
    trend?: "up" | "down" | "neutral";
  }[];
  tabs?: {
    value: string;
    label: string;
    content: ReactNode;
  }[];
}

export function BaseAnalytics({ title, description, metrics, tabs }: BaseAnalyticsProps) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
        <DateRangePicker />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              {metric.change && (
                <p className={cn(
                  "text-xs",
                  metric.trend === "up" && "text-green-600",
                  metric.trend === "down" && "text-red-600",
                  metric.trend === "neutral" && "text-muted-foreground"
                )}>
                  {metric.change}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {tabs && (
        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue={tabs[0].value} className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {tabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value} className="p-4">
                  {tab.content}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 