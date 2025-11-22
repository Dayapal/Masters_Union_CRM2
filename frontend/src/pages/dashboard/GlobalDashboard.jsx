import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "../../../features/dashboard/dashboardSlice";

import AreaLeadsChart from "./AreaLeadsChart";
import DealPieChart from "./DealPieChart";
import RecentActivityTable from "./RecentActivityTable";

export default function GlobalDashboard() {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="text-center py-10 text-lg font-semibold text-blue-600">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* HEADER */}
      <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
        Global Dashboard Analytics
      </h1>

      {/* TOP METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-white shadow border">
          <h3 className="text-gray-600">Total Leads</h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats?.totalLeads || 0}
          </p>
        </div>

        <div className="p-6 rounded-xl bg-white shadow border">
          <h3 className="text-gray-600">Total Deals</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {stats?.totalDeals || 0}
          </p>
        </div>

        <div className="p-6 rounded-xl bg-white shadow border">
          <h3 className="text-gray-600">Revenue (Won Deals)</h3>
          <p className="text-3xl font-bold text-green-600">
            ₹ {stats?.wonAmount || 0}
          </p>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white shadow rounded-xl p-6 border">
          <AreaLeadsChart data={stats?.leadsChart || []} />
        </div>

        <div className="bg-white shadow rounded-xl p-6 border">
          <DealPieChart data={stats?.dealStats || []} />
        </div>
      </div>

      {/* ACTIVITY TABLE */}
      <div className="bg-white shadow rounded-xl p-6 border">
        <RecentActivityTable activities={stats?.recentActivities || []} />
      </div>
    </div>
  );
}
