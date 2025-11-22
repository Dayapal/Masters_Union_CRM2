// small reusable stat card
export default function StatCard({ title, value, delta, sub }) {
  return (
    <div className="bg-white rounded-xl shadow border p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className="text-right">
          <div className={`text-sm font-medium ${delta >= 0 ? "text-green-600" : "text-red-600"}`}>
            {delta >= 0 ? `+${delta}%` : `${delta}%`}
          </div>
          {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
        </div>
      </div>
    </div>
  );
}
