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

export default function AdminChart() {
  // Dummy data — later we will replace with API data
  const leadsData = [
    { month: "Jan", leads: 45 },
    { month: "Feb", leads: 60 },
    { month: "Mar", leads: 80 },
    { month: "Apr", leads: 50 },
    { month: "May", leads: 95 },
  ];

  const dealsData = [
    { name: "Won", value: 40 },
    { name: "Lost", value: 20 },
  ];

  const COLORS = ["#4F46E5", "#EF4444"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
      {/* ---------- Leads Bar Chart ---------- */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">Leads Overview</h3>

        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={leadsData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="leads" fill="#6366F1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ---------- Deals Pie Chart ---------- */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">Deals Performance</h3>

        <div className="w-full h-64 flex justify-center">
          <ResponsiveContainer width="80%" height="100%">
            <PieChart>
              <Pie
                data={dealsData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
                dataKey="value"
              >
                {dealsData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
