"use client";

import { useContext, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import {
  HomeIcon,
  FolderIcon,
  CheckCircleIcon,
  UsersIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ChatBubbleLeftIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronRightIcon as ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { Circle } from "lucide-react";

import { SidebarContext } from "@/components/layout/ClientLayout";
import logo from "@/assets/logo.png";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Projects", href: "/projects", icon: FolderIcon },
  { name: "Tasks", href: "/tasks", icon: CheckCircleIcon },
  { name: "Workers", href: "/worker-management", icon: UsersIcon },
  { name: "Attendance", href: "/attendance", icon: ClockIcon },
  { name: "Shifts", href: "/shift", icon: ClockIcon },
  {
    name: "Payroll",
    icon: CurrencyDollarIcon,
    children: [
      { name: "Invoicing", href: "/invoices", icon: Circle },
      { name: "Pending Review", href: "/PendingReview", icon: Circle },
    ],
  },
  { name: "Reports", href: "/reports", icon: ChartBarIcon },
  { name: "Chat", href: "/chat", icon: ChatBubbleLeftIcon },
  { name: "Settings", href: "/settings", icon: CogIcon },
  { name: "Help", href: "/help", icon: QuestionMarkCircleIcon },
];

export default function Sidebar() {
  const { isOpen, setIsOpen } = useContext(SidebarContext);
  const pathname = usePathname();
  const user = { role: "Site Manager" };
  const [openMenus, setOpenMenus] = useState([]);

  const toggleMenu = (name) => {
    setOpenMenus((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen flex flex-col bg-gradient-to-b from-gray-950 to-gray-900 text-gray-200 shadow-2xl border-r border-gray-800/50 transition-all duration-300 z-50 ${
        isOpen ? "w-64 translate-x-0" : "w-20 translate-x-0"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-20 border-b border-gray-800/70 px-4">
        <div className="flex items-center gap-2 w-full">
          {/* Logo */}
          <Image
            src={logo}
            alt="Logo"
            width={isOpen ? 50 : 40}
            height={isOpen ? 50 : 40}
            className="rounded-full border border-cyan-500/30 shadow-lg"
          />

          {/* Show text only when sidebar is open */}
          {isOpen && (
            <div className="flex flex-col ml-2 min-w-0">
              <h1 className="text-xl font-bold text-white truncate">Brickz</h1>
              <span className="text-sm text-gray-400 truncate">
                {user.role}
              </span>
            </div>
          )}
        </div>

        {/* Desktop toggle button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md hover:bg-gray-800 hover:ring-1 hover:ring-cyan-500/50 transition-all duration-200"
        >
          {isOpen ? (
            <ChevronLeftIcon className="h-6 w-6 text-gray-200" />
          ) : (
            <ChevronRightIcon className="h-6 w-6 text-gray-200" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col justify-between overflow-y-auto sidebar-scroller">
        <nav className="px-3 py-4 flex-1">
          <div className="space-y-1">
            {navigation.map((item) =>
              item.children ? (
                <div key={item.name}>
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      pathname.startsWith("/invoices") ||
                      pathname.startsWith("/PendingReview")
                        ? "bg-cyan-600 text-white shadow-lg"
                        : "hover:bg-cyan-700 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center min-w-0">
                      <item.icon
                        className={`h-5 w-5 ${
                          pathname.startsWith("/invoices") ||
                          pathname.startsWith("/PendingReview")
                            ? "text-white"
                            : "text-gray-300"
                        } ${isOpen ? "mr-3" : "mx-auto"}`}
                      />
                      {isOpen && <span className="truncate">{item.name}</span>}
                    </div>
                    {isOpen && (
                      <span>
                        {openMenus.includes(item.name) ? (
                          <ChevronDownIcon className="h-4 w-4 text-gray-300" />
                        ) : (
                          <ArrowRightIcon className="h-4 w-4 text-gray-300" />
                        )}
                      </span>
                    )}
                  </button>

                  {isOpen && openMenus.includes(item.name) && (
                    <div className="mt-1 mx-2 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={`flex items-center px-3 py-2 text-sm rounded-lg ${
                            pathname === child.href
                              ? "bg-cyan-700 text-white"
                              : "text-gray-300 hover:bg-cyan-800 hover:text-white"
                          }`}
                        >
                          <child.icon
                            className={`h-4 w-4 ${
                              pathname === child.href
                                ? "text-white"
                                : "text-gray-300"
                            } mr-2`}
                          />
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    pathname === item.href
                      ? "bg-cyan-600 text-white shadow-lg"
                      : "hover:bg-cyan-700 hover:text-white"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 ${
                      pathname === item.href ? "text-white" : "text-gray-300"
                    } ${isOpen ? "mr-3" : "mx-auto"}`}
                  />
                  {isOpen && <span className="truncate">{item.name}</span>}
                </Link>
              )
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
