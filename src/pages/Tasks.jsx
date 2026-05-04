import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks, deleteTask } from "../api/tasks";

const statusStyles = {
  todo: "bg-slate-100 text-slate-600",
  "in-progress": "bg-cyan-100 text-cyan-700",
  done: "bg-emerald-100 text-emerald-700",
};

const priorityStyles = {
  low: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load tasks on component mount and when search/statusFilter changes
  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getTasks({ search, status: statusFilter });
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [search, statusFilter]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id);
        load();
      } catch (err) {
        console.error("Delete error:", err.response?.data || err.message);
      }
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tasks</h1>
          <p className="text-slate-500 text-sm mt-1">
            {tasks.length} tasks found
          </p>
        </div>
        <button
          onClick={() => navigate("/tasks/new")}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm 
            font-semibold px-4 py-2.5 rounded-lg transition-all"
        >
          + New Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white border border-slate-200 text-slate-700 text-sm
            rounded-lg px-4 py-2.5 w-64 focus:outline-none focus:border-indigo-400"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-slate-200 text-slate-700 text-sm
            rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-400"
        >
          <option value="">All Status</option>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Title", "Status", "Priority", "Due Date", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3.5 text-xs font-semibold 
                    text-slate-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, i) => (
                <tr
                  key={task._id}
                  className={`border-b border-slate-50 hover:bg-slate-50 transition-colors
                    ${i % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`}
                >
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-800 text-sm">
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-slate-400 text-xs mt-0.5 truncate max-w-xs">
                        {task.description}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full
                      ${statusStyles[task.status]}`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full
                      ${priorityStyles[task.priority]}`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-500">
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString("en-MY", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/tasks/${task._id}/edit`)}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg border 
                          border-slate-200 text-slate-600 hover:border-indigo-400 
                          hover:text-indigo-600 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg border
                          border-slate-200 text-red-400 hover:border-red-400
                          hover:bg-red-50 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <p className="text-slate-400 text-sm">No tasks found</p>
                    <button
                      onClick={() => navigate("/tasks/new")}
                      className="mt-3 text-indigo-500 text-sm font-medium hover:underline"
                    >
                      Create your first task →
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
