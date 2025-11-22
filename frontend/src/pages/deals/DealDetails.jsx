import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";

/**
 * Expected redux actions (implement in features/deals/dealSlice.js):
 * - fetchDealById(id)
 * - updateDeal({ id, data })
 * - changeDealStatus({ id, status, authorId })
 * - addDealNote({ id, data })
 *
 * Expected activity slice action:
 * - fetchDealActivity(id)
 *
 * If your slice names differ, rename imports accordingly.
 */

import {
  fetchDealById,
  updateDeal,
  changeDealStatus,
  addDealNote,
} from "../../features/deals/dealSlice";
import { fetchDealActivity } from "../../features/activity/activitySlice";

export default function DealDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { deal, loading } = useSelector((state) => state.deals);
  const { activity } = useSelector((state) => state.activity);
  const { users } = useSelector((state) => state.auth); // for potential reassignment

  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [noteText, setNoteText] = useState("");
  const [assigneeId, setAssigneeId] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(fetchDealById(id));
      dispatch(fetchDealActivity(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (deal) {
      setAmount(deal.amount ?? "");
      setStatus(deal.status ?? "open");
      setAssigneeId(deal.ownerId ?? ""); // if your deal model has ownerId
    }
  }, [deal]);

  const handleUpdateDeal = async () => {
    if (!deal) return;
    await dispatch(updateDeal({ id, data: { amount: Number(amount) } }));
    dispatch(fetchDealById(id));
  };

  const handleChangeStatus = async (newStatus) => {
    // newStatus e.g. "won" or "lost" or "open"
    await dispatch(changeDealStatus({ id, status: newStatus, authorId: 1 }));
    // refresh deal & activity
    dispatch(fetchDealById(id));
    dispatch(fetchDealActivity(id));
    if (newStatus === "won") {
      // optional: navigate to invoice or similar
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    await dispatch(addDealNote({ id, data: { content: noteText, authorId: 1 } }));
    setNoteText("");
    dispatch(fetchDealActivity(id));
  };

  const handleReassign = async () => {
    if (!assigneeId) return;
    await dispatch(updateDeal({ id, data: { ownerId: Number(assigneeId) } }));
    dispatch(fetchDealById(id));
  };

  if (loading || !deal) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{deal.title || `Deal #${deal.id}`}</h1>
          <p className="text-gray-600 mt-1">
            Lead:{" "}
            {deal.lead ? (
              <Link to={`/leads/${deal.lead.id}`} className="text-blue-600 hover:underline">
                {deal.lead.title || deal.lead.name}
              </Link>
            ) : (
              "—"
            )}
          </p>
        </div>

        <div className="space-x-2">
          <button
            onClick={() => handleChangeStatus("won")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
          >
            Mark Won
          </button>
          <button
            onClick={() => handleChangeStatus("lost")}
            className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700"
          >
            Mark Lost
          </button>
        </div>
      </div>

      {/* Deal Card */}
      <div className="bg-white rounded-xl border p-6 shadow mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Amount */}
          <div>
            <label className="text-sm font-medium text-gray-700">Amount (₹)</label>
            <div className="flex gap-3 mt-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="px-4 py-2 border rounded-lg w-full"
              />
              <button
                onClick={handleUpdateDeal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Update
              </button>
            </div>
          </div>

          {/* Status & Owner */}
          <div>
            <label className="text-sm font-medium text-gray-700">Status</label>
            <div className="flex items-center gap-3 mt-2">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="open">Open</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
              <button
                onClick={() => handleChangeStatus(status)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Save Status
              </button>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700">Owner</label>
              <div className="flex gap-3 mt-2">
                <select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="px-4 py-2 border rounded-lg w-full"
                >
                  <option value="">Select owner</option>
                  {users?.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
                <button onClick={handleReassign} className="px-4 py-2 bg-green-600 text-white rounded-lg">
                  Reassign
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Meta */}
        <div className="mt-6 text-sm text-gray-500">
          <div>Created: {new Date(deal.createdAt).toLocaleString()}</div>
          {deal.updatedAt && <div>Updated: {new Date(deal.updatedAt).toLocaleString()}</div>}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-xl border p-6 shadow mb-8">
        <h3 className="text-xl font-bold mb-3">Add Note</h3>

        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          className="w-full p-4 border rounded-lg"
          placeholder="Write a note about this deal..."
        />

        <div className="flex justify-end mt-3">
          <button
            onClick={handleAddNote}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Add Note
          </button>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-xl border p-6 shadow">
        <h3 className="text-xl font-bold mb-4">Activity Timeline</h3>

        {(!activity || activity.length === 0) ? (
          <p className="text-gray-500">No activity yet.</p>
        ) : (
          <ul className="space-y-4">
            {activity.map((act) => (
              <li key={act.id} className="flex gap-4 border-b pb-3 last:border-none">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full ${
                    act.type === "note"
                      ? "bg-blue-100 text-blue-600"
                      : act.type === "status_change"
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {act.type === "note" ? "📝" : act.type === "status_change" ? "🔁" : "📌"}
                </div>

                <div>
                  <p className="font-semibold">{act.subject}</p>
                  {act.note && <p className="text-gray-600 mt-1">{act.note}</p>}
                  <p className="text-xs text-gray-500 mt-1">{new Date(act.createdAt).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">By: {act.author?.name}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-lg border"
        >
          Back
        </button>

        <Link
          to={`/deals/${id}/edit`}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
        >
          Edit Deal
        </Link>
      </div>
    </div>
  );
}
