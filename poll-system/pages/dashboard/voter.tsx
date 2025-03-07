import Layout from "@/components/layout/MainLayout";
import { useSelector } from "react-redux";
import { selectPolls } from "@/redux/slices/pollSlice";
import Link from "next/link";
import Button from "@/components/common/Button";
import { FaVoteYea, FaRegClock, FaHistory } from "react-icons/fa";
import { useRouter } from "next/router";
import { useEffect } from "react";

const VoterDashboard = () => {
  const polls = useSelector(selectPolls); // Fetch polls from Redux
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, []);
  return (
    <Layout userName="Voter Name" userImage="/voter-avatar.png">
      <div className="mx-auto">
        {/* Welcome Section */}
        <p className="text-xl font-bold">Hello, Chiamaka!</p>
        <p className="mt-2">Participate in elections and view results.</p>

        {/* Ongoing Polls */}
        <div className="border border-primary rounded-lg p-6 mt-6">
          <p className="text-lg font-semibold text-secondary flex items-center gap-2">
            <FaVoteYea className="text-primary" /> Ongoing Polls
          </p>
          <div className="mt-4">
            {polls.filter((poll) => poll.status === "Ongoing").length > 0 ? (
              polls
                .filter((poll) => poll.status === "Ongoing")
                .map((poll) => (
                  <div key={poll.id} className="flex justify-between items-center p-3 border border-border rounded-lg mb-2">
                    <p className="font-semibold">{poll.title}</p>
                    <Link href={`/vote/${poll.id}`}>
                      <Button text="Vote Now" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-hover" />
                    </Link>
                  </div>
                ))
            ) : (
              <p className="text-gray-500">No ongoing polls</p>
            )}
          </div>
        </div>

        {/* Upcoming Polls */}
        <div className="border border-yellow-500 rounded-lg p-6 mt-6">
          <p className="text-lg font-semibold text-yellow-600 flex items-center gap-2">
            <FaRegClock className="text-yellow-600" /> Upcoming Elections
          </p>
          <div className="mt-4">
            {polls.filter((poll) => poll.status === "Upcoming").length > 0 ? (
              polls
                .filter((poll) => poll.status === "Upcoming")
                .map((poll) => (
                  <div key={poll.id} className="flex justify-between items-center p-3 border border-border rounded-lg mb-2">
                    <p className="font-semibold">{poll.title}</p>
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded text-sm">Coming Soon</span>
                  </div>
                ))
            ) : (
              <p className="text-gray-500">No upcoming elections</p>
            )}
          </div>
        </div>

        {/* Voting History */}
        <div className="border border-gray-400 rounded-lg p-6 mt-6">
          <p className="text-lg font-semibold text-gray-600 flex items-center gap-2">
            <FaHistory className="text-gray-600" /> Voting History
          </p>
          <div className="mt-4">
            {polls.filter((poll) => poll.status === "Completed").length > 0 ? (
              polls
                .filter((poll) => poll.status === "Completed")
                .map((poll) => (
                  <div key={poll.id} className="flex justify-between items-center p-3 border border-border rounded-lg mb-2">
                    <p className="font-semibold">{poll.title}</p>
                    <span className="bg-gray-500 text-white px-2 py-1 rounded text-sm">Voted</span>
                  </div>
                ))
            ) : (
              <p className="text-gray-500">No voting history</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

VoterDashboard.noLayout = true;
export default VoterDashboard;
