export default function AdminLeadsOverview({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-gray-500 text-sm font-medium">Total Leads</h3>
        <p className="text-3xl font-bold text-blue-600 mt-2">
          {stats.leads.total}
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-gray-500 text-sm font-medium">Total Deals</h3>
        <p className="text-3xl font-bold text-indigo-600 mt-2">
          {stats.deals.total}
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-gray-500 text-sm font-medium">Won Amount</h3>
        <p className="text-3xl font-bold text-green-600 mt-2">
          ₹{stats.deals.wonAmount}
        </p>
      </div>
    </div>
  );
}
