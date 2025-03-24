import { BaseAnalytics } from "@/components/analytics/BaseAnalytics";
import { LineChart } from "@/components/ui/line-chart";
import { BarChart } from "@/components/ui/bar-chart";
import { PieChart } from "@/components/ui/pie-chart";

export default function Interactions() {
  const metrics = [
    {
      label: "Total Interactions",
      value: "2.8M",
      change: "+12.5%",
      trend: "up" as const,
    },
    {
      label: "Avg. Interactions/User",
      value: "8.4",
      change: "+1.2",
      trend: "up" as const,
    },
    {
      label: "Response Time",
      value: "1.8m",
      change: "-0.3m",
      trend: "up" as const,
    },
    {
      label: "Satisfaction Score",
      value: "4.2",
      change: "+0.2",
      trend: "up" as const,
    },
  ];

  const tabs = [
    {
      value: "overview",
      label: "Overview",
      content: (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium mb-2">Interaction Volume Trend</h3>
              <LineChart
                data={[
                  { date: "2024-01", interactions: 850000, users: 320000 },
                  { date: "2024-02", interactions: 920000, users: 350000 },
                  { date: "2024-03", interactions: 1030000, users: 380000 },
                ]}
                categories={["interactions", "users"]}
              />
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium mb-2">Interaction Types</h3>
              <PieChart
                data={[
                  { type: "Chat", value: 45 },
                  { type: "Email", value: 25 },
                  { type: "Social", value: 20 },
                  { type: "Other", value: 10 },
                ]}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      value: "performance",
      label: "Performance",
      content: (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium mb-2">Response Time by Channel</h3>
              <BarChart
                data={[
                  { channel: "Chat", time: 1.2 },
                  { channel: "Email", time: 4.5 },
                  { channel: "Social", time: 2.8 },
                  { channel: "Other", time: 3.2 },
                ]}
                category="time"
              />
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium mb-2">Satisfaction by Channel</h3>
              <BarChart
                data={[
                  { channel: "Chat", score: 4.5 },
                  { channel: "Email", score: 4.0 },
                  { channel: "Social", score: 4.2 },
                  { channel: "Other", score: 3.8 },
                ]}
                category="score"
              />
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <BaseAnalytics
      title="Interactions"
      description="Track and analyze customer interactions across all channels."
      metrics={metrics}
      tabs={tabs}
    />
  );
} 