"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface SidebarProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFittingRoom, setIsFittingRoom] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsFittingRoom(pathname === "/fitting-room");
  }, [pathname]);

  const navigationItems = [
    {
      icon: "🏠",
      label: "Home",
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      icon: "👔",
      label: "Wardrobe",
      href: "/wardrobe",
      active: pathname === "/wardrobe",
    },
    {
      icon: "🎭",
      label: "Fitting Room",
      href: "/fitting-room",
      active: pathname === "/fitting-room",
    },
    {
      icon: "⚙️",
      label: "Settings",
      href: "/settings",
      active: pathname === "/settings",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Collapsible Main Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-gray-900 dark:bg-black transition-all duration-300 z-50 ${
          isExpanded ? "w-64" : "w-16"
        } ${isFittingRoom ? "collapsed" : ""}`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* v-FIT Logo */}
        <div className="flex items-center justify-center h-16 border-b border-gray-700">
          {isExpanded ? (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
              <span className="text-white font-bold text-xl">v-FIT</span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="mt-8">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${
                item.active ? "bg-blue-600 text-white" : ""
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {isExpanded && (
                <span className="ml-3 font-medium">{item.label}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
        >
          {isExpanded ? "◀" : "▶"}
        </button>
      </div>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isExpanded ? "ml-64" : "ml-16"
        }`}
      >
        {/* Top Navbar */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6">
          {/* Global Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search items, brands, styles..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-foreground"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-5 5-5-5h5v-5a3 3 0 10-6 0v5H9l5 5 5-5z"
                />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>

            {/* User Profile */}
            <div className="relative group">
              <button className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  A
                </div>
                <span className="hidden md:block">Abdullah</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Settings
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Profile
                  </Link>
                  <hr className="my-1 border-gray-200 dark:border-gray-600" />
                  <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
