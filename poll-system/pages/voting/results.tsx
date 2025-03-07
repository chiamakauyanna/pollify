import { useSelector } from "react-redux";
import { selectPolls } from "@/redux/slices/pollSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Results = () => {
  const results = useSelector(selectPolls);
  const COLORS = ["#FFEB3B", "#F44336", "#4CAF50", "#2196F3"];

  return (
    <div className="mx-auto p-6">
      <h1 className="text-2xl font-bold text-primary">Live Voting Results</h1>
      <p className="mt-2">See how votes are being counted in real-time.</p>

      <div className="flex lg:flex-row md:flex-col flex-col justify-around">
        {/* Bar Chart */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-secondary">
            Vote Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={results}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="option" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="votes" fill="#fa7268" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-secondary">Vote Share</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={results}
                dataKey="votes"
                nameKey="option"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {results.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Results;
