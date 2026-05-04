import { use, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getStats, getTasks } from "../api/tasks";

const COLORS = ["#6366f1", "#06b6d4", "#10b981", "#f59e0b"];

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    done: 0,
    inProgress: 0,
    overDue: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: s } = await getStats();
        setStats(s);

        const { data: tasks } = await getTasks();
        const grouped = ["todo", "in-progress", "done"].map((status) => ({
          name: status,
          count: tasks.filter((t) => t.status === status).length,
        }));
        setChartData(grouped);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const pieData = [
    { name: "Done", value: stats.done },
    { name: "In Progress", value: stats.inProgress },
    { name: "Overdue", value: stats.overDue },
    {
      name: "Todo",
      value: stats.total - stats.done - stats.inProgress - stats.overDue,
    },
  ];

  const cards = [
    {
      label: "Total Tasks",
      value: stats.total,
      color: "border-indigo-500",
      text: "text-indigo-500",
    },
    {
      label: "Completed",
      value: stats.done,
      color: "border-emerald-500",
      text: "text-emerald-500",
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      color: "border-cyan-500",
      text: "text-cyan-500",
    },
    {
      label: "Overdue",
      value: stats.overDue,
      color: "border-red-500",
      text: "text-red-500",
    },
  ];

  if (loading)
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading...</p>
      </div>
    );

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          Welcome back! Here's your task overview.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`bg-white rounded-xl p-6 border-l-4 ${c.color} shadow-sm`}
          >
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
              {c.label}
            </p>
            <p className={`text-4xl font-bold ${c.text}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-sm front-semibold text-slate-700 mb-4 uppercase tracking-wider">
            Tasks by Status
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wider">
          Completion Overview
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, value }) =>
                value > 0 ? `${name}: ${value}` : ""
              }
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
