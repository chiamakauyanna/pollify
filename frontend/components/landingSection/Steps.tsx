import { CheckCircle, Share2, BarChart2, VoteIcon } from "lucide-react";

const Steps = () => {
  return (
    <div className="flex justify-center mt-20 px-6">
      <div className="bg-primary/25 w-full lg:w-4/5 py-14 px-8 backdrop-blur-sm border border-primary/20">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-primary mb-10">
          How Pollify Works
        </h2>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10">
          {/* Step 1 */}
          <div className="bg-background rounded-2xl p-6 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-primary/10">
            <div className="w-14 h-14 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <CheckCircle className="text-primary" size={28} />
            </div>
            <h3 className="font-semibold text-lg text-primary">
              Create Your Poll
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Set your question and choices from your admin dashboard.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-background rounded-2xl p-6 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-primary/10">
            <div className="w-14 h-14 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Share2 className="text-primary" size={26} />
            </div>
            <h3 className="font-semibold text-lg text-primary">
              Share Voting Link
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Pollify generates a unique secure link for each voter.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-background rounded-2xl p-6 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-primary/10">
            <div className="w-14 h-14 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <VoteIcon className="text-primary" size={28} />
            </div>
            <h3 className="font-semibold text-lg text-primary">Voters Vote</h3>
            <p className="text-sm text-gray-600 mt-2">
              No login required — one click, one vote.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-background rounded-2xl p-6 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-primary/10">
            <div className="w-14 h-14 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <BarChart2 className="text-primary" size={28} />
            </div>
            <h3 className="font-semibold text-lg text-primary">
              See Results Live
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Votes appear in real-time with accurate counting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Steps;
