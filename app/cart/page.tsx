"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/app/contexts/CartContext";
import { GAMES } from "@/app/data/games";
import Header from "@/app/components/Header";

export default function CartPage() {
  const { items, loading, removeFromCart, totalPrice } = useCart();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemove = async (gameId: string) => {
    setRemovingId(gameId);
    await removeFromCart(gameId);
    setRemovingId(null);
  };

  const cartItemsWithDetails = items.map((item) => {
    const game = GAMES.find((g) => g.id === item.gameId);
    return { ...item, game };
  });

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
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

      <Header />

      <main className="relative z-10 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8" style={{ color: "var(--foreground)" }}>
            🛒 Shopping Cart
          </h1>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin w-8 h-8 border-2 border-t-transparent rounded-full mx-auto mb-4" style={{ borderColor: "var(--accent-primary)" }} />
              <p style={{ color: "var(--foreground-muted)" }}>Loading cart...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-semibold mb-2" style={{ color: "var(--foreground)" }}>
                Your cart is empty
              </h2>
              <p className="mb-6" style={{ color: "var(--foreground-muted)" }}>
                Browse our games and add some to your cart!
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, var(--accent-primary), var(--gradient-end))",
                  color: "white",
                }}
              >
                Browse Games
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Cart Items */}
              <div className="space-y-4">
                {cartItemsWithDetails.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 rounded-xl"
                    style={{
                      background: "var(--background-card)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    {/* Game Image */}
                    <div className="w-24 h-32 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={item.game?.cover}
                        alt={item.game?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Game Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/games/${item.gameId}`}
                        className="text-lg font-semibold hover:underline"
                        style={{ color: "var(--foreground)" }}
                      >
                        {item.game?.title || "Unknown Game"}
                      </Link>
                      <p className="text-sm mt-1" style={{ color: "var(--foreground-muted)" }}>
                        {item.game?.developer}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className="px-2 py-1 text-xs rounded-md"
                          style={{
                            background: "var(--background-elevated)",
                            color: "var(--foreground-muted)",
                          }}
                        >
                          {item.storeName}
                        </span>
                      </div>
                    </div>

                    {/* Price & Remove */}
                    <div className="flex flex-col items-end justify-between">
                      <span className="text-xl font-bold" style={{ color: "var(--accent-primary)" }}>
                        ${parseFloat(item.price).toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleRemove(item.gameId)}
                        disabled={removingId === item.gameId}
                        className="px-3 py-1 text-sm rounded-lg transition-colors hover:bg-red-500/20"
                        style={{ color: "#ef4444" }}
                      >
                        {removingId === item.gameId ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div
                className="p-6 rounded-xl"
                style={{
                  background: "var(--background-card)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg" style={{ color: "var(--foreground-muted)" }}>
                    Subtotal ({items.length} {items.length === 1 ? "item" : "items"})
                  </span>
                  <span className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full py-4 rounded-xl font-semibold text-center text-lg transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    background: "linear-gradient(135deg, var(--accent-primary), var(--gradient-end))",
                    color: "white",
                  }}
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/"
                  className="block w-full py-3 mt-3 rounded-xl font-medium text-center transition-colors hover:bg-white/5"
                  style={{ color: "var(--foreground-muted)" }}
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

