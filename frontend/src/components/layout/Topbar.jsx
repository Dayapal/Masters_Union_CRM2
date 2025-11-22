export default function Topbar({ title }) {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="w-full bg-white shadow p-4 flex justify-between items-center">
      <h2 className="text-xl font-bold">{title}</h2>

      <div className="flex items-center space-x-3">
        <div className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm capitalize">
          {user?.role}
        </div>
        <span className="font-medium">{user?.name}</span>
      </div>
    </div>
  );
}
