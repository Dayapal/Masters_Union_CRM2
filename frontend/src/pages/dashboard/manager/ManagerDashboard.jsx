import Sidebar from "../../../components/layout/Sidebar";

export default function AdminDashboard() {
  return (
    <div className="flex">
      <Sidebar role="manager" />

      <main className="ml-64 p-6 w-full">
        <h1 className="text-3xl font-bold">Manager Dashboard</h1>
      </main>
    </div>
  );
}
