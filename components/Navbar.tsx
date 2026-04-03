"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    router.push("/login");
  };

  return (
    <nav className="bg-white shadow px-4 sm:px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      {/* Logo + Name */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-full"></div>
        <h1 className="font-bold text-lg">Finance Tracker</h1>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="text-red-600 font-medium hover:underline"
      >
        Logout
      </button>
    </nav>
  );
}

