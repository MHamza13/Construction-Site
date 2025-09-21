"use client";
import { useState } from "react";
import Link from "next/link";
import { FiUser, FiMail, FiPhone, FiLock } from "react-icons/fi";

export default function SignupForm({ onToggleAuthMode, onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Full name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\+?\d{10,15}$/.test(phone.replace(/\D/g, ""))) {
      newErrors.phone = "Phone number is invalid";
    }
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!agreeTerms)
      newErrors.agreeTerms = "You must agree to the terms and conditions";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    if (name && email && phone && password && agreeTerms) {
      setErrors({});
      onLogin();
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Heading */}
      <h2 className="text-3xl font-bold text-gray-900 text-center">
        Create Your Account
      </h2>
      <p className="mt-2 text-gray-600 text-center">
        Join Brickz to manage your projects efficiently
      </p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FiUser size={18} />
          </span>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Full Name"
            className={`w-full pl-10 pr-3 py-2 border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } text-gray-900 placeholder-gray-400 
              focus:border-blue-500 focus:outline-none sm:text-sm transition`}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

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
            placeholder="Email Address"
            className={`w-full pl-10 pr-3 py-2 border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } text-gray-900 placeholder-gray-400 
              focus:border-blue-500 focus:outline-none sm:text-sm transition`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FiPhone size={18} />
          </span>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="Phone Number"
            className={`w-full pl-10 pr-3 py-2 border ${
              errors.phone ? "border-red-500" : "border-gray-300"
            } text-gray-900 placeholder-gray-400 
              focus:border-blue-500 focus:outline-none sm:text-sm transition`}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FiLock size={18} />
          </span>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="Password"
            className={`w-full pl-10 pr-3 py-2 border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } text-gray-900 placeholder-gray-400 
              focus:border-blue-500 focus:outline-none sm:text-sm transition`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FiLock size={18} />
          </span>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            placeholder="Confirm Password"
            className={`w-full pl-10 pr-3 py-2 border ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            } text-gray-900 placeholder-gray-400 
              focus:border-blue-500 focus:outline-none sm:text-sm transition`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Terms */}
        <div className="flex items-center">
          <input
            id="agreeTerms"
            name="agreeTerms"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
          />
          <label htmlFor="agreeTerms" className="ml-2 text-sm text-gray-900">
            I agree to the{" "}
            <Link
              href="/terms"
              className="font-medium text-blue-600 hover:text-blue-500 underline"
            >
              Terms and Conditions
            </Link>
          </label>
        </div>
        {errors.agreeTerms && (
          <p className="mt-1 text-sm text-red-500">{errors.agreeTerms}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 px-4 mt-2 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition transform hover:scale-[1.02]"
        >
          Register
        </button>

        {/* Already have account */}
        <div className="flex justify-center items-center text-sm mt-1">
          <p className="text-gray-600 text-center">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => onToggleAuthMode("login")}
              className="font-medium text-blue-600 hover:underline hover:text-blue-500"
            >
              Log in here
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
