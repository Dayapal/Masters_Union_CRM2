import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../features/tasks/taskSlice";

export default function TaskList() {
  const dispatch = useDispatch();
  const tasksState = useSelector(s => s.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Tasks</h2>
        {/* add create task link/modal later */}
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <ul className="space-y-3">
          {tasksState.tasks.map(t => (
            <li key={t.id} className="flex justify-between items-center border-b pb-2">
              <div>
                <div className="font-medium">{t.title}</div>
                <div className="text-sm text-gray-500">Lead: {t.leadId} • Due: {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "—"}</div>
              </div>
              <div className="text-sm">
                <span className={`px-2 py-1 rounded ${t.completed ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {t.completed ? "Completed" : "Open"}
                </span>
              </div>
            </li>
          ))}
          {tasksState.tasks.length===0 && <li className="text-gray-500">No tasks</li>}
        </ul>
      </div>
    </div>
  );
}
