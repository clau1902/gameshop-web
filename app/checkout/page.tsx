"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/app/contexts/CartContext";
import { GAMES } from "@/app/data/games";
import Header from "@/app/components/Header";
import { authClient } from "@/app/lib/auth-client";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const cartItemsWithDetails = items.map((item) => {
    const game = GAMES.find((g) => g.id === item.gameId);
    return { ...item, game };
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate form
    if (paymentMethod === "card") {
      if (!cardNumber || !expiryDate || !cvv || !cardName) {
        setError("Please fill in all card details");
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethod }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to process order");
        setLoading(false);
        return;
      }

      // Clear cart and redirect to success
      clearCart();
      router.push(`/orders?success=true&orderId=${data.order.id}`);
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen" style={{ background: "var(--background)" }}>
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-semibold mb-2" style={{ color: "var(--foreground)" }}>
              Please sign in to checkout
            </h2>
            <p className="mb-6" style={{ color: "var(--foreground-muted)" }}>
              You need to be signed in to complete your purchase.
            </p>
            <Link
              href="/signin"
              className="inline-block px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, var(--accent-primary), var(--gradient-end))",
                color: "white",
              }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen" style={{ background: "var(--background)" }}>
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold mb-2" style={{ color: "var(--foreground)" }}>
              Your cart is empty
            </h2>
            <p className="mb-6" style={{ color: "var(--foreground-muted)" }}>
              Add some games to your cart before checkout.
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
        </div>
      </div>
    );
  }

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
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8" style={{ color: "var(--foreground)" }}>
            💳 Checkout
          </h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Payment Form */}
            <div
              className="p-6 rounded-xl"
              style={{
                background: "var(--background-card)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <h2 className="text-xl font-semibold mb-6" style={{ color: "var(--foreground)" }}>
                Payment Method
              </h2>

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

              <form onSubmit={handleSubmit}>
                {/* Payment Method Selection */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { id: "card", label: "Card", icon: "💳" },
                    { id: "paypal", label: "PayPal", icon: "🅿️" },
                    { id: "crypto", label: "Crypto", icon: "₿" },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className="p-4 rounded-lg text-center transition-all duration-200"
                      style={{
                        background: paymentMethod === method.id 
                          ? "var(--accent-primary)" 
                          : "var(--background-elevated)",
                        border: paymentMethod === method.id
                          ? "2px solid var(--accent-primary)"
                          : "2px solid transparent",
                        color: paymentMethod === method.id ? "white" : "var(--foreground)",
                      }}
                    >
                      <div className="text-2xl mb-1">{method.icon}</div>
                      <div className="text-sm font-medium">{method.label}</div>
                    </button>
                  ))}
                </div>

                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        maxLength={19}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 rounded-lg outline-none transition-all duration-200"
                        style={{
                          background: "var(--background-elevated)",
                          color: "var(--foreground)",
                          border: "1px solid var(--border-subtle)",
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-lg outline-none transition-all duration-200"
                        style={{
                          background: "var(--background-elevated)",
                          color: "var(--foreground)",
                          border: "1px solid var(--border-subtle)",
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                          maxLength={5}
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 rounded-lg outline-none transition-all duration-200"
                          style={{
                            background: "var(--background-elevated)",
                            color: "var(--foreground)",
                            border: "1px solid var(--border-subtle)",
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
                          CVV
                        </label>
                        <input
                          type="text"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                          maxLength={4}
                          placeholder="123"
                          className="w-full px-4 py-3 rounded-lg outline-none transition-all duration-200"
                          style={{
                            background: "var(--background-elevated)",
                            color: "var(--foreground)",
                            border: "1px solid var(--border-subtle)",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "paypal" && (
                  <div className="text-center py-8" style={{ color: "var(--foreground-muted)" }}>
                    <p>You will be redirected to PayPal to complete your payment.</p>
                  </div>
                )}

                {paymentMethod === "crypto" && (
                  <div className="text-center py-8" style={{ color: "var(--foreground-muted)" }}>
                    <p>You will receive wallet instructions after placing the order.</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 mt-6 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg, var(--accent-primary), var(--gradient-end))",
                    color: "white",
                  }}
                >
                  {loading ? "Processing..." : `Pay $${totalPrice.toFixed(2)}`}
                </button>
              </form>

              <p className="text-xs text-center mt-4" style={{ color: "var(--foreground-muted)" }}>
                🔒 Your payment information is secure and encrypted
              </p>
            </div>

            {/* Order Summary */}
            <div
              className="p-6 rounded-xl h-fit"
              style={{
                background: "var(--background-card)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <h2 className="text-xl font-semibold mb-6" style={{ color: "var(--foreground)" }}>
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {cartItemsWithDetails.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-20 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={item.game?.cover}
                        alt={item.game?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate" style={{ color: "var(--foreground)" }}>
                        {item.game?.title}
                      </p>
                      <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>
                        {item.storeName}
                      </p>
                    </div>
                    <span className="font-semibold" style={{ color: "var(--accent-primary)" }}>
                      ${parseFloat(item.price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2" style={{ borderColor: "var(--border-subtle)" }}>
                <div className="flex justify-between">
                  <span style={{ color: "var(--foreground-muted)" }}>Subtotal</span>
                  <span style={{ color: "var(--foreground)" }}>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "var(--foreground-muted)" }}>Tax</span>
                  <span style={{ color: "var(--foreground)" }}>$0.00</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t" style={{ borderColor: "var(--border-subtle)" }}>
                  <span style={{ color: "var(--foreground)" }}>Total</span>
                  <span style={{ color: "var(--accent-primary)" }}>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/cart"
                className="block w-full py-3 mt-6 rounded-xl font-medium text-center transition-colors hover:bg-white/5"
                style={{ color: "var(--foreground-muted)" }}
              >
                ← Edit Cart
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

