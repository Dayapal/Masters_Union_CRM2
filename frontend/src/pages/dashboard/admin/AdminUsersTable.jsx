export default function AdminUsersTable() {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-xl font-semibold mb-4">Recent Users</h3>
      <table className="w-full text-left">
        <thead className="border-b text-gray-600">
          <tr>
            <th className="py-2">Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
          </tr>
        </thead>
      </table>
    </div>
  );
}
