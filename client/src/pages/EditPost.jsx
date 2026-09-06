import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

const categories = ["Electronics", "Wallet", "Documents", "Clothing", "ID Card", "Other"];
const locations = ["Library", "Hostel Block A", "Academic Block", "Sports Complex", "Cafeteria"];

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/posts/${id}`)
      .then((res) => {
        const post = res.data;
        setForm({
          title: post.title,
          description: post.description,
          type: post.type,
          category: post.category,
          location: post.location,
          date: post.date ? post.date.slice(0, 10) : "",
        });
      })
      .catch(() => setError("Post not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.put(`/posts/${id}`, form);
      toast.success("Post updated");
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update post");
    }
  };

  const inputClass =
    "border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-4 py-3 text-sm w-full";

  if (loading)
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-gray-900">
        <p className="max-w-2xl mx-auto px-4 sm:px-8 py-12 text-gray-400 dark:text-gray-500">
          Loading...
        </p>
      </div>
    );

  if (!form)
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-gray-900">
        <p className="max-w-2xl mx-auto px-4 sm:px-8 py-12 text-red-600 dark:text-red-400">
          {error}
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-8 py-12">
        <h1 className="text-3xl font-extrabold mb-2 dark:text-gray-100">Edit Post</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Update the details of your report.</p>

        {error && <p className="text-red-600 dark:text-red-400 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className={inputClass}
            required
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className={inputClass}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select name="location" value={form.location} onChange={handleChange} className={inputClass}>
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
            className={inputClass}
            required
          />

          <button className="bg-blue-800 text-white font-semibold rounded-lg px-4 py-3 hover:bg-blue-900 transition-colors">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}