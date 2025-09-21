"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/redux/auth/authSlice";
import { FiMail, FiLock } from "react-icons/fi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function LoginForm({ onToggleAuthMode, onLogin }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email && password) {
      try {
        const result = await dispatch(loginUser({ email, password })).unwrap();
        console.log("Login successful in LoginForm:", result);
        // No need to call onLogin - the AuthContainer will handle the redirect
        // based on the authentication state change
      } catch (err) {
        console.error("Login failed in LoginForm:", err);
      }
    }
  };

  return (
    <div>
      <div className="w-full max-w-md">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-gray-600">
          Sign in to continue to your account
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-2">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <FiMail size={18} />
            </span>
            <input
              id="email"
              name="emailOrPhone"
              type="text"
              required
              placeholder="Email or Phone"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 
              text-gray-900 placeholder-gray-400 
              focus:border-blue-500 focus:outline-none sm:text-sm transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => onToggleAuthMode("forgotPassword")}
              className="text-xs font-medium text-blue-600 cursor-pointer hover:underline hover:text-blue-500 transition"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <FiLock size={18} />
            </span>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Password"
              className="w-full pl-10 pr-10 py-2 border border-gray-300 
              text-gray-900 placeholder-gray-400 
              focus:border-blue-500 focus:outline-none sm:text-sm transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={18} />
              ) : (
                <AiOutlineEye size={18} />
              )}
            </button>
          </div>
          {loading && <p className="text-blue-500 text-sm">Logging in...</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 px-4 mt-4 cursor-pointer rounded-lg text-white font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition transform hover:scale-[1.02]"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}
