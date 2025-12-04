"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "@/app/components/Header";
import DownloadModal from "@/app/components/DownloadModal";
import { authClient } from "@/app/lib/auth-client";
import { GAMES } from "@/app/data/games";
import { generateReceipt } from "@/app/lib/receipt";

interface OrderItem {
  id: string;
  gameId: string;
  gameTitle: string;
  storeName: string;
  price: string;
}

interface Order {
  id: string;
  totalAmount: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  
  const { data: session } = authClient.useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadModal, setDownloadModal] = useState<{ isOpen: boolean; order: Order | null }>({
    isOpen: false,
    order: null,
  });

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.user) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/orders");
        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session?.user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen" style={{ background: "var(--background)" }}>
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-semibold mb-2" style={{ color: "var(--foreground)" }}>
              Please sign in to view orders
            </h2>
            <p className="mb-6" style={{ color: "var(--foreground-muted)" }}>
              You need to be signed in to see your order history.
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
          {/* Success Message */}
          {success && (
            <div
              className="mb-8 p-6 rounded-xl text-center"
              style={{
                background: "rgba(34, 197, 94, 0.1)",
                border: "1px solid rgba(34, 197, 94, 0.3)",
              }}
            >
              <div className="text-5xl mb-3">🎉</div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: "#22c55e" }}>
                Order Successful!
              </h2>
              <p style={{ color: "var(--foreground-muted)" }}>
                Thank you for your purchase. Your games are ready to download!
              </p>
              {orderId && (
                <p className="text-sm mt-2" style={{ color: "var(--foreground-muted)" }}>
                  Order ID: {orderId}
                </p>
              )}
            </div>
          )}

          <h1 className="text-3xl font-bold mb-8" style={{ color: "var(--foreground)" }}>
            📦 My Orders
          </h1>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin w-8 h-8 border-2 border-t-transparent rounded-full mx-auto mb-4" style={{ borderColor: "var(--accent-primary)" }} />
              <p style={{ color: "var(--foreground-muted)" }}>Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📭</div>
              <h2 className="text-2xl font-semibold mb-2" style={{ color: "var(--foreground)" }}>
                No orders yet
              </h2>
              <p className="mb-6" style={{ color: "var(--foreground-muted)" }}>
                Start shopping to see your orders here!
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
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-6 rounded-xl"
                  style={{
                    background: "var(--background-card)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  {/* Order Header */}
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4 pb-4 border-b" style={{ borderColor: "var(--border-subtle)" }}>
                    <div>
                      <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>
                        Order placed
                      </p>
                      <p className="font-medium" style={{ color: "var(--foreground)" }}>
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>
                        Total
                      </p>
                      <p className="font-bold text-lg" style={{ color: "var(--accent-primary)" }}>
                        ${parseFloat(order.totalAmount).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>
                        Status
                      </p>
                      <span
                        className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                        style={{
                          background: order.status === "completed" ? "rgba(34, 197, 94, 0.2)" : "rgba(234, 179, 8, 0.2)",
                          color: order.status === "completed" ? "#22c55e" : "#eab308",
                        }}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>
                        Payment
                      </p>
                      <p className="font-medium capitalize" style={{ color: "var(--foreground)" }}>
                        {order.paymentMethod}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items.map((item) => {
                      const game = GAMES.find((g) => g.id === item.gameId);
                      return (
                        <div key={item.id} className="flex gap-3 items-center">
                          <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0">
                            <img
                              src={game?.cover}
                              alt={item.gameTitle}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/games/${item.gameId}`}
                              className="font-medium hover:underline"
                              style={{ color: "var(--foreground)" }}
                            >
                              {item.gameTitle}
                            </Link>
                            <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>
                              {item.storeName}
                            </p>
                          </div>
                          <span className="font-semibold" style={{ color: "var(--foreground)" }}>
                            ${parseFloat(item.price).toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Order Actions */}
                  <div className="mt-4 pt-4 border-t flex gap-3" style={{ borderColor: "var(--border-subtle)" }}>
                    <button
                      onClick={() => setDownloadModal({ isOpen: true, order })}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/5 flex items-center gap-2"
                      style={{
                        background: "var(--background-elevated)",
                        color: "var(--foreground)",
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Games
                    </button>
                    <button
                      onClick={() => {
                        if (session?.user) {
                          generateReceipt(order, {
                            name: session.user.name || "Customer",
                            email: session.user.email || "",
                          });
                        }
                      }}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/5 flex items-center gap-2"
                      style={{ color: "var(--foreground-muted)" }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      View Receipt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Download Modal */}
      {downloadModal.order && (
        <DownloadModal
          isOpen={downloadModal.isOpen}
          onClose={() => setDownloadModal({ isOpen: false, order: null })}
          items={downloadModal.order.items}
          orderId={downloadModal.order.id}
        />
      )}
    </div>
  );
}

