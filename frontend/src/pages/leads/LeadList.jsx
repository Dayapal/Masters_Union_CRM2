import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { fetchLeads } from "../features/leads/leadSlice";
import { fetchLeads } from "../../features/leads/leadSlice";
import { Link } from "react-router-dom";

export default function LeadList() {
  const dispatch = useDispatch();
  const leadsState = useSelector(s => s.leads);

  useEffect(() => {
    dispatch(fetchLeads());
  }, [dispatch]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Leads</h2>
        <Link to="/leads/new" className="px-4 py-2 bg-blue-600 text-white rounded">New Lead</Link>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-gray-500">
              <th className="py-2">Title</th>
              <th className="py-2">Name</th>
              <th className="py-2">Owner</th>
              <th className="py-2">Status</th>
              <th className="py-2">Value</th>
              <th className="py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {leadsState.leads.map(l => (
              <tr key={l.id} className="border-t">
                <td className="py-3">{l.title}</td>
                <td className="py-3">{l.name}</td>
                <td className="py-3">{l.owner?.name || "—"}</td>
                <td className="py-3">{l.status}</td>
                <td className="py-3">₹{l.value ?? 0}</td>
                <td className="py-3">
                  <Link to={`/leads/${l.id}`} className="text-blue-600 hover:underline">View</Link>
                </td>
              </tr>
            ))}
            {leadsState.leads.length === 0 && (
              <tr><td colSpan={6} className="py-4 text-center text-gray-500">No leads</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
