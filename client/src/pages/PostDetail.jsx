import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Calendar, User } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const statusFlow = ["lost", "found", "claimed", "recovered"];

const statusColors = {
  lost: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  found: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  claimed: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  recovered: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

export default function PostDetail() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
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
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-gray-900">
        <p className="max-w-3xl mx-auto px-4 sm:px-8 py-12 text-gray-400 dark:text-gray-500">
          Loading...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-gray-900">
        <p className="max-w-3xl mx-auto px-4 sm:px-8 py-12 text-red-600 dark:text-red-400">
          {error}
        </p>
      </div>
    );

  const posterFirstName = post.postedBy?.name?.split(" ")[0] || "them";
  const emailSubject = encodeURIComponent(`About your ${post.type} item: ${post.title}`);
  const mailtoLink = `mailto:${post.postedBy?.email || ""}?subject=${emailSubject}`;
  const telLink = `tel:${post.postedBy?.phone || ""}`;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-12">
        <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-6">
          {post.image ? (
            <img src={post.image} alt={post.title} className="w-full h-full object-cover rounded-2xl" />
          ) : (
            <span className="text-gray-400 dark:text-gray-500 text-sm">No image</span>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-extrabold dark:text-gray-100">{post.title}</h1>
          <span
            className={`text-xs font-semibold px-3 py-1.5 rounded-full capitalize ${
              statusColors[post.status] || "bg-gray-100 text-gray-600"
            }`}
          >
            {post.status}
          </span>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-6">{post.description}</p>

        <div className="flex flex-wrap gap-6 text-sm text-gray-500 dark:text-gray-400 mb-8">
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

        {authLoading ? null : !user ? (
          /* Logged-out visitors: no contact details are sent by the server */
          <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-5">
            <p className="font-semibold dark:text-gray-100 mb-1">Log in to contact the poster</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Contact details are shared only with verified NIT Hamirpur students.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/login"
                state={{ from: `/posts/${id}` }}
                className="flex-1 text-center bg-blue-800 text-white font-semibold rounded-lg px-5 py-3 hover:bg-blue-900 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="flex-1 text-center border border-gray-300 dark:border-gray-700 dark:text-gray-100 font-semibold rounded-lg px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
        ) : isOwner ? (
          <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-5 mb-6">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 block">
              Update status
            </label>
            <select
              value={post.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updating}
              className="border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-4 py-2.5 text-sm capitalize"
            >
              {statusFlow.map((s) => (
                <option key={s} value={s} className="capitalize">
                  {s}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Only you can update the status of your own post.
            </p>
          </div>
        ) : (
          <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-5">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3">
              Contact {post.postedBy?.name || "the poster"}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={mailtoLink}
                className="flex-1 text-center bg-blue-800 text-white font-semibold rounded-lg px-5 py-3 hover:bg-blue-900 transition-colors"
              >
                Email {posterFirstName}
              </a>
              {post.postedBy?.phone && (
                <a
                  href={telLink}
                  className="flex-1 text-center border border-gray-300 dark:border-gray-700 dark:text-gray-100 font-semibold rounded-lg px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Call {post.postedBy.phone}
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}