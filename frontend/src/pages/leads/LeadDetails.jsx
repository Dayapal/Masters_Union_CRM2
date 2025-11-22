import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  fetchLeadById,
  assignLead,
  updateLeadStatus,
  addLeadNote,
} from "../../features/leads/leadSlice";
import { fetchLeadActivity } from "../../features/activity/activitySlice";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function LeadDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { lead, loading } = useSelector((state) => state.leads);
  const { activity } = useSelector((state) => state.activity);
  const { users } = useSelector((state) => state.auth);

  const [noteText, setNoteText] = useState("");
  const [status, setStatus] = useState("");
  const [ownerId, setOwnerId] = useState("");

  useEffect(() => {
    dispatch(fetchLeadById(id));
    dispatch(fetchLeadActivity(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (lead) {
      setStatus(lead.status);
      setOwnerId(lead.ownerId || "");
    }
  }, [lead]);

  const handleAddNote = async () => {
    if (!noteText.trim()) return;

    await dispatch(
      addLeadNote({ id, data: { content: noteText, authorId: 1 } })
    );

    setNoteText("");
    dispatch(fetchLeadActivity(id));
  };

  const handleStatusChange = async () => {
    await dispatch(
      updateLeadStatus({
        id,
        data: { status, changedById: 1 },
      })
    );
    dispatch(fetchLeadActivity(id));
  };

  const handleAssign = async () => {
    await dispatch(assignLead({ id, data: { ownerId } }));
    dispatch(fetchLeadById(id));
  };

  if (loading || !lead) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Title + Client */}
      <h1 className="text-3xl font-bold mb-2">{lead.title}</h1>
      <p className="text-gray-600 text-lg mb-6">
        {lead.name} • {lead.email} • {lead.phone}
      </p>

      {/* Lead Info Card */}
      <div className="bg-white rounded-xl border p-6 shadow mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status */}
          <div>
            <label className="font-semibold text-gray-700">Lead Status</label>
            <div className="flex gap-3 mt-2">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-4 py-2 rounded-lg border w-full"
              >
                {[
                  "new",
                  "contacted",
                  "qualified",
                  "proposal",
                  "won",
                  "lost",
                ].map((s) => (
                  <option key={s} value={s}>
                    {s.toUpperCase()}
                  </option>
                ))}
              </select>
              <button
                onClick={handleStatusChange}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Update
              </button>
            </div>
          </div>

          {/* Assign Lead */}
          <div>
            <label className="font-semibold text-gray-700">
              Assign To User
            </label>
            <div className="flex gap-3 mt-2">
              <select
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
                className="px-4 py-2 rounded-lg border w-full"
              >
                <option value="">Select User</option>
                {users?.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
              <button
                onClick={handleAssign}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="bg-white rounded-xl border p-6 shadow mb-8">
        <h3 className="text-xl font-bold mb-4">Add Note</h3>

        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          className="w-full p-4 border rounded-lg"
          placeholder="Write a note..."
        />

        <button
          onClick={handleAddNote}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Add Note
        </button>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-xl border p-6 shadow">
        <h3 className="text-xl font-bold mb-4">Activity Timeline</h3>

        {activity?.length === 0 ? (
          <p className="text-gray-500">No activity yet.</p>
        ) : (
          <ul className="space-y-4">
            {activity.map((act) => (
              <li
                key={act.id}
                className="border-b pb-3 last:border-none flex gap-4"
              >
                {/* Icon */}
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full ${
                    act.type === "note"
                      ? "bg-blue-100 text-blue-600"
                      : act.type === "status_change"
                      ? "bg-green-100 text-green-600"
                      : "bg-purple-100 text-purple-600"
                  }`}
                >
                  {act.type === "note" ? "📝" : act.type === "status_change" ? "🔄" : "📌"}
                </div>

                {/* Content */}
                <div>
                  <p className="font-semibold">{act.subject}</p>
                  {act.note && (
                    <p className="text-gray-600 mt-1">{act.note}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(act.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    By: {act.author?.name}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
