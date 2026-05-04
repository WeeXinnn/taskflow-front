import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createTask, updateTask, getTask } from "../api/tasks";

export default function TaskForm() {
  const { id } = useParams(); // Get task ID from URL params
  const isEdit = Boolean(id);
  const navigate = useNavigate(); // For navigation after form submission

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      getTask(id).then(({ data }) => {
        setForm({
          title: data.title,
          description: data.description || "",
          status: data.status,
          priority: data.priority,
          dueDate: data.dueDate ? data.dueDate.split("T")[0] : "",
        });
      });
    }
  }, [id]);

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    setLoading(true);

    try {
      if (isEdit) await updateTask(id, form);
      else await createTask(form);
      navigate("/tasks");
    } catch (err) {
      setError("An error occurred while saving the task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          {isEdit ? "Edit Task" : "New Task"}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {isEdit
            ? "Update the task details below"
            : "Fill in the details to create a new task"}
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        {error && (
          <div
            className="mb-4 px-4 py-3 bg-red-50 border border-red-200
            text-red-600 rounded-lg text-sm"
          >
            {error}
          </div>
        )}

        {/* Title */}
        <div className="mb-4">
          <label
            className="block text-xs font-semibold text-slate-500 
            uppercase tracking-wider mb-1.5"
          >
            Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter task title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm
              text-slate-700 focus:outline-none focus:border-indigo-400 transition-colors"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label
            className="block text-xs font-semibold text-slate-500 
            uppercase tracking-wider mb-1.5"
          >
            Description
          </label>
          <textarea
            placeholder="Enter task description (optional)"
            value={form.description}
            rows={3}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm
              text-slate-700 focus:outline-none focus:border-indigo-400 
              transition-colors resize-none"
          />
        </div>

        {/* Status + Priority side by side */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label
              className="block text-xs font-semibold text-slate-500 
              uppercase tracking-wider mb-1.5"
            >
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm
                text-slate-700 focus:outline-none focus:border-indigo-400 transition-colors"
            >
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div>
            <label
              className="block text-xs font-semibold text-slate-500 
              uppercase tracking-wider mb-1.5"
            >
              Priority
            </label>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm
                text-slate-700 focus:outline-none focus:border-indigo-400 transition-colors"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Due Date */}
        <div className="mb-6">
          <label
            className="block text-xs font-semibold text-slate-500 
            uppercase tracking-wider mb-1.5"
          >
            Due Date
          </label>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm
              text-slate-700 focus:outline-none focus:border-indigo-400 transition-colors"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-300
              text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-all"
          >
            {loading ? "Saving..." : isEdit ? "Update Task" : "Create Task"}
          </button>
          <button
            onClick={() => navigate("/tasks")}
            className="border border-slate-200 text-slate-600 hover:border-slate-300
              font-medium text-sm px-6 py-2.5 rounded-lg transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
