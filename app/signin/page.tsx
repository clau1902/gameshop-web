"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/app/lib/auth-client";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || "Sign in failed");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("An error occurred during sign in");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--background)" }}>
      {/* Background Pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(0, 217, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(124, 58, 237, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(255, 107, 53, 0.05) 0%, transparent 50%)
          `,
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ background: "linear-gradient(135deg, var(--accent-primary), var(--gradient-end))" }}
          >
            🎮
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
              Game<span style={{ color: "var(--accent-primary)" }}>Vault</span>
            </h1>
          </div>
        </Link>

        {/* Sign In Card */}
        <div
          className="p-8 rounded-2xl"
          style={{
            background: "var(--background-card)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <h2 className="text-2xl font-bold text-center mb-2" style={{ color: "var(--foreground)" }}>
            Welcome Back
          </h2>
          <p className="text-center mb-6" style={{ color: "var(--foreground-muted)" }}>
            Sign in to access your wishlist and more
          </p>

          {error && (
            <div
              className="mb-4 p-3 rounded-lg text-sm"
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#ef4444",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--foreground)" }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg outline-none transition-all duration-200 focus:ring-2"
                style={{
                  background: "var(--background-elevated)",
                  color: "var(--foreground)",
                  border: "1px solid var(--border-subtle)",
                }}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--foreground)" }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg outline-none transition-all duration-200 focus:ring-2"
                style={{
                  background: "var(--background-elevated)",
                  color: "var(--foreground)",
                  border: "1px solid var(--border-subtle)",
                }}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, var(--accent-primary), var(--gradient-end))",
                color: "white",
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p style={{ color: "var(--foreground-muted)" }}>
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-medium hover:underline"
                style={{ color: "var(--accent-primary)" }}
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm hover:underline"
            style={{ color: "var(--foreground-muted)" }}
          >
            ← Back to Browse
          </Link>
        </div>
      </div>
    </div>
  );
}
