"use client";
import { useState } from "react";
import { FiMail } from "react-icons/fi";

export default function ForgotPasswordForm({ onToggleAuthMode }) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate password reset (replace with actual logic)
    console.log("Password reset email sent to:", email);
    onToggleAuthMode("login");
  };

  return (
    <div className="w-full max-w-md">
      {/* Heading */}
      <h2 className="text-center text-3xl font-bold text-gray-900">
        Reset Password
      </h2>
      <p className="mt-2 text-center text-gray-600">
        Enter your email to receive reset instructions
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-2">
        {/* Email */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FiMail size={18} />
          </span>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Email"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 
              text-gray-900 placeholder-gray-400 
              focus:border-blue-500 focus:outline-none sm:text-sm transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 px-4 mt-4 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition transform hover:scale-[1.02]"
        >
          Send Reset Link
        </button>

        {/* Back to login */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Remember your password?{" "}
          <button
            type="button"
            onClick={() => onToggleAuthMode("login")}
            className="font-medium text-blue-600 cursor-pointer hover:underline hover:text-blue-500 transition"
          >
            Back to Log in
          </button>
        </p>
      </form>
    </div>
  );
}
