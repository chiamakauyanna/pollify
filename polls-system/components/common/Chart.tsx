import { PieChart, Pie, Tooltip, Cell } from "recharts";

interface PollOption {
  text: string;
  votes_count: number;
}

interface ResultsChartProps {
  options: PollOption[];
}

const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];

const ResultsChart: React.FC<ResultsChartProps> = ({ options }) => {
  if (!options || options.length === 0) return <p className="text-center">No votes yet.</p>;

  const chartData = options.map((option) => ({
    name: option.text,
    value: option.votes_count, // Ensure correct key for recharts
  }));

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={chartData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={120}
        label
      >
        {chartData.map((_, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

export default ResultsChart;
