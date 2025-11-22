export default function RecentActivityTable({ activities }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 border">Type</th>
            <th className="p-3 border">Subject</th>
            <th className="p-3 border">Date</th>
          </tr>
        </thead>

        <tbody>
          {activities?.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center p-4 text-gray-500">
                No activity yet.
              </td>
            </tr>
          )}

          {activities?.map((a) => (
            <tr key={a.id} className="hover:bg-gray-50">
              <td className="p-3 border capitalize">{a.type}</td>
              <td className="p-3 border">{a.subject}</td>
              <td className="p-3 border">
                {new Date(a.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
