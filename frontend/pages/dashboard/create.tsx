import { useState } from "react";
import AppLayout from "@/components/layouts/app/AppLayout";
import PollForm from "@/components/polls/PollForm";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function CreatePollPage() {
  const [showTips, setShowTips] = useState(true);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6 px-4">
        {/* Page Title */}
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-primary">
          Create New Poll
        </h1>

        {/* Layout: Tips + Form */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border-l-4 border-primary overflow-hidden">
            {/* Collapsible Header */}
            <button
              type="button"
              onClick={() => setShowTips(!showTips)}
              className="w-full flex justify-between items-center text-left font-semibold text-primary px-4 py-3 hover:text-secondary transition"
            >
              <span>Poll Creation Tips</span>
              {showTips ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {/* Tips Content */}
            {showTips && (
              <ul className="mt-2 px-4 pb-4 text-gray-700 space-y-2 list-disc ml-4">
                <li>Provide a clear poll title that summarizes the topic.</li>
                <li>Ensure each choice is distinct and concise.</li>
                <li>
                  Set start and end dates carefully to match your schedule.
                </li>
                <li>
                  Double-check for typos or duplicate options before submitting.
                </li>
              </ul>
            )}
          </div>

          {/* Poll Form */}
          <div className="lg:col-span-2">
            <PollForm />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
