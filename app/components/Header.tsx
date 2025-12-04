"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/app/lib/auth-client";
import { useCart } from "@/app/contexts/CartContext";

export default function Header() {
  const { data: session, isPending } = authClient.useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const { totalItems } = useCart();

  const user = session?.user;

  const handleSignOut = async () => {
    await authClient.signOut();
    setShowDropdown(false);
    window.location.reload();
  };

  return (
    <header
      className="sticky top-0 z-50 px-6 py-4 backdrop-blur-md"
      style={{
        background: "rgba(12, 14, 20, 0.8)",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
            style={{ background: "linear-gradient(135deg, var(--accent-primary), var(--gradient-end))" }}
          >
            🎮
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
              Game<span style={{ color: "var(--accent-primary)" }}>Vault</span>
            </h1>
          </div>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Cart Button */}
          <Link
            href="/cart"
            className="relative p-2 rounded-lg transition-colors hover:bg-white/10"
            style={{ color: "var(--foreground)" }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {totalItems > 0 && (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: "var(--accent-secondary)",
                  color: "white",
                }}
              >
                {totalItems}
              </span>
            )}
          </Link>

          {/* Auth Section */}
          {isPending ? (
            <div
              className="w-8 h-8 rounded-full animate-pulse"
              style={{ background: "var(--background-elevated)" }}
            />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
                style={{
                  background: "var(--background-elevated)",
                  color: "var(--foreground)",
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    background: "linear-gradient(135deg, var(--accent-primary), var(--gradient-end))",
                    color: "white",
                  }}
                >
                  {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block font-medium">{user.name || user.email}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${showDropdown ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              {showDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDropdown(false)}
                  />
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-lg overflow-hidden shadow-xl z-50"
                    style={{
                      background: "var(--background-card)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    <div className="p-3 border-b" style={{ borderColor: "var(--border-subtle)" }}>
                      <p className="font-medium" style={{ color: "var(--foreground)" }}>
                        {user.name}
                      </p>
                      <p className="text-sm truncate" style={{ color: "var(--foreground-muted)" }}>
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/orders"
                      onClick={() => setShowDropdown(false)}
                      className="w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2 hover:bg-white/5"
                      style={{ color: "var(--foreground-muted)" }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                        />
                      </svg>
                      My Orders
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2 hover:bg-white/5"
                      style={{ color: "var(--foreground-muted)" }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/signin"
                className="px-4 py-2 rounded-lg font-medium transition-colors"
                style={{
                  color: "var(--foreground)",
                }}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, var(--accent-primary), var(--gradient-end))",
                  color: "white",
                }}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
