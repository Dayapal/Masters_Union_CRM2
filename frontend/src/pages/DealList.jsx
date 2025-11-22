import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDeals } from "../features/deals/dealSlice";
import { Link } from "react-router-dom";

export default function DealList() {
  const dispatch = useDispatch();
  const dealsState = useSelector(s => s.deals);

  useEffect(() => {
    dispatch(fetchDeals());
  }, [dispatch]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Deals</h2>
        <Link to="/deals/new" className="px-4 py-2 bg-blue-600 text-white rounded">New Deal</Link>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-gray-500">
              <th className="py-2">Title</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Status</th>
              <th className="py-2">Lead</th>
              <th className="py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {dealsState.deals.map(d => (
              <tr key={d.id} className="border-t">
                <td className="py-3">{d.title}</td>
                <td className="py-3">₹{d.amount}</td>
                <td className="py-3">{d.status}</td>
                <td className="py-3">{d.leadId || "—"}</td>
                <td className="py-3">
                  <Link to={`/deals/${d.id}`} className="text-blue-600 hover:underline">View</Link>
                </td>
              </tr>
            ))}
            {dealsState.deals.length === 0 && (
              <tr><td colSpan={5} className="py-4 text-center text-gray-500">No deals</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
