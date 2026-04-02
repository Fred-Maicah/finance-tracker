"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/profile", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        } else {
          router.push("/login");
        }
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Navbar />
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Profile</h1>

        {user ? (
          <>
            <div>
              <p className="text-gray-500">Name</p>
              <p className="font-semibold">{user.name}</p>
            </div>

            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-semibold">{user.email}</p>
            </div>

            <button
              onClick={async () => {
                await fetch("/api/auth/logout", {
                  method: "POST",
                  credentials: "include",
                });

                router.push("/login");
              }}
              className="bg-red-600 text-white px-4 py-2 rounded w-full"
            >
              Logout
            </button>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <Footer />
    </div>
  );
}
