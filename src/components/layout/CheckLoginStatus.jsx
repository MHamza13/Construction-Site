"use client";

import { useSelector } from "react-redux";

export default function CheckLoginStatus() {
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    console.log("User is logged in:", user);
  } else {
    console.log("No user is logged in.");
  }

  return (
    <div className="p-4">
      {isAuthenticated ? `Welcome, ${user?.email || "User"}` : "Please log in"}
    </div>
  );
}
