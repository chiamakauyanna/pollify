import AppLayout from "@/components/layouts/app/AppLayout";
import PollForm from "@/pages/polls/components/PollForm";

export default function CreatePollPage() {
  return (
    <AppLayout>
      <h1 className="text-2xl font-bold mb-4">Create New Poll</h1>
      <PollForm />
    </AppLayout>
  );
}
