import { DashboardCardProps } from "@/Interfaces/interface";

const PollSection: React.FC<DashboardCardProps>  = ({ title, polls }) => {
  return (
      <div className="mb-8">
          <h2 className={`text-xl font-semibold text-secondary mb-4`}>{title}</h2>
          {polls.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {polls.map((poll) => (
                      <div key={poll.id} className="p-4 rounded shadow-lg">
                          <p className="font-semibold">{poll.title}</p>
                          <p className="py-1 rounded text-sm">
                              {poll.description}
                          </p>
                      </div>
                  ))}
              </div>
          ) : (
              <p className="text-secondary-text">No {title.toLowerCase()}.</p>
          )}
      </div>
  );
};

export default PollSection;