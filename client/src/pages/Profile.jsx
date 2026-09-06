import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [phone, setPhone] = useState(user?.phone || "");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.put("/auth/profile", { phone });
      await refreshUser();
      toast.success("Profile updated");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-900">
      <div className="max-w-md mx-auto pt-20 px-4 sm:px-8">
        <h1 className="text-3xl font-extrabold mb-2 dark:text-gray-100">My Profile</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Add a phone number so others can reach you faster.
        </p>

        {error && <p className="text-red-600 dark:text-red-400 text-sm mb-4">{error}</p>}

        <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-5 mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Name</p>
          <p className="font-semibold dark:text-gray-100 mb-4">{user?.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
          <p className="font-semibold dark:text-gray-100">{user?.email}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 block">
              Phone number (optional)
            </label>
            <input
              type="tel"
              placeholder="e.g. +91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 rounded-lg px-4 py-3 text-sm w-full"
            />
          </div>

          <button className="bg-blue-800 text-white font-semibold rounded-lg px-4 py-3 hover:bg-blue-900 transition-colors">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}