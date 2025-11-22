import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authslice";

import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Briefcase,
  BarChart3,
  LogOut,
} from "lucide-react";

const menus = {
  admin: [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin-dashboard" },
    { name: "Users", icon: <Users size={20} />, path: "/users" },
    { name: "Leads", icon: <ClipboardList size={20} />, path: "/leads" },
    { name: "Deals", icon: <Briefcase size={20} />, path: "/deals" },
    { name: "Analytics", icon: <BarChart3 size={20} />, path: "/analytics" },
  ],

  manager: [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/manager-dashboard" },
    { name: "Team Leads", icon: <ClipboardList size={20} />, path: "/leads" },
    { name: "Deals", icon: <Briefcase size={20} />, path: "/deals" },
  ],

  sales: [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/sales-dashboard" },
    { name: "My Leads", icon: <ClipboardList size={20} />, path: "/leads" },
    { name: "My Deals", icon: <Briefcase size={20} />, path: "/deals" },
  ],
};

export default function Sidebar({ role }) {
  const items = menus[role] || [];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r shadow-sm p-4 fixed">
      <h2 className="text-2xl font-bold mb-8 bg-linear-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
        CRM Panel
      </h2>

      <nav className="space-y-2">
        {items.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
              transition-all font-medium 
              ${isActive ? "bg-blue-600 text-white shadow-sm" : "text-gray-700 hover:bg-gray-100"}`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}

        {/* Logout Button */}
        <div className="mt-6 pt-6 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 font-medium hover:bg-red-50 transition-all"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </nav>
    </aside>
  );
}
