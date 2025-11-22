import { Link, useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-white shadow border-r p-4 h-screen">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

      <nav className="space-y-3">
        <Link
          to="/admin/dashboard"
          className="block hover:bg-gray-100 px-3 py-2 rounded cursor-pointer"
        >
          Dashboard
        </Link>

        <Link
          to="/admin/users"
          className="block hover:bg-gray-100 px-3 py-2 rounded cursor-pointer"
        >
          Users
        </Link>

        <Link
          to="/admin/leads"
          className="block hover:bg-gray-100 px-3 py-2 rounded cursor-pointer"
        >
          Leads
        </Link>

        <Link
          to="/admin/deals"
          className="block hover:bg-gray-100 px-3 py-2 rounded cursor-pointer"
        >
          Deals
        </Link>

        <button
          onClick={handleLogout}
          className="w-full text-left hover:bg-gray-100 px-3 py-2 rounded cursor-pointer text-red-600"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}
