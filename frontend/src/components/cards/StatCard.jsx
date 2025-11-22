export default function StatCard({ title, value, color }) {
  return (
    <div className="bg-white p-5 shadow rounded-xl border">
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className={`text-3xl font-bold mt-2 ${color}`}>{value}</h3>
    </div>
  );
}
