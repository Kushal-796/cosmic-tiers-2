"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const params = new URLSearchParams(window.location.search);
      const email = params.get("email");
      if (!email) {
        router.push("/login");
        return;
      }
      const res = await fetch(`/api/me?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (!data.success) {
        router.push("/login");
      } else {
        setUser(data.user);
      }
      setLoading(false);
    }
    fetchUser();
  }, [router]);

  function handleLogout() {
    fetch("/api/logout", { method: "POST" }).then(() => router.push("/login"));
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="flex justify-between items-center px-8 py-6 border-b border-white/10">
        <span className="text-2xl font-bold tracking-wide">s-hatch</span>
        <Button onClick={handleLogout} variant="outline">Logout</Button>
      </nav>
      <main className="container-1200 mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center text-white/60">Loading dashboard...</div>
        ) : user ? (
          <div className="bg-white/10 rounded-xl p-8 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Welcome, {user.account?.name || "Founder"}!</h2>
            <p className="mb-2">Email: {user.account?.email}</p>
            <p className="mb-2">Startup: {user.startup?.startupName}</p>
            <p className="mb-2">Stage: {user.company?.stage}</p>
            <p className="mb-2">Industry: {user.company?.industries?.join(", ")}</p>
            {/* Add more details as needed */}
          </div>
        ) : (
          <div className="text-center text-red-500">Could not load user details.</div>
        )}
      </main>
    </div>
  );
}
