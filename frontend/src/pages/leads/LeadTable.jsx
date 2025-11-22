import { Link } from "react-router-dom";

export default function LeadTable({ leads }) {
  if (!leads || leads.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 border rounded-xl bg-white shadow">
        No leads found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow border">
      <table className="w-full text-left">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="p-4 font-semibold">Name</th>
            <th className="p-4 font-semibold">Email</th>
            <th className="p-4 font-semibold">Phone</th>
            <th className="p-4 font-semibold">Status</th>
            <th className="p-4 font-semibold">Value</th>
            <th className="p-4 font-semibold">Owner</th>
            <th className="p-4 font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b hover:bg-gray-50">
              <td className="p-4">{lead.name}</td>
              <td className="p-4">{lead.email || "-"}</td>
              <td className="p-4">{lead.phone || "-"}</td>

              <td className="p-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium
                  ${
                    lead.status === "new"
                      ? "bg-blue-100 text-blue-700"
                      : lead.status === "qualified"
                      ? "bg-green-100 text-green-700"
                      : lead.status === "won"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-200 text-gray-700"
                  }
                `}>
                  {lead.status}
                </span>
              </td>

              <td className="p-4">₹{lead.value || 0}</td>

              <td className="p-4">{lead.owner?.name || "—"}</td>

              <td className="p-4">
                <Link
                  to={`/leads/${lead.id}`}
                  className="text-blue-600 hover:underline mr-4"
                >
                  View
                </Link>

                <Link
                  to={`/leads/${lead.id}/edit`}
                  className="text-yellow-600 hover:underline"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
