"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white border-b shadow-sm px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">

        <h1 className="text-xl font-bold text-indigo-600">
          💰 FinTrack
        </h1>

        <div className="flex gap-6 text-gray-600 font-medium">
          <Link href="/">Dashboard</Link>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </div>
      </div>
    </nav>
  );
}
