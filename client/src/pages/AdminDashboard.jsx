import { useState, useEffect } from "react";
import { Trash2, Users, PackageSearch } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import ConfirmDialog from "../components/ConfirmDialog";

export default function AdminDashboard() {
  const [tab, setTab] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [postsRes, usersRes] = await Promise.all([
        api.get("/admin/posts"),
        api.get("/admin/users"),
      ]);
      setPosts(postsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeletePost = async () => {
    const id = confirmId;
    setConfirmId(null);
    try {
      await api.delete(`/admin/posts/${id}`);
      setPosts(posts.filter((p) => p._id !== id));
      toast.success("Post removed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete post");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-gray-900">
        <p className="max-w-6xl mx-auto px-4 sm:px-8 py-12 text-gray-400 dark:text-gray-500">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12">
        <h1 className="text-3xl font-extrabold mb-2 dark:text-gray-100">Admin Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Manage all posts and users across the platform.
        </p>

        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 mb-8">
          <button
            onClick={() => setTab("posts")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
              tab === "posts"
                ? "border-blue-800 text-blue-800 dark:text-blue-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            <PackageSearch size={16} />
            All Posts ({posts.length})
          </button>
          <button
            onClick={() => setTab("users")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
              tab === "users"
                ? "border-blue-800 text-blue-800 dark:text-blue-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            <Users size={16} />
            Users ({users.length})
          </button>
        </div>

        {tab === "posts" && (
          <div className="flex flex-col gap-3">
            {posts.length === 0 ? (
              <p className="text-gray-400 dark:text-gray-500">No posts yet.</p>
            ) : (
              posts.map((post) => (
                <div
                  key={post._id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-gray-200 dark:border-gray-700 rounded-xl p-4"
                >
                  <div>
                    <div className="font-semibold dark:text-gray-100">{post.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {post.type} · {post.status} · posted by {post.postedBy?.name || "Unknown"}
                    </div>
                  </div>
                  <button
                    onClick={() => setConfirmId(post._id)}
                    className="flex items-center gap-1.5 text-sm font-medium border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-lg px-3 py-2 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "users" && (
          <div className="flex flex-col gap-3">
            {users.map((u) => (
              <div
                key={u._id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-gray-200 dark:border-gray-700 rounded-xl p-4"
              >
                <div>
                  <div className="font-semibold dark:text-gray-100">{u.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{u.email}</div>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full capitalize w-fit ${
                    u.role === "admin"
                      ? "bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        )}

        <ConfirmDialog
          open={confirmId !== null}
          title="Remove this post?"
          message="This will permanently delete the post."
          onConfirm={handleDeletePost}
          onCancel={() => setConfirmId(null)}
        />
      </div>
    </div>
  );
}