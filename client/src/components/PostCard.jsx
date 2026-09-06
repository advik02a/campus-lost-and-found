import { Link } from "react-router-dom";
import { MapPin, Calendar } from "lucide-react";

export default function PostCard({ post }) {
  const statusColors = {
    lost: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
    found: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    claimed: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    recovered: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  };

  return (
    <Link
      to={`/posts/${post._id}`}
      className="block border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden hover:shadow-md dark:hover:shadow-none dark:hover:border-gray-600 transition-shadow"
    >
      <div className="aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        {post.image ? (
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 dark:text-gray-500 text-sm">No image</span>
        )}
      </div>

      <div className="p-4 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg dark:text-gray-100">{post.title}</h3>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
              statusColors[post.status] || "bg-gray-100 text-gray-600"
            }`}
          >
            {post.status}
          </span>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{post.category}</p>

        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
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
    </Link>
  );
}