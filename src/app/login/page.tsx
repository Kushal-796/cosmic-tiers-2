"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Button from "@/components/Button";
import ParticlesBG from "@/components/ParticlesBG";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      router.push(`/dashboard?email=${encodeURIComponent(email)}`);
    } else {
      setError(data.message || "Invalid credentials");
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <Navbar hideLinks={false} />
      <ParticlesBG />
      <div className="absolute inset-0 star-gradient -z-10" />
      <div className="absolute inset-0 grid-overlay -z-10 opacity-40" />
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute -z-10 inset-0">
        <div className="absolute -top-24 -left-20 size-80 rounded-full bg-purple-500/25 blur-3xl" />
        <div className="absolute bottom-0 -right-20 size-96 rounded-full bg-blue-500/20 blur-3xl" />
      </div>
      <main className="w-full flex items-center justify-center">
        <section className="container-1200 mx-auto w-full flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-4 w-full">
            <div className="text-center w-full">
              <h1 className="text-3xl sm:text-4xl font-extrabold">Founder Login</h1>
              <p className="text-white/60 mt-1">Sign in to your account</p>
            </div>
          </div>
          <div className="mt-10 w-full flex items-center justify-center">
            <div className="relative w-full max-w-md">
              <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 shadow-[0_10px_50px_rgba(0,0,0,.35)]">
                <div className="p-6 sm:p-8">
                  <form onSubmit={handleLogin} className="space-y-6">
                    <label className="block">
                      <span className="block text-xs uppercase tracking-wide text-white/60 mb-1">Email</span>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full rounded-lg bg-white/10 text-white border border-white/15 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30" />
                    </label>
                    <label className="block">
                      <span className="block text-xs uppercase tracking-wide text-white/60 mb-1">Password</span>
                      <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full rounded-lg bg-white/10 text-white border border-white/15 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30" />
                    </label>
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    <Button type="submit" disabled={loading} magnetic className="w-full">{loading ? "Logging in..." : "Login"}</Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
