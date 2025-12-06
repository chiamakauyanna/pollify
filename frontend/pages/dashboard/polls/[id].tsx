import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, CheckCircle, XCircle } from "lucide-react";

import AppLayout from "@/components/layouts/app/AppLayout";
import AdminPollManagement from "@/components/polls/AdminPollManagement";
import Loader from "@/components/common/Loader";
import Toast from "@/components/common/Toast";

import { AppDispatch } from "@/redux/store";
import {
  fetchPoll,
  fetchPollStats,
  generateVoteLink,
  bulkGenerateVoteLinks,
  sendBulkVoteEmails,
} from "@/redux/slices/pollSlice";

import {
  selectCurrentPoll,
  selectPollStats,
  selectPollLoading,
  selectPollError,
  selectBulkGeneratedLinks,
} from "@/redux/selectors/pollSelectors";

const progressColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-400",
  "bg-pink-500",
  "bg-purple-500",
  "bg-indigo-500",
];

export default function PollDetailsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { id } = router.query;

  const poll = useSelector(selectCurrentPoll);
  const stats = useSelector(selectPollStats);
  const loading = useSelector(selectPollLoading);
  const error = useSelector(selectPollError);
  const bulkLinksFromStore = useSelector(selectBulkGeneratedLinks);

  const [invitees, setInvitees] = useState<{ name: string; email: string }[]>(
    []
  );
  const [singleLink, setSingleLink] = useState<string | null>(null);
  const [bulkLinks, setBulkLinks] = useState<
    {
      name: string;
      email: string;
      link: string;
      used: boolean;
      sent?: boolean;
    }[]
  >([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch poll and stats
  useEffect(() => {
    if (!id || Array.isArray(id)) return;
    dispatch(fetchPoll(id as string));
    dispatch(fetchPollStats(id as string));
  }, [id, dispatch]);

  // Update bulk links from store
  useEffect(() => {
    if (bulkLinksFromStore?.length > 0) {
      const fullLinks = bulkLinksFromStore.map((l: any) => ({
        name: l.name || "",
        email: l.email || "",
        link: `${window.location.origin}/vote/${l.token}`,
        used: l.used || false,
      }));
      setBulkLinks(fullLinks);
    }
  }, [bulkLinksFromStore]);

  const handleToast = (message: string) => setToastMessage(message);

  const handleCopyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      handleToast("Copied to clipboard!");
    } catch {
      handleToast("Failed to copy link");
    }
  };

  // Single link generator
  const handleGenerateSingleLink = async () => {
    if (!id || Array.isArray(id)) return;
    try {
      const response = await dispatch(
        generateVoteLink({ pollId: id as string })
      ).unwrap();
      setSingleLink(`${window.location.origin}/vote/${response.token}`);
      handleToast("Vote link generated!");
    } catch {
      handleToast("Failed to generate vote link");
    }
  };

  // Bulk links generator
  const handleGenerateBulkLinks = async () => {
    if (!id || Array.isArray(id) || invitees.length === 0) {
      handleToast("Add at least one invitee.");
      return;
    }
    try {
      const response = await dispatch(
        bulkGenerateVoteLinks({ pollId: id as string, invitees })
      ).unwrap();

      const fullLinks = response.links.map((l: any, idx: number) => ({
        name: invitees[idx].name,
        email: invitees[idx].email,
        link: `${window.location.origin}/vote/${l.token}`,
        used: false,
        sent: false,
      }));
      setBulkLinks(fullLinks);
      handleToast("Bulk vote links generated!");
    } catch {
      handleToast("Failed to generate bulk links");
    }
  };

  const handleSendBulkEmails = async () => {
    if (!poll || bulkLinks.length === 0) {
      handleToast("No links to send.");
      return;
    }

    // Only send emails for links that haven't been sent
    const unsentLinks = bulkLinks.filter((link) => !link.sent);
    if (unsentLinks.length === 0) {
      handleToast("All links have already been sent.");
      return;
    }

    try {
      const payload = bulkLinks.map((inv) => ({
        name: inv.name,
        email: inv.email,
        link: inv.link,
      }));
      await dispatch(
        sendBulkVoteEmails({ pollTitle: poll.title, invitees: payload })
      ).unwrap();
      handleToast("Emails sent successfully!");

      // Mark links as sent
      setBulkLinks((prev) =>
        prev.map((link) => ({
          ...link,
          sent: true,
        }))
      );
    } catch {
      handleToast("Failed to send emails");
    }
  };

  if (loading || !poll || !stats) {
    return (
      <AppLayout>
        <Loader />
      </AppLayout>
    );
  }

  const totalVotes =
    stats.stats.reduce((sum: number, c: any) => sum + c.votes, 0) || 1;

  return (
    <AppLayout>
      {error && <Toast message={error} type="error" />}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage(null)}
        />
      )}

      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Poll Title & Links */}
        <div className="p-6 bg-white rounded-xl shadow flex flex-col gap-4">
          <h1 className="text-2xl font-bold">{poll.title}</h1>

          {/* Single Link Section */}
          <div className="flex gap-2 items-center">
            <button
              onClick={handleGenerateSingleLink}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Generate Single Vote Link
            </button>
            {singleLink && (
              <div className="flex items-center gap-2 bg-gray-100 p-2 rounded flex-1">
                <span className="truncate text-blue-600">{singleLink}</span>
                <button
                  onClick={() => handleCopyLink(singleLink)}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Bulk Links Section */}
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">Bulk Invitees</h2>
            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
              {invitees.map((inv, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Name"
                    value={inv.name}
                    onChange={(e) => {
                      const list = [...invitees];
                      list[idx].name = e.target.value;
                      setInvitees(list);
                    }}
                    className="border px-2 py-1 rounded flex-1"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={inv.email}
                    onChange={(e) => {
                      const list = [...invitees];
                      list[idx].email = e.target.value;
                      setInvitees(list);
                    }}
                    className="border px-2 py-1 rounded flex-1"
                  />
                  <button
                    onClick={() =>
                      setInvitees(invitees.filter((_, i) => i !== idx))
                    }
                    className="px-2 bg-red-500 text-white rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              <button
                onClick={() =>
                  setInvitees([...invitees, { name: "", email: "" }])
                }
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                Add Invitee
              </button>
              <button
                onClick={handleGenerateBulkLinks}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Generate Links
              </button>
              {bulkLinks.length > 0 && (
                <button
                  onClick={handleSendBulkEmails}
                  disabled={bulkLinks.every((link) => link.sent)}
                  className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                >
                  Send Emails
                </button>
              )}
            </div>

            {/* Bulk Links List */}
            <div className="flex flex-col gap-1 max-h-48 overflow-y-auto mt-2">
              {bulkLinks.map((inv, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-gray-100 px-3 py-1 rounded"
                >
                  <div className="flex items-center gap-2 truncate">
                    {inv.used ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="truncate">
                      {inv.name ? `${inv.name}: ` : ""}
                      {inv.link}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyLink(inv.link)}
                    className="px-2 py-1 text-gray-700 border rounded hover:bg-gray-200"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 gap-4">
          {stats.stats.map((choice: any, idx: number) => {
            const percentage = ((choice.votes / totalVotes) * 100).toFixed(1);
            const colorClass = progressColors[idx % progressColors.length];
            return (
              <motion.div
                key={choice.choice_id}
                layout
                className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-800">
                    {choice.text}
                  </span>
                  <span className="text-sm font-semibold text-gray-600">
                    {choice.votes} votes
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className={`${colorClass} h-3 rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {percentage}% of total votes
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Admin Management */}
        <AdminPollManagement
          pollId={id as string}
          onPollChange={() => {
            if (!id || Array.isArray(id)) return;
            dispatch(fetchPoll(id as string));
            dispatch(fetchPollStats(id as string));
          }}
        />
      </div>
    </AppLayout>
  );
}
