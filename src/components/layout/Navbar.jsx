"use client";
import {
  BellIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState, useEffect, useRef, useContext } from "react";
import profilePic from "@/assets/profilebgRemove.png";
import { useSelector } from "react-redux";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/Firebase";
import { formatTime, generateChatId } from "@/components/chat/WorkerChat";
import { SidebarContext } from "@/components/layout/ClientLayout";
import Sidebar from "@/components/layout/Sidebar"; // ✅ import sidebar

export default function Navbar({ onLogout }) {
  const { isOpen, setIsOpen } = useContext(SidebarContext); // ✅ sidebar context
  const loginData = useSelector((state) => state.auth);
  const { items: workers } = useSelector((state) => state.workers);

  const user = {
    userId: loginData?.user?.userId || "",
    name: `${loginData?.user?.name || ""} ${loginData?.user?.surname || ""}`,
    role: "Project Manager",
    image: profilePic,
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch unread messages
  useEffect(() => {
    const unsubs = workers.map((w) => {
      const chatId = generateChatId(w.id);
      const q = query(
        collection(db, "chats", chatId, "messages"),
        orderBy("createdAt", "desc")
      );
      return onSnapshot(q, (snap) => {
        const unread = snap.docs
          .filter((doc) => {
            const msg = doc.data();
            return msg.senderId !== user.userId && !msg.read;
          })
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            worker: w,
          }));
        setUnreadMessages((prev) => {
          const updated = prev.filter((msg) => msg.worker.id !== w.id);
          return [...updated, ...unread];
        });
      });
    });
    return () => unsubs.forEach((u) => u());
  }, [workers, user.userId]);

  const totalUnreadCount = unreadMessages.length;

  return (
    <>
      {/* 🔹 Navbar */}
      <div className="flex items-center justify-between h-20 bg-gradient-to-l from-gray-900 to-gray-950 shadow-md px-4 md:px-6">
        {/* 🔹 Mobile Sidebar Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg bg-gray-800 border border-cyan-500/30 shadow-lg hover:border-cyan-400/50 transition-all duration-300"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? (
            <XMarkIcon className="h-6 w-6 text-cyan-400" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-cyan-400" />
          )}
        </button>

        
        {/* Right Section */}
        <div className="flex items-center space-x-4 ml-auto">
          {/* Search Bar (Right side) */}
          <div className="hidden md:flex items-center w-64">
            <div className="relative w-full">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-200" />
              <input
                type="text"
                placeholder="Search projects, tasks..."
                className="w-full pl-10 pr-4 py-2 bg-slate-700 text-white placeholder-slate-400 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2 text-slate-200 hover:text-blue-400 transition-colors"
            >
              <BellIcon className="h-6 w-6" />
              {totalUnreadCount > 0 && (
                <span className="absolute top-1 right-1 h-5 w-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                  {totalUnreadCount}
                </span>
              )}
            </button>
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
                <div className="px-4 py-3 border-b border-gray-200">
                  <span className="block text-sm font-medium text-gray-900">
                    Notifications
                  </span>
                </div>
                <div className="py-1">
                  {unreadMessages.length > 0 ? (
                    unreadMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 border-b border-gray-100"
                      >
                        <p className="font-medium">
                          {msg.worker.firstName} {msg.worker.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {msg.type === "text" ? msg.content : `[${msg.type}]`}
                        </p>
                        <p className="text-xs text-gray-400">
                          {msg.createdAt && formatTime(msg.createdAt.toDate())}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="px-4 py-2 text-sm text-gray-500">
                      No new notifications
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <button className="p-2 text-slate-200 hover:text-blue-400 transition-colors">
            <DocumentTextIcon className="h-6 w-6" />
          </button>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3"
            >
              <Image
                src={user.image}
                alt="User profile"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                <div className="px-4 py-3 border-b border-gray-200">
                  <span className="block text-sm font-medium text-gray-900">
                    {user.name}
                  </span>
                  <span className="block text-xs text-gray-500">
                    {user.role}
                  </span>
                </div>
                <div className="py-1">
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🔹 Offcanvas Sidebar (Only Mobile) */}
      {isOpen && (
        <div className="md:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
          {/* Sidebar */}
          <div className="fixed top-0 left-0 w-64 h-full bg-gray-900 shadow-lg z-50 transform transition-transform duration-300">
            <Sidebar />
          </div>
        </div>
      )}
    </>
  );
}
