import { Link } from "react-router-dom";
import { MapPin, Calendar } from "lucide-react";

export default function PostCard({ post }) {
  const statusColors = {
    lost: "bg-red-50 text-red-700",
    found: "bg-emerald-50 text-emerald-700",
    claimed: "bg-amber-50 text-amber-700",
    recovered: "bg-gray-100 text-gray-600",
  };

  return (
    <Link
      to={`/posts/${post._id}`}
      className="block border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-video bg-gray-100 flex items-center justify-center">
        {post.image ? (
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 text-sm">No image</span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg">{post.title}</h3>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
              statusColors[post.status] || "bg-gray-100 text-gray-600"
            }`}
          >
            {post.status}
          </span>
        </div>

        <p className="text-sm text-gray-500 mb-3">{post.category}</p>

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
    </Link>
  );
}