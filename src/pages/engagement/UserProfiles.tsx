import { BaseAnalytics } from "@/components/analytics/BaseAnalytics";
import { LineChart } from "@/components/ui/line-chart";
import { BarChart } from "@/components/ui/bar-chart";
import { PieChart } from "@/components/ui/pie-chart";

export default function UserProfiles() {
  const metrics = [
    {
      label: "Total Users",
      value: "1.2M",
      change: "+8.5%",
      trend: "up" as const,
    },
    {
      label: "Active Users",
      value: "850K",
      change: "+5.2%",
      trend: "up" as const,
    },
    {
      label: "Avg. Session Time",
      value: "12.5m",
      change: "+1.8m",
      trend: "up" as const,
    },
    {
      label: "Engagement Score",
      value: "7.8",
      change: "+0.3",
      trend: "up" as const,
    },
  ];

  const tabs = [
    {
      value: "demographics",
      label: "Demographics",
      content: (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium mb-2">Age Distribution</h3>
              <BarChart
                data={[
                  { age: "18-24", users: 15 },
                  { age: "25-34", users: 35 },
                  { age: "35-44", users: 25 },
                  { age: "45-54", users: 15 },
                  { age: "55+", users: 10 },
                ]}
                category="users"
              />
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium mb-2">Location Distribution</h3>
              <PieChart
                data={[
                  { location: "North America", value: 45 },
                  { location: "Europe", value: 25 },
                  { location: "Asia", value: 20 },
                  { location: "Other", value: 10 },
                ]}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      value: "behavior",
      label: "Behavior",
      content: (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium mb-2">Session Duration Trend</h3>
              <LineChart
                data={[
                  { date: "2024-01", duration: 10.5, sessions: 450000 },
                  { date: "2024-02", duration: 11.2, sessions: 520000 },
                  { date: "2024-03", duration: 12.5, sessions: 580000 },
                ]}
                categories={["duration", "sessions"]}
              />
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium mb-2">Feature Usage</h3>
              <BarChart
                data={[
                  { feature: "Search", usage: 85 },
                  { feature: "Filter", usage: 65 },
                  { feature: "Compare", usage: 45 },
                  { feature: "Save", usage: 35 },
                ]}
                category="usage"
              />
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <BaseAnalytics
      title="User Profiles"
      description="Analyze user demographics, behavior, and engagement patterns."
      metrics={metrics}
      tabs={tabs}
    />
  );
} 