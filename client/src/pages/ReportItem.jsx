import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, X } from "lucide-react";
import toast from "react-hot-toast";
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
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Basic client-side validation
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB");
      return;
    }

    setError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Build FormData so we can send the file alongside text fields
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (imageFile) formData.append("image", imageFile);

      const res = await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Item reported successfully");
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

        {/* Image upload */}
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-2 block">
            Photo (optional)
          </label>

          {imagePreview ? (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-200">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 hover:bg-white"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center gap-2 w-full aspect-video rounded-xl border-2 border-dashed border-gray-300 text-gray-400 cursor-pointer hover:border-gray-400 hover:text-gray-500 transition-colors">
              <ImagePlus size={28} />
              <span className="text-sm">Click to upload a photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
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