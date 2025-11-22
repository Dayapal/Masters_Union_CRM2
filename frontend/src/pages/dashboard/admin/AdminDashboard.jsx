import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "../../../features/dashboard/dashboardSlice";

import Sidebar from "../../../components/layout/Sidebar";
import AdminLeadsOverview from "./AdminLeadsOverview";
import AdminChart from "./AdminChart";
import AdminUsersTable from "./AdminUsersTable";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.dashboard);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchDashboardStats(user.id));
    }
  }, [user]);

  return (
    <div className="flex">
      <Sidebar role="admin" />

      <main className="ml-64 p-6 w-full">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {loading && <p>Loading dashboard...</p>}

        {stats && (
          <>
            <AdminLeadsOverview stats={stats} />
            <AdminChart stats={stats} />
            <AdminUsersTable />
          </>
        )}
      </main>
    </div>
  );
}
