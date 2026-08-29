import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MapPin, Calendar, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const statusFlow = ["lost", "found", "claimed", "recovered"];

const statusColors = {
  lost: "bg-red-50 text-red-700",
  found: "bg-emerald-50 text-emerald-700",
  claimed: "bg-amber-50 text-amber-700",
  recovered: "bg-gray-100 text-gray-600",
};

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    api
      .get(`/posts/${id}`)
      .then((res) => setPost(res.data))
      .catch(() => setError("Post not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const isOwner = user && post && post.postedBy?._id === user._id;

const handleStatusChange = async (newStatus) => {
  setUpdating(true);
  try {
    const res = await api.patch(`/posts/${id}/status`, { status: newStatus });
    setPost(res.data);
  } catch (err) {
    alert(err.response?.data?.message || "Failed to update status");
  } finally {
    setUpdating(false);
  }
};

  if (loading) return <p className="max-w-3xl mx-auto px-8 py-12 text-gray-400">Loading...</p>;
  if (error) return <p className="max-w-3xl mx-auto px-8 py-12 text-red-600">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto px-8 py-12">
      <div className="aspect-video bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
        {post.image ? (
          <img src={post.image} alt={post.title} className="w-full h-full object-cover rounded-2xl" />
        ) : (
          <span className="text-gray-400 text-sm">No image</span>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-extrabold">{post.title}</h1>
        <span
          className={`text-xs font-semibold px-3 py-1.5 rounded-full capitalize ${
            statusColors[post.status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {post.status}
        </span>
      </div>

      <p className="text-gray-600 mb-6">{post.description}</p>

      <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-8">
        <span className="flex items-center gap-1.5">
          <MapPin size={14} /> {post.location}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar size={14} /> {new Date(post.date).toLocaleDateString()}
        </span>
        <span className="flex items-center gap-1.5">
          <User size={14} /> Posted by {post.postedBy?.name || "Unknown"}
        </span>
      </div>

      {isOwner ? (
        <div className="border border-gray-200 rounded-2xl p-5 mb-6">
          <label className="text-xs font-semibold text-gray-500 mb-2 block">
            Update status
          </label>
          <select
            value={post.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={updating}
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm capitalize"
          >
            {statusFlow.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-2">
            Only you can update the status of your own post.
          </p>
        </div>
      ) : (
        <button className="bg-blue-800 text-white font-semibold rounded-lg px-5 py-3 hover:bg-blue-900 transition-colors">
          Contact {post.postedBy?.name || "poster"}
        </button>
      )}
    </div>
  );
}