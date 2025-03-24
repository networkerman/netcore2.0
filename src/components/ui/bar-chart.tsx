import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface BarChartProps {
  data: any[];
  category: string;
}

export function BarChart({ data, category }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RechartsBarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={Object.keys(data[0]).find(key => key !== category)} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={category} fill="#2563eb" />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
} 