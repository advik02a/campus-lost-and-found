import { useState, useEffect } from "react";
import PostCard from "../components/PostCard";
import api from "../api/axios";

export default function Browse() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await api.get("/posts", { params: { search } });
        setPosts(res.data.posts);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(fetchPosts, 300); // debounce typing
    return () => clearTimeout(delay);
  }, [search]);

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <h1 className="text-3xl font-extrabold mb-2">Browse Listings</h1>
      <p className="text-gray-500 mb-8">
        Search reported lost and found items across campus.
      </p>

      <input
        type="text"
        placeholder="Search by title or description..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-3 text-sm w-full max-w-md mb-8"
      />

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-400">No posts found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}