import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSubmitted(true);
    } catch (err) {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-900">
      <div className="max-w-md mx-auto pt-20 px-4 sm:px-8">
        <h1 className="text-3xl font-extrabold mb-2 dark:text-gray-100">Forgot password</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Enter your email and we'll send you a link to reset your password.
        </p>

        {submitted ? (
          <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-5">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              If an account exists for <span className="font-semibold">{email}</span>, a reset
              link has been sent. Check your inbox.
            </p>
            <Link
              to="/login"
              className="inline-block mt-4 text-sm text-blue-800 dark:text-blue-400 font-medium hover:underline"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 rounded-lg px-4 py-3 text-sm"
              required
            />
            <button
              disabled={loading}
              className="bg-blue-800 text-white font-semibold rounded-lg px-4 py-3 hover:bg-blue-900 transition-colors disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}