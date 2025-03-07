import Layout from "@/components/layout/MainLayout";
import { useSelector } from "react-redux";
import { selectPolls } from "@/redux/slices/pollSlice";
import Button from "@/components/common/Button";
import Link from "next/link";
import Result from "@/pages/voting/results";

const AdminDashboard = () => {
  const polls = useSelector(selectPolls); // Fetch polls from Redux

  return (
    <Layout userName="Admin Name" userImage="/admin-avatar.png" isAdmin={true}>
      <div className="mx-auto">
        <p className="text-xl font-bold ">Hello, Chiamaka!</p>
        <p className="mt-2">Manage polls and monitor voting activities.</p>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link href="/create-poll">
            <Button
              text="Create New Poll"
              className="mt-6 mb-4 bg-primary text-background hover:bg-hover py-4"
            />
          </Link>
          <Link href="/manage-poll">
            <Button
              text="Manage Poll"
              className="mt-6 mb-4 border-2 border-secondary text-primary hover:bg-primary py-3.5"
            />
          </Link>
        </div>

        {/* Poll Status Sections */}
        <div className="flex gap-6 lg:flex-row md:flex-col flex-col">
          {/* Ongoing Polls */}
          <div className="border border-border rounded-lg p-6 flex-1">
            <p className="text-lg font-semibold text-secondary mb-4">
              Ongoing Polls
            </p>
            {polls.filter((poll) => poll.status === "Ongoing").length > 0 ? (
              polls
                .filter((poll) => poll.status === "Ongoing")
                .map((poll) => (
                  <div
                    key={poll.id}
                    className="flex justify-between items-center p-2"
                  >
                    <p className="text-primary font-semibold">{poll.title}</p>
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-sm">
                      {poll.status}
                    </span>
                  </div>
                ))
            ) : (
              <p className="text-gray-500">No ongoing polls</p>
            )}
          </div>

          {/* Pending Polls */}
          <div className="border border-border rounded-lg p-6 flex-1">
            <p className="text-lg font-semibold text-yellow-600 mb-4">
              Pending Polls
            </p>
            {polls.filter((poll) => poll.status === "Pending").length > 0 ? (
              polls
                .filter((poll) => poll.status === "Pending")
                .map((poll) => (
                  <div
                    key={poll.id}
                    className="flex justify-between items-center p-2"
                  >
                    <p className="text-primary font-semibold">{poll.title}</p>
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded text-sm">
                      {poll.status}
                    </span>
                  </div>
                ))
            ) : (
              <p className="text-gray-500">No pending polls</p>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div className="border border-border rounded-lg p-6 mt-6">
          <Result />
        </div>
      </div>
    </Layout>
  );
};

AdminDashboard.noLayout = true;
export default AdminDashboard;
