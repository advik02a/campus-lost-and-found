import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, MailCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { register } = useAuth();

  const validate = () => {
    const errors = {};
    if (name.trim().length < 2) errors.name = "Name must be at least 2 characters";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = "Enter a valid email address";
    } else if (!email.toLowerCase().trim().endsWith("@nith.ac.in")) {
      errors.email = "Must be a valid NIT Hamirpur student email (ending in @nith.ac.in)";
    }

    if (password.length < 6) errors.password = "Password must be at least 6 characters";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    try {
      await register(name, email, password);
      toast.success("Account created! Check your email to verify.");
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  const inputClass = (hasError) =>
    `border rounded-lg px-4 py-3 text-sm w-full dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 ${
      hasError ? "border-red-400 dark:border-red-500" : "border-gray-300 dark:border-gray-700"
    }`;

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-gray-900">
        <div className="max-w-md mx-auto pt-20 px-4 sm:px-8 text-center">
          <MailCheck size={40} className="mx-auto mb-4 text-blue-800 dark:text-blue-400" />
          <h1 className="text-2xl font-extrabold mb-2 dark:text-gray-100">Check your email</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            We sent a verification link to <span className="font-semibold">{email}</span>.
            Click it to activate your account, then come back and log in.
          </p>
          <Link
            to="/login"
            className="inline-block bg-blue-800 text-white font-semibold rounded-lg px-5 py-3 hover:bg-blue-900 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-900">
      <div className="max-w-md mx-auto pt-20 px-4 sm:px-8">
        <h1 className="text-3xl font-extrabold mb-6 dark:text-gray-100">Sign up</h1>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">
          Registration is open only to NIT Hamirpur students, using your official
          <span className="font-mono"> rollnumber@nith.ac.in</span> email.
        </p>

        {error && <p className="text-red-600 dark:text-red-400 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass(fieldErrors.name)}
            />
            {fieldErrors.name && (
              <p className="text-red-600 dark:text-red-400 text-xs mt-1">{fieldErrors.name}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              placeholder="24bcs002@nith.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass(fieldErrors.email)}
            />
            {fieldErrors.email && (
              <p className="text-red-600 dark:text-red-400 text-xs mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass(fieldErrors.password)} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-red-600 dark:text-red-400 text-xs mt-1">{fieldErrors.password}</p>
            )}
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">At least 6 characters</p>
          </div>

          <button className="bg-blue-800 text-white font-semibold rounded-lg px-4 py-3 hover:bg-blue-900 transition-colors">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}