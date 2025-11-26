import AppLayout from "@/components/layouts/app/AppLayout";

export default function AdminDashboard() {
  return (
    <AppLayout>
      <h1 className="text-2xl font-bold mb-4">Welcome Admin</h1>
      <p className="text-gray-700">
        Use the sidebar to manage polls, create new polls, and view results.
      </p>
    </AppLayout>
  );
}
