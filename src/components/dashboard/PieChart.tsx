
import { 
  ResponsiveContainer, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend 
} from "recharts";

interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  formatter?: (value: number) => string;
}

export const PieChart = ({
  data,
  height = 300,
  innerRadius = 60,
  outerRadius = 80,
  formatter
}: PieChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => [
            formatter ? formatter(value) : value, 
            "Value"
          ]}
        />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};
