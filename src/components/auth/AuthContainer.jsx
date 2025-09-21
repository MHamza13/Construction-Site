"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import DummyLogo from "../ui/DummyLogo";
import LoadingSpinner from "../ui/LoadingSpinner";
import { store } from "@/redux/store";

const AuthContainer = ({ defaultMode = "login", onLogin }) => {
  const [authMode, setAuthMode] = useState(defaultMode);
  const router = useRouter();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  // Remove redundant rehydration check - ClientLayout already handles this
  useEffect(() => {
    if (isAuthenticated && !loading) {
      console.log("AuthContainer: Authenticated, redirecting to /dashboard...");
      router.push("/dashboard");
    }
  }, [isAuthenticated, loading, router]);

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    }
    console.log(
      "AuthContainer: Login successful, redirecting to /dashboard..."
    );
    router.push("/dashboard");
  };

  if (loading) {
    console.log("AuthContainer: Showing loading screen...");
    return <LoadingSpinner message="Logging in..." />;
  }

  if (!isAuthenticated) {
    console.log("AuthContainer: Rendering login/signup/forgot password forms");
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
          <div className="flex justify-center">
            <DummyLogo />
          </div>
          {authMode === "login" && (
            <LoginForm onToggleAuthMode={setAuthMode} onLogin={handleLogin} />
          )}
          {authMode === "signup" && (
            <SignupForm onToggleAuthMode={setAuthMode} onLogin={handleLogin} />
          )}
          {authMode === "forgotPassword" && (
            <ForgotPasswordForm onToggleAuthMode={setAuthMode} />
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default AuthContainer;
