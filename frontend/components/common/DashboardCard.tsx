import { DashboardCardProps } from "@/Interfaces/interface";

const DashboardCard: React.FC<DashboardCardProps> = ({ title, count}) => {
  return (
      <div className="px-4 py-6 border-l-4 rounded shadow bg-yellow-100 text-yellow-700 border-yellow-400">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-3xl font-bold">{count}</p>
      </div>
  );
};

export default DashboardCard