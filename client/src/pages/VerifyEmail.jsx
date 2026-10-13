import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import api from "../api/axios";

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");
  const hasRun = useRef(false);

  useEffect(() => {
    // Guard against React StrictMode firing this effect twice in development,
    // which would send two requests to a non-idempotent endpoint (the token
    // is invalidated after the first successful use).
    if (hasRun.current) return;
    hasRun.current = true;

    api
      .get(`/auth/verify-email/${token}`)
      .then((res) => {
        setStatus("success");
        setMessage(res.data.message);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.response?.data?.message || "Verification failed");
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-900">
      <div className="max-w-md mx-auto pt-24 px-4 sm:px-8 text-center">
        {status === "loading" && (
          <>
            <Loader2 size={40} className="mx-auto mb-4 text-gray-400 dark:text-gray-500 animate-spin" />
            <p className="text-gray-500 dark:text-gray-400">Verifying your email...</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 size={40} className="mx-auto mb-4 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-2xl font-extrabold mb-2 dark:text-gray-100">Email verified</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{message}</p>
            <Link
              to="/login"
              className="inline-block bg-blue-800 text-white font-semibold rounded-lg px-5 py-3 hover:bg-blue-900 transition-colors"
            >
              Go to Login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle size={40} className="mx-auto mb-4 text-red-600 dark:text-red-400" />
            <h1 className="text-2xl font-extrabold mb-2 dark:text-gray-100">Verification failed</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{message}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">
              If you already clicked this link once, your account may already be verified —
              try logging in below.
            </p>
            <Link
              to="/login"
              className="inline-block bg-blue-800 text-white font-semibold rounded-lg px-5 py-3 hover:bg-blue-900 transition-colors mr-3"
            >
              Try Login
            </Link>
            <Link
              to="/register"
              className="inline-block border border-gray-300 dark:border-gray-700 dark:text-gray-100 font-semibold rounded-lg px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Back to Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}