import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import {
  fetchTaskById,
  updateTask,
  completeTask,
  reassignTask,
  addTaskNote,
} from "../../features/tasks/taskSlice";

import { fetchTaskActivity } from "../../features/activity/activitySlice";

export default function TaskDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { task, loading } = useSelector((state) => state.tasks);
  const { activity } = useSelector((state) => state.activity);
  const { users } = useSelector((state) => state.auth);

  const [note, setNote] = useState("");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    dispatch(fetchTaskById(id));
    dispatch(fetchTaskActivity(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (task) {
      setAssignee(task.assigneeId || "");
      setDueDate(task.dueDate?.slice(0, 10) || "");
    }
  }, [task]);

  const handleUpdateTask = () => {
    dispatch(
      updateTask({
        id,
        data: { dueDate },
      })
    );
  };

  const handleReassign = () => {
    dispatch(
      reassignTask({
        id,
        data: { assigneeId: assignee },
      })
    );
  };

  const handleComplete = () => {
    dispatch(completeTask(id));
  };

  const handleAddNote = () => {
    dispatch(
      addTaskNote({
        id,
        data: { content: note, authorId: 1 },
      })
    );
    setNote("");
    dispatch(fetchTaskActivity(id));
  };

  if (loading || !task) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-2">{task.title}</h1>
      <p className="text-gray-600 mb-4">
        Lead: {task.lead?.name} • Task ID #{task.id}
      </p>

      {/* MAIN CARD */}
      <div className="bg-white rounded-xl shadow p-6 border mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Due Date */}
          <div>
            <label className="font-semibold text-gray-700">Due Date</label>
            <div className="flex gap-3 mt-2">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="border px-4 py-2 rounded-lg w-full"
              />
              <button
                onClick={handleUpdateTask}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Update
              </button>
            </div>
          </div>

          {/* Assign User */}
          <div>
            <label className="font-semibold text-gray-700">Assign To</label>
            <div className="flex gap-3 mt-2">
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="border px-4 py-2 rounded-lg w-full"
              >
                <option value="">Select user</option>
                {users?.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>

              <button
                onClick={handleReassign}
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Assign
              </button>
            </div>
          </div>
        </div>

        {/* Mark Complete */}
        <div className="mt-6">
          <button
            onClick={handleComplete}
            className={`px-6 py-2 rounded-lg text-white ${
              task.completed ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600"
            }`}
            disabled={task.completed}
          >
            {task.completed ? "Completed" : "Mark as Complete"}
          </button>
        </div>
      </div>

      {/* ADD NOTE */}
      <div className="bg-white rounded-xl shadow p-6 border mb-8">
        <h3 className="text-xl font-bold mb-4">Add Note</h3>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full p-4 border rounded-lg"
          placeholder="Write task note..."
        />

        <button
          onClick={handleAddNote}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Add Note
        </button>
      </div>

      {/* ACTIVITY TIMELINE */}
      <div className="bg-white rounded-xl shadow p-6 border">
        <h3 className="text-xl font-bold mb-4">Task Activity Timeline</h3>

        {activity?.length === 0 ? (
          <p className="text-gray-500">No activity added yet.</p>
        ) : (
          <ul className="space-y-4">
            {activity.map((act) => (
              <li key={act.id} className="pb-3 border-b last:border-none">
                <div className="flex gap-4">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full ${
                      act.type === "note"
                        ? "bg-blue-100 text-blue-600"
                        : act.type === "task_update"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-purple-100 text-purple-600"
                    }`}
                  >
                    {act.type === "note" ? "📝" : act.type === "task_update" ? "⚙️" : "📌"}
                  </div>

                  <div>
                    <p className="font-semibold">{act.subject}</p>
                    {act.note && (
                      <p className="text-gray-600 mt-1">{act.note}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(act.createdAt).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      By: {act.author?.name}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
