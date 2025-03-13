import React from "react";
import { useRouter } from "next/router";
import Button from "@/components/common/Button";
import ConfirmButton from "@/components/common/ConfirmButton";
import Loader from "@/components/common/Loader";
import { ArrowLeft } from "lucide-react";
import useManagePoll from "@/hooks/useManagePolls";
import SelectedPoll from "@/components/common/SelectedPoll";

const ManagePoll: React.FC = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const {
    activePolls,
    loading,
    poll,
    formData,
    handleChange,
    handleSubmitOptions,
    handleDelete,
    handleUpdatePoll,
    deletingPollId,
    isUpdating,
    message,
    newOptions,
    optionText,
    setOptionText,
    handleAddOption,
    isSubmittingOptions,
  } = useManagePoll();

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900 transition-all"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-semibold ml-4">Manage Polls</h2>
      </div>

      {/* Active Polls List */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader />
        </div>
      ) : activePolls.length === 0 ? (
        <p className="text-gray-500 text-center">No active polls available.</p>
      ) : (
        <ul className="space-y-4">
          {activePolls.map((poll) => (
            <li
              key={poll.id}
              className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <p className="text-lg font-medium text-gray-800">{poll.title}</p>
              <p className="text-sm text-gray-600">{poll.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                Ends:{" "}
                {poll.expires_at
                  ? new Date(poll.expires_at).toLocaleString()
                  : "No expiration date"}
              </p>

              {/* Poll Options */}
              <ul className="mt-4 flex flex-col gap-2">
                {(poll.options || []).map((option) => (
                  <li
                    key={option.id}
                    className="text-sm text-gray-700 bg-gray-200 px-2 py-1 rounded-md inline-block"
                  >
                    {option.text}
                  </li>
                ))}
              </ul>

              {/* Actions */}
              <div className="flex gap-3 mt-4">
                <Button
                  onClick={() => router.push(`/manage-poll?id=${poll.id}`)}
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 text-white text-sm rounded-lg transition-all"
                >
                  Edit
                </Button>

                <ConfirmButton
                  text={deletingPollId === poll.id ? "Deleting..." : "Delete"}
                  onConfirm={() => handleDelete(String(poll.id))}
                  className={`bg-red-500 text-white text-sm px-4 py-2 rounded-lg transition-all ${
                    deletingPollId === poll.id
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-red-600"
                  }`}
                  disabled={deletingPollId === poll.id}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Manage Selected Poll Component */}
      {id && poll && (
        <div className="mt-8">
          <SelectedPoll
            formData={formData}
            message={message}
            handleChange={handleChange}
            handleUpdatePoll={handleUpdatePoll}
            isUpdating={isUpdating}
            optionText={optionText}
            setOptionText={setOptionText}
            handleAddOption={handleAddOption}
            newOptions={newOptions}
            handleSubmitOptions={handleSubmitOptions}
            isSubmittingOptions={isSubmittingOptions}
          />
        </div>
      )}
    </div>
  );
};

export default ManagePoll;
