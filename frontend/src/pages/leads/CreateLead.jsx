import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createLead, fetchLeads } from "../../features/leads/leadSlice";
import { fetchUsers } from "../../features/auth/authslice";
import { useNavigate } from "react-router-dom";

export default function CreateLead() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.leads);
  const { users } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    title: "",
    name: "",
    email: "",
    phone: "",
    source: "",
    value: "",
    status: "new",
    ownerId: "",
  });

  useEffect(() => {
    dispatch(fetchUsers()); // to get list of sales users for assignment
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await dispatch(createLead(form));

    if (res?.payload?.id) {
      navigate("/leads");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Lead</h1>

      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Title */}
          <div>
            <label className="block mb-1 font-medium">Lead Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border"
              placeholder="Website Development Project"
              required
            />
          </div>

          {/* Name */}
          <div>
            <label className="block mb-1 font-medium">Client Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border"
              placeholder="John Doe"
              required
            />
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border"
                placeholder="client@example.com"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border"
                placeholder="+91 9876543210"
              />
            </div>
          </div>

          {/* Source + Value */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Lead Source</label>
              <input
                type="text"
                name="source"
                value={form.source}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border"
                placeholder="Website, LinkedIn, Referral"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Lead Value (₹)</label>
              <input
                type="number"
                name="value"
                value={form.value}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border"
                placeholder="50000"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block mb-1 font-medium">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          {/* Owner */}
          <div>
            <label className="block mb-1 font-medium">Assign To</label>
            <select
              name="ownerId"
              value={form.ownerId}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border"
              required
            >
              <option value="">Select User</option>
              {users &&
                users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {loading ? "Creating Lead..." : "Create Lead"}
          </button>
        </form>
      </div>
    </div>
  );
}
