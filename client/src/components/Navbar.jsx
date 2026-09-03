import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Moon, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="border-b border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
          <div className="w-7 h-7 rounded-md bg-blue-800 flex items-center justify-center">
            <MapPin size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-lg tracking-tight">
            Lost <span className="text-blue-800">&amp;</span> Found
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/browse" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Browse
          </Link>

          {user ? (
            <>
              {user.role === "admin" && (
                <Link to="/admin" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Admin
                </Link>
              )}
              <Link to="/my-posts" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                My Posts
              </Link>
              <span className="text-sm text-gray-600">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm font-medium border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
              >
                Logout
              </button>
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

        {/* Mobile menu toggle */}
        <button
          className="md:hidden w-9 h-9 flex items-center justify-center"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <nav className="md:hidden border-t border-gray-200 px-4 py-4 flex flex-col gap-3 bg-white">
          <Link to="/browse" onClick={closeMenu} className="text-sm text-gray-600 py-2">
            Browse
          </Link>

          {user ? (
            <>
              {user.role === "admin" && (
                <Link to="/admin" onClick={closeMenu} className="text-sm text-gray-600 py-2">
                  Admin
                </Link>
              )}
              <Link to="/my-posts" onClick={closeMenu} className="text-sm text-gray-600 py-2">
                My Posts
              </Link>
              <span className="text-sm text-gray-600 py-2">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm font-medium border border-gray-300 rounded-lg px-4 py-2.5 text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={closeMenu}
                className="text-sm font-medium border border-gray-300 rounded-lg px-4 py-2.5 text-center"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="text-sm font-medium bg-blue-800 text-white rounded-lg px-4 py-2.5 text-center"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}