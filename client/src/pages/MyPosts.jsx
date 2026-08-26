import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Pencil, Trash2 } from "lucide-react";
import api from "../api/axios";

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusColors = {
    lost: "bg-red-50 text-red-700",
    found: "bg-emerald-50 text-emerald-700",
    claimed: "bg-amber-50 text-amber-700",
    recovered: "bg-gray-100 text-gray-600",
  };

  const fetchMyPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/posts/mine");
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to fetch your posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete post");
    }
  };

  if (loading) {
    return <p className="max-w-5xl mx-auto px-8 py-12 text-gray-400">Loading...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <h1 className="text-3xl font-extrabold mb-2">My Posts</h1>
      <p className="text-gray-500 mb-8">
        Manage the items you've reported as lost or found.
      </p>

      {posts.length === 0 ? (
        <p className="text-gray-400">You haven't posted anything yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <div
              key={post._id}
              className="flex items-center justify-between border border-gray-200 rounded-2xl p-5"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-lg">{post.title}</h3>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                      statusColors[post.status] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {post.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(post.date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={`/posts/${post._id}/edit`}
                  className="flex items-center gap-1.5 text-sm font-medium border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors"
                >
                  <Pencil size={14} />
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="flex items-center gap-1.5 text-sm font-medium border border-red-200 text-red-600 rounded-lg px-3 py-2 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}