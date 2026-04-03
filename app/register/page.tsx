"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("User registered successfully! You can now login.");
      router.push("/login");
    } else {
      alert(data.error || "Registration failed");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleRegister} className="space-y-4">
        <h1 className="text-2xl font-bold">Register</h1>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded-lg w-full text-sm 
              transition-all 
              peer-placeholder-shown:top-3.5 
              peer-placeholder-shown:text-sm 
              peer-focus:top-2 peer-focus:text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 
              focus:border-indigo-500 transition"
        />

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
          Register
        </button>
        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 font-medium">
          Login
          </Link>
        </p>
      </form>
    </div>
  );
}

