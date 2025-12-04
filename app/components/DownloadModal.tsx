"use client";

import { useState } from "react";
import { GAMES } from "@/app/data/games";

interface OrderItem {
  id: string;
  gameId: string;
  gameTitle: string;
  storeName: string;
  price: string;
}

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  orderId: string;
}

// Generate a fake game key based on order and game
function generateGameKey(orderId: string, gameId: string, storeName: string): string {
  const hash = (orderId + gameId + storeName).split("").reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let key = "";
  
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      key += chars[(hash * (i + 1) * (j + 1) + i * j) % chars.length];
    }
    if (i < 4) key += "-";
  }
  
  return key;
}

// Get store redemption URLs
function getStoreRedemptionUrl(storeName: string): string {
  const urls: Record<string, string> = {
    "Steam": "https://store.steampowered.com/account/registerkey",
    "GOG": "https://www.gog.com/redeem",
    "Epic Games": "https://www.epicgames.com/store/redeem",
    "PlayStation Store": "https://store.playstation.com/redeem",
    "Xbox Store": "https://redeem.microsoft.com",
    "Nintendo eShop": "https://ec.nintendo.com/redeem",
    "Rockstar Store": "https://socialclub.rockstargames.com/activate",
    "Amazon": "https://www.amazon.com/gp/digital/redeem",
    "GameStop": "https://www.gamestop.com/poweruprewards/redeem",
  };
  return urls[storeName] || "#";
}

// Get store icon
function getStoreIcon(storeName: string): string {
  const icons: Record<string, string> = {
    "Steam": "🎮",
    "GOG": "🌟",
    "Epic Games": "🎯",
    "PlayStation Store": "🎲",
    "Xbox Store": "💚",
    "Nintendo eShop": "🍄",
    "Rockstar Store": "⭐",
    "Amazon": "📦",
    "GameStop": "🏪",
  };
  return icons[storeName] || "🎮";
}

export default function DownloadModal({ isOpen, onClose, items, orderId }: DownloadModalProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [hoveredCopy, setHoveredCopy] = useState<string | null>(null);
  const [hoveredRedeem, setHoveredRedeem] = useState<string | null>(null);
  const [hoveredClose, setHoveredClose] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = async (key: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedKey(itemId);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl animate-in fade-in zoom-in-95 duration-200"
        style={{
          background: "var(--background-card)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 p-6 border-b flex items-center justify-between z-10"
          style={{
            background: "var(--background-card)",
            borderColor: "var(--border-subtle)",
          }}
        >
          <div>
            <h2 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
              🎮 Your Game Keys
            </h2>
            <p className="text-sm mt-1" style={{ color: "var(--foreground-muted)" }}>
              Redeem these keys on the respective platforms
            </p>
          </div>
          <button
            onClick={onClose}
            onMouseEnter={() => setHoveredClose(true)}
            onMouseLeave={() => setHoveredClose(false)}
            className="p-2 rounded-lg transition-all duration-300"
            style={{ 
              color: hoveredClose ? "var(--foreground)" : "var(--foreground-muted)",
              background: hoveredClose ? "rgba(239, 68, 68, 0.2)" : "transparent",
              transform: hoveredClose ? "rotate(90deg)" : "rotate(0deg)",
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {items.map((item) => {
            const game = GAMES.find((g) => g.id === item.gameId);
            const gameKey = generateGameKey(orderId, item.gameId, item.storeName);
            const redemptionUrl = getStoreRedemptionUrl(item.storeName);
            const storeIcon = getStoreIcon(item.storeName);
            const isCopyHovered = hoveredCopy === item.id;
            const isRedeemHovered = hoveredRedeem === item.id;

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl transition-all duration-300"
                style={{
                  background: "var(--background-elevated)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                {/* Game Info */}
                <div className="flex gap-4 mb-4">
                  <div className="w-16 h-20 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={game?.cover}
                      alt={item.gameTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                      {item.gameTitle}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg">{storeIcon}</span>
                      <span className="text-sm" style={{ color: "var(--foreground-muted)" }}>
                        {item.storeName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Game Key */}
                <div className="mb-3">
                  <label className="text-xs font-medium uppercase tracking-wide mb-2 block" style={{ color: "var(--foreground-muted)" }}>
                    Product Key
                  </label>
                  <div className="flex gap-2">
                    <div
                      className="flex-1 px-4 py-3 rounded-lg font-mono text-sm tracking-wider select-all"
                      style={{
                        background: "var(--background)",
                        border: "1px solid var(--border-subtle)",
                        color: "var(--accent-primary)",
                      }}
                    >
                      {gameKey}
                    </div>
                    <button
                      onClick={() => copyToClipboard(gameKey, item.id)}
                      onMouseEnter={() => setHoveredCopy(item.id)}
                      onMouseLeave={() => setHoveredCopy(null)}
                      className="px-4 py-3 rounded-lg font-medium text-sm transition-all duration-300"
                      style={{
                        background: copiedKey === item.id 
                          ? "var(--accent-success)" 
                          : isCopyHovered 
                            ? "var(--accent-primary)" 
                            : "var(--background)",
                        border: `1px solid ${isCopyHovered ? "var(--accent-primary)" : "var(--border-subtle)"}`,
                        color: copiedKey === item.id || isCopyHovered ? "white" : "var(--foreground)",
                        transform: isCopyHovered ? "scale(1.05)" : "scale(1)",
                        boxShadow: isCopyHovered ? "0 4px 15px rgba(0, 217, 255, 0.3)" : "none",
                      }}
                    >
                      {copiedKey === item.id ? "✓ Copied!" : "Copy"}
                    </button>
                  </div>
                </div>

                {/* Redeem Button */}
                <a
                  href={redemptionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setHoveredRedeem(item.id)}
                  onMouseLeave={() => setHoveredRedeem(null)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-medium transition-all duration-300"
                  style={{
                    background: isRedeemHovered 
                      ? "linear-gradient(135deg, var(--gradient-end), var(--accent-primary))" 
                      : "linear-gradient(135deg, var(--accent-primary), var(--gradient-end))",
                    color: "white",
                    transform: isRedeemHovered ? "scale(1.02) translateY(-2px)" : "scale(1) translateY(0)",
                    boxShadow: isRedeemHovered 
                      ? "0 8px 25px rgba(124, 58, 237, 0.4), 0 4px 10px rgba(0, 217, 255, 0.3)" 
                      : "0 2px 10px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <svg 
                    className="w-5 h-5 transition-transform duration-300" 
                    style={{ transform: isRedeemHovered ? "translate(2px, -2px)" : "translate(0, 0)" }}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Redeem on {item.storeName}
                </a>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          className="sticky bottom-0 p-6 border-t"
          style={{
            background: "var(--background-card)",
            borderColor: "var(--border-subtle)",
          }}
        >
          <div
            className="p-4 rounded-lg text-sm"
            style={{
              background: "rgba(0, 217, 255, 0.1)",
              border: "1px solid rgba(0, 217, 255, 0.2)",
            }}
          >
            <p className="font-medium mb-1" style={{ color: "var(--accent-primary)" }}>
              💡 How to redeem your games:
            </p>
            <ol className="list-decimal list-inside space-y-1" style={{ color: "var(--foreground-muted)" }}>
              <li>Copy the product key above</li>
              <li>Click &quot;Redeem&quot; to go to the store</li>
              <li>Paste the key and follow the instructions</li>
              <li>Download and enjoy your game!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
