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
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

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

  const validate = () => {
    const errors = {};

    if (form.title.trim().length < 3) {
      errors.title = "Title must be at least 3 characters";
    }

    if (form.description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters";
    }

    if (!form.date) {
      errors.date = "Date is required";
    } else {
      const selectedDate = new Date(form.date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (selectedDate > today) {
        errors.date = "Date cannot be in the future";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    try {
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
    <div className="max-w-2xl mx-auto px-4 sm:px-8 py-12">
      <h1 className="text-3xl font-extrabold mb-2">Report an Item</h1>
      <p className="text-gray-500 mb-8">
        Fill in the details below to report something lost or found.
      </p>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
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

        {/* Title */}
        <div>
          <input
            type="text"
            name="title"
            placeholder="Title (e.g. Black Wallet)"
            value={form.title}
            onChange={handleChange}
            className={`border rounded-lg px-4 py-3 text-sm w-full ${
              fieldErrors.title ? "border-red-400" : "border-gray-300"
            }`}
          />
          {fieldErrors.title && (
            <p className="text-red-600 text-xs mt-1">{fieldErrors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className={`border rounded-lg px-4 py-3 text-sm w-full ${
              fieldErrors.description ? "border-red-400" : "border-gray-300"
            }`}
          />
          {fieldErrors.description && (
            <p className="text-red-600 text-xs mt-1">{fieldErrors.description}</p>
          )}
        </div>

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

        {/* Date */}
        <div>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className={`border rounded-lg px-4 py-3 text-sm w-full ${
              fieldErrors.date ? "border-red-400" : "border-gray-300"
            }`}
          />
          {fieldErrors.date && (
            <p className="text-red-600 text-xs mt-1">{fieldErrors.date}</p>
          )}
        </div>

        <button className="bg-blue-800 text-white font-semibold rounded-lg px-4 py-3 hover:bg-blue-900 transition-colors">
          Submit Report
        </button>
      </form>
    </div>
  );
}