import { useRouter } from "next/router";
import Button from "@/components/common/Button";
import { ArrowLeft } from "lucide-react";
import useManagePoll from "@/hooks/useManagePolls";
import { SelectedPollProps } from "@/Interfaces/interface";

const SelectedPoll: React.FC<SelectedPollProps> = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const {
    poll,
    formData,
    handleChange,
    handleSubmitOptions,
    handleUpdatePoll,
    isUpdating,
    newOptions,
    message,
    optionText,
    setOptionText,
    handleAddOption,
    isSubmittingOptions,
  } = useManagePoll();
  return (
    <div>
      {/* Manage Selected Poll */}
      {id && poll && (
        <>
          <div className="border-t pt-4">
            {message && (
              <p
                className={`mb-4 text-center font-semibold ${
                  message.type === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {message.text}
              </p>
            )}
            <div className="flex items-center gap-12 mb-4">
              <button
                onClick={() => router.replace("/manage-poll")}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h3 className="text-lg font-semibold">Edit Poll</h3>
            </div>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block font-medium text-gray-700"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter poll title"
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="description"
                className="block font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter poll description"
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="expires_at"
                className="block font-medium text-gray-700"
              >
                Expires At
              </label>
              <input
                id="expires_at"
                type="datetime-local"
                name="expires_at"
                value={formData.expires_at || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <Button
              onClick={handleUpdatePoll}
              className="text-white bg-green-500 hover:bg-green-600 mb-4 px-4 py-2"
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Poll"}
            </Button>

            {/* Add Options Section */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-2">Add Options</h3>

              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={optionText}
                  onChange={(e) => setOptionText(e.target.value)}
                  placeholder="Enter option text"
                  className="w-full p-2 border rounded-lg"
                />
                <Button
                  onClick={handleAddOption}
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 text-white"
                >
                  Add
                </Button>
              </div>

              {newOptions.length > 0 && (
                <ul className="mb-4">
                  {newOptions.map((opt, index) => (
                    <li key={index} className="text-gray-700">
                      - {opt}
                    </li>
                  ))}
                </ul>
              )}

              <Button
                onClick={handleSubmitOptions}
                disabled={newOptions.length === 0}
                className="bg-purple-500 hover:bg-purple-600 px-4 py-2 text-white"
              >
                {isSubmittingOptions ? "Submitting..." : "Submit Options"}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SelectedPoll;
