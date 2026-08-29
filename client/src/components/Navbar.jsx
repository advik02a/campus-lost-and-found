import { Link, useNavigate } from "react-router-dom";
import { MapPin, Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-blue-800 flex items-center justify-center">
            <MapPin size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-lg tracking-tight">
            Lost <span className="text-blue-800">&amp;</span> Found
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/browse" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Browse
          </Link>

          {user ? (
                    <>
                  <Link to="/my-posts"
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                   >
                  My Posts
              </Link>
                <span className="text-sm text-gray-600">Hi, {user.name}</span>
               <button onClick={handleLogout}
                className="text-sm font-medium border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
                   >
                Logout
            </button>
            {user.role === "admin" && (
  <Link
    to="/admin"
    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
  >
    Admin
  </Link>
)}
           </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium bg-blue-800 text-white rounded-lg px-4 py-2 hover:bg-blue-900 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}

          <button className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Moon size={16} />
          </button>
        </nav>
      </div>
    </header>
  );
}