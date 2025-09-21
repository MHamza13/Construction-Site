"use client";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import AuthContainer from "@/components/auth/AuthContainer";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import PageTransition from "@/components/ui/PageTransition";
import ApiLoadingBar from "@/components/ui/ApiLoadingBar";
import { createContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { store } from "@/redux/store";
import { PURGE } from "redux-persist";
import { jwtDecode } from "jwt-decode";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const SidebarContext = createContext();

export default function ClientLayout({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, token, chatId, isAuthenticated, loading } = useSelector(
    (state) => state.auth
  );
  const [isRehydrated, setIsRehydrated] = useState(false);

  // Listen for rehydration completion
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      if (state._persist?.rehydrated) {
        setIsRehydrated(true);
        console.log("Redux-persist rehydration complete:", state.auth);
      }
    });
    
    // Check if already rehydrated
    const currentState = store.getState();
    if (currentState._persist?.rehydrated) {
      setIsRehydrated(true);
    }
    
    const timeout = setTimeout(() => {
      if (!isRehydrated) {
        console.warn("Rehydration timeout, forcing isRehydrated to true");
        setIsRehydrated(true);
      }
    }, 2000); // Reduced timeout from 5000ms to 2000ms
    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, [isRehydrated]);

  // Auto logout if token expired
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          console.warn("Token expired, logging out...");
          handleLogout();
        }
      } catch (err) {
        console.error("Invalid token, logging out...");
        handleLogout();
      }
    }
  }, [token]);

  useEffect(() => {
    if (!isRehydrated) {
      console.log("Waiting for rehydration...");
      return;
    }

    console.log("Auth state after rehydration:", {
      isAuthenticated,
      token,
      chatId, // Log chatId
      user: user
        ? { userId: user.userId, email: user.email, role: user.role }
        : null,
      pathname,
    });

    if (isAuthenticated && publicRoutes.includes(pathname)) {
      console.log("Authenticated, redirecting to /dashboard...");
      router.push("/dashboard");
    } else if (isAuthenticated) {
      console.log("Authenticated, staying on current page:", pathname);
    } else {
      console.log("Not authenticated, showing login page...");
      if (!publicRoutes.includes(pathname)) {
        router.push("/");
      }
    }
  }, [dispatch, token, isAuthenticated, pathname, router, isRehydrated]);

  const handleLogout = () => {
    console.log("Logging out...");
    store.dispatch({ type: "auth/logout" });
    store.dispatch({ type: PURGE, key: "root", result: () => null });
    router.push("/");
  };

  const publicRoutes = ["/terms", "/privacy", "/"];

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      <ApiLoadingBar />
      {!isRehydrated ? (
        <LoadingSpinner message="Loading..." />
      ) : publicRoutes.includes(pathname) ? (
        <div className="flex flex-col min-h-screen">{children}</div>
      ) : isAuthenticated ? (
        <div className="flex">
          {/* Sidebar only visible on md+ screens */}
          <div className="hidden md:block">
            <Sidebar />
          </div>

          <div
            className={`flex flex-col flex-1 min-h-screen transition-all duration-300 ${
              isOpen ? "ml-0 md:ml-64" : "ml-0 md:ml-20"
            }`}
          >
            <div className="sticky top-0 z-40">
              <Navbar onLogout={handleLogout} user={user} chatId={chatId} />
            </div>
            <main className="flex-1 p-6 bg-neutral-100">
              <PageTransition>{children}</PageTransition>
            </main>
          </div>
        </div>
      ) : (
        <AuthContainer />
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </SidebarContext.Provider>
  );
}
