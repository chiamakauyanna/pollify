import AppLayout from "@/components/layouts/app/AppLayout";
import PollForm from "@/components/polls/PollForm";

export default function CreatePollPage() {
  return (
    <AppLayout>
      <h1 className="text-3xl font-bold mb-6">Create New Poll</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <PollForm />
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-2">Tips</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Provide a clear poll title.</li>
            <li>Ensure choices are distinct.</li>
            <li>Set start and end dates carefully.</li>
            <li>Enable "Show Results" if you want voters to see them.</li>
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}
