import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const categories = ["Electronics", "Wallet", "Documents", "Clothing", "ID Card", "Other"];
const locations = ["Library", "Hostel Block A", "Academic Block", "Sports Complex", "Cafeteria"];

export default function ReportItem() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "lost",
    category: categories[0],
    location: locations[0],
    date: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/posts", form);
      navigate(`/posts/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit report");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-8 py-12">
      <h1 className="text-3xl font-extrabold mb-2">Report an Item</h1>
      <p className="text-gray-500 mb-8">
        Fill in the details below to report something lost or found.
      </p>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setForm({ ...form, type: "lost" })}
            className={`flex-1 py-3 rounded-lg font-semibold text-sm border ${
              form.type === "lost"
                ? "bg-blue-800 text-white border-blue-800"
                : "border-gray-300 text-gray-600"
            }`}
          >
            I lost something
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, type: "found" })}
            className={`flex-1 py-3 rounded-lg font-semibold text-sm border ${
              form.type === "found"
                ? "bg-blue-800 text-white border-blue-800"
                : "border-gray-300 text-gray-600"
            }`}
          >
            I found something
          </button>
        </div>

        <input
          type="text"
          name="title"
          placeholder="Title (e.g. Black Wallet)"
          value={form.title}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-3 text-sm"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="border border-gray-300 rounded-lg px-4 py-3 text-sm"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-3 text-sm"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            name="location"
            value={form.location}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-3 text-sm"
          >
            {locations.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-3 text-sm"
          required
        />

        <button className="bg-blue-800 text-white font-semibold rounded-lg px-4 py-3 hover:bg-blue-900 transition-colors">
          Submit Report
        </button>
      </form>
    </div>
  );
}