
import { useMemo } from "react";
import { 
  ResponsiveContainer, 
  LineChart as RechartsLineChart, 
  Line, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from "recharts";

interface LineChartProps {
  data: any[];
  lines: {
    dataKey: string;
    name: string;
    color: string;
  }[];
  xAxisKey: string;
  height?: number;
  xAxisFormatter?: (value: string) => string;
  yAxisFormatter?: (value: number) => string;
}

export const LineChart = ({
  data,
  lines,
  xAxisKey,
  height = 300,
  xAxisFormatter,
  yAxisFormatter
}: LineChartProps) => {
  const formattedData = useMemo(() => {
    return data.map((item: any) => ({
      ...item,
      [xAxisKey]: xAxisFormatter ? xAxisFormatter(item[xAxisKey]) : item[xAxisKey]
    }));
  }, [data, xAxisKey, xAxisFormatter]);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart
        data={formattedData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey={xAxisKey} 
          stroke="#9ca3af" 
          tick={{ fill: "#6b7280", fontSize: 12 }}
        />
        <YAxis 
          stroke="#9ca3af" 
          tick={{ fill: "#6b7280", fontSize: 12 }}
          tickFormatter={yAxisFormatter}
        />
        <Tooltip 
          formatter={(value: number, name: string) => {
            const displayName = lines.find(line => line.dataKey === name)?.name || name;
            return [
              yAxisFormatter ? yAxisFormatter(value) : value, 
              displayName
            ];
          }}
        />
        <Legend />
        {lines.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name}
            stroke={line.color}
            activeDot={{ r: 6 }}
            strokeWidth={2}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};
