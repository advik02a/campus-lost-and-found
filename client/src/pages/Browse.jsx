import { useState, useEffect } from "react";
import PostCard from "../components/PostCard";
import api from "../api/axios";

const categories = ["Electronics", "Wallet", "Documents", "Clothing", "ID Card", "Other"];
const locations = ["Library", "Hostel Block A", "Academic Block", "Sports Complex", "Cafeteria"];

export default function Browse() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await api.get("/posts", {
          params: { search, type, category, location, page, limit: 9 },
        });
        setPosts(res.data.posts);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(fetchPosts, 300);
    return () => clearTimeout(delay);
  }, [search, type, category, location, page]);

  // Reset to page 1 whenever a filter changes (not when page itself changes)
  useEffect(() => {
    setPage(1);
  }, [search, type, category, location]);

  const clearFilters = () => {
    setSearch("");
    setType("");
    setCategory("");
    setLocation("");
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <h1 className="text-3xl font-extrabold mb-2">Browse Listings</h1>
      <p className="text-gray-500 mb-8">
        Search reported lost and found items across campus.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        {/* Filter sidebar */}
        <aside className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 text-sm"
          />

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-2 block">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm w-full"
            >
              <option value="">All</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-2 block">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm w-full"
            >
              <option value="">All</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-2 block">
              Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm w-full"
            >
              <option value="">All</option>
              {locations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          {(search || type || category || location) && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-800 font-medium hover:underline text-left"
            >
              Clear filters
            </button>
          )}
        </aside>

        {/* Results */}
        <div>
          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-400">No posts found.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-500 px-2">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}