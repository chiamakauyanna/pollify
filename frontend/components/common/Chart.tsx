import { ResultsChartProps } from "@/Interfaces/interface";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const colors = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
];

const ResultsChart: React.FC<ResultsChartProps> = ({ options }) => {
  if (!options?.length) return <p className="text-center">No votes yet.</p>;

  const chartData = options.map((option) => ({
    name: option.text,
    value: option.vote_count,
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical">
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" width={100} />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8">
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResultsChart;
