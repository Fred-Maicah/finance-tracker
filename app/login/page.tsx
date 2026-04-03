"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include", // ✅ IMPORTANT for cookies
    });

    const data = await res.json();

    if (res.ok) {
      // ❌ NO localStorage anymore
      // ✅ Cookie is already set by backend

      router.push("/dashboard");
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleLogin} className="space-y-4">
        <h1 className="text-2xl font-bold">Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded-lg w-full text-sm 
              transition-all 
              peer-placeholder-shown:top-3.5 
              peer-placeholder-shown:text-sm 
              peer-focus:top-2 peer-focus:text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 
              focus:border-indigo-500 transition"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded-lg w-full text-sm 
              transition-all 
              peer-placeholder-shown:top-3.5 
              peer-placeholder-shown:text-sm 
              peer-focus:top-2 peer-focus:text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 
              focus:border-indigo-500 transition"
        />

        <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl w-full hover:bg-indigo-700 shadow-sm transition">
          Login
        </button>
        <p className="text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <Link href="/register" className="text-indigo-600 font-medium">
          Register
          </Link>
        </p>
      </form>
    </div>
  );
}
