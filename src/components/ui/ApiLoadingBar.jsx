"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function ApiLoadingBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("");
  
  // Get loading states from all Redux slices
  const authLoading = useSelector((state) => state.auth?.loading);
  const tasksLoading = useSelector((state) => state.tasks?.loading);
  const workersLoading = useSelector((state) => state.workers?.loading);
  const projectsLoading = useSelector((state) => state.projects?.loading);
  const specializationsLoading = useSelector((state) => state.specializations?.loading);
  const invoicesLoading = useSelector((state) => state.invoices?.loading);

  // Check if any slice is loading (API calls)
  const isLoading = authLoading || tasksLoading || workersLoading || 
                   projectsLoading || specializationsLoading || invoicesLoading;

  // Determine loading message based on what's loading
  const getLoadingMessage = () => {
    const loadingStates = [];
    if (authLoading) loadingStates.push("Authenticating");
    if (tasksLoading) loadingStates.push("Tasks");
    if (workersLoading) loadingStates.push("Workers");
    if (projectsLoading) loadingStates.push("Projects");
    if (specializationsLoading) loadingStates.push("Specializations");
    if (invoicesLoading) loadingStates.push("Invoices");
    
    if (loadingStates.length === 0) return "Loading...";
    if (loadingStates.length === 1) return `Loading ${loadingStates[0].toLowerCase()}...`;
    return `Loading ${loadingStates.join(", ").toLowerCase()}...`;
  };

  useEffect(() => {
    if (isLoading) {
      setIsVisible(true);
      setProgress(0);
      setLoadingMessage(getLoadingMessage());
      
      // Simulate progress with realistic increments
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 80) return prev; // Stop at 80% until actual loading completes
          return prev + Math.random() * 5 + 3; // Slower, more realistic progress
        });
      }, 200);

      return () => clearInterval(interval);
    } else {
      // Complete the loading bar when done
      setProgress(100);
      setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
        setLoadingMessage("");
      }, 300);
    }
  }, [isLoading]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div 
        className="h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 transition-all duration-300 ease-out"
        style={{ 
          width: `${progress}%`,
          boxShadow: '0 0 15px rgba(59, 130, 246, 0.6), 0 0 30px rgba(6, 182, 212, 0.3)'
        }}
      />
      <div className="h-1 bg-gray-200" />
      
      {/* Loading message */}
      {loadingMessage && (
        <div className="absolute top-2 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg animate-pulse">
          {loadingMessage}
        </div>
      )}
    </div>
  );
}
