"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { GAMES, Game } from "@/app/data/games";
import { useCart } from "@/app/contexts/CartContext";

function StarRating({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className={`flex gap-0.5 ${sizeClasses[size]}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{ color: star <= Math.round(rating) ? "var(--star-filled)" : "var(--star-empty)" }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function PlatformBadge({ platform }: { platform: string }) {
  const colors: Record<string, string> = {
    PC: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    PlayStation: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    Xbox: "bg-green-500/20 text-green-300 border-green-500/30",
    Switch: "bg-red-500/20 text-red-300 border-red-500/30",
  };

  return (
    <span className={`px-3 py-1 text-sm font-medium rounded-lg border ${colors[platform] || "bg-gray-500/20 text-gray-300 border-gray-500/30"}`}>
      {platform}
    </span>
  );
}

export default function GameDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [game, setGame] = useState<Game | null>(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [cartMessage, setCartMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const { addToCart, isInCart } = useCart();

  useEffect(() => {
    const foundGame = GAMES.find((g) => g.id === id);
    setGame(foundGame || null);

    // Check wishlist
    const savedWishlist = localStorage.getItem("gameVaultWishlist");
    if (savedWishlist) {
      const wishlist = JSON.parse(savedWishlist);
      setIsInWishlist(wishlist.includes(id));
    }
  }, [id]);

  const toggleWishlist = () => {
    const savedWishlist = localStorage.getItem("gameVaultWishlist");
    let wishlist: string[] = savedWishlist ? JSON.parse(savedWishlist) : [];
    
    if (isInWishlist) {
      wishlist = wishlist.filter((gameId) => gameId !== id);
    } else {
      wishlist.push(id);
    }
    
    localStorage.setItem("gameVaultWishlist", JSON.stringify(wishlist));
    setIsInWishlist(!isInWishlist);
  };

  const handleAddToCart = async (storeName: string, price: number) => {
    setAddingToCart(storeName);
    setCartMessage(null);
    
    const result = await addToCart(id, storeName, price);
    
    if (result.success) {
      setCartMessage({ type: "success", text: "Added to cart!" });
    } else {
      setCartMessage({ type: "error", text: result.error || "Failed to add to cart" });
    }
    
    setAddingToCart(null);
    setTimeout(() => setCartMessage(null), 3000);
  };

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <div className="text-center">
          <div className="text-6xl mb-4">🎮</div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>Game not found</h1>
          <p className="mb-4" style={{ color: "var(--foreground-muted)" }}>The game you're looking for doesn't exist.</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-lg font-medium"
            style={{ background: "var(--accent-primary)", color: "var(--background)" }}
          >
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  const lowestPrice = Math.min(...game.stores.map((s) => s.price));

  return (
    <div className="min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
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

      {/* Header */}
      <header className="relative z-10 px-6 py-4 border-b" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
              style={{ background: "linear-gradient(135deg, var(--accent-primary), var(--gradient-end))" }}
            >
              🎮
            </div>
            <div>
              <h1 className="text-xl font-bold">
                Game<span style={{ color: "var(--accent-primary)" }}>Vault</span>
              </h1>
            </div>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
            style={{ background: "var(--background-elevated)", color: "var(--foreground-muted)" }}
          >
            <span>←</span> Back to Browse
          </Link>
        </div>
      </header>

      {/* Hero Section with Cover */}
      <div className="relative">
        <div 
          className="absolute inset-0 h-96"
          style={{
            backgroundImage: `url(${game.cover})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(40px) brightness(0.3)",
          }}
        />
        <div className="absolute inset-0 h-96 bg-gradient-to-b from-transparent to-[var(--background)]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cover Image */}
            <div className="shrink-0">
              <div className="relative group">
                <img
                  src={game.cover}
                  alt={game.title}
                  className="w-64 h-96 object-cover rounded-xl shadow-2xl"
                />
                <button
                  onClick={toggleWishlist}
                  className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{
                    background: isInWishlist ? "var(--accent-secondary)" : "rgba(0,0,0,0.7)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <span className="text-2xl">{isInWishlist ? "❤️" : "🤍"}</span>
                </button>
              </div>
            </div>

            {/* Game Info */}
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                {game.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 text-sm rounded-full"
                    style={{
                      background: "var(--accent-primary)",
                      color: "var(--background)",
                    }}
                  >
                    {genre}
                  </span>
                ))}
              </div>

              <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">{game.title}</h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <StarRating rating={game.rating} size="lg" />
                  <span className="text-2xl font-bold">{game.rating}</span>
                </div>
                <span style={{ color: "var(--foreground-muted)" }}>
                  {game.reviewCount.toLocaleString()} reviews
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-6" style={{ color: "var(--foreground-muted)" }}>
                <span>🏢 {game.developer}</span>
                <span>📦 {game.publisher}</span>
                <span>📅 {new Date(game.releaseDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {game.platforms.map((platform) => (
                  <PlatformBadge key={platform} platform={platform} />
                ))}
              </div>

              <p className="text-lg mb-6" style={{ color: "var(--foreground-muted)" }}>
                {game.description}
              </p>

              {/* Price & Buy Section */}
              <div 
                className="p-6 rounded-xl"
                style={{ background: "var(--background-card)", border: "1px solid var(--border-subtle)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-sm" style={{ color: "var(--foreground-muted)" }}>Starting from</span>
                    <div className="text-3xl font-bold" style={{ color: "var(--accent-success)" }}>
                      ${lowestPrice.toFixed(2)}
                    </div>
                  </div>
                  <button
                    onClick={toggleWishlist}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                    style={{
                      background: isInWishlist ? "var(--accent-secondary)" : "var(--background-elevated)",
                      color: isInWishlist ? "white" : "var(--foreground)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    <span>{isInWishlist ? "❤️" : "🤍"}</span>
                    {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
                  </button>
                </div>

                {/* Cart Message */}
                {cartMessage && (
                  <div
                    className="mb-4 p-3 rounded-lg text-sm text-center"
                    style={{
                      background: cartMessage.type === "success" ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
                      border: `1px solid ${cartMessage.type === "success" ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                      color: cartMessage.type === "success" ? "#22c55e" : "#ef4444",
                    }}
                  >
                    {cartMessage.text}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {game.stores.map((store) => (
                    <div
                      key={store.name}
                      className="p-4 rounded-lg"
                      style={{
                        background: "var(--background-elevated)",
                        border: "1px solid var(--border-subtle)",
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{store.logo}</span>
                          <span className="font-medium">{store.name}</span>
                        </div>
                        <span className="font-mono font-bold" style={{ color: "var(--accent-success)" }}>
                          ${store.price}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={store.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 px-3 rounded-lg text-sm font-medium text-center transition-colors hover:bg-white/10"
                          style={{
                            border: "1px solid var(--border-subtle)",
                            color: "var(--foreground)",
                          }}
                        >
                          View Store
                        </a>
                        {isInCart(id) ? (
                          <Link
                            href="/cart"
                            className="flex-1 py-2 px-3 rounded-lg text-sm font-medium text-center transition-colors"
                            style={{
                              background: "var(--accent-success)",
                              color: "white",
                            }}
                          >
                            In Cart ✓
                          </Link>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(store.name, store.price)}
                            disabled={addingToCart === store.name}
                            className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50"
                            style={{
                              background: "linear-gradient(135deg, var(--accent-primary), var(--gradient-end))",
                              color: "white",
                            }}
                          >
                            {addingToCart === store.name ? "Adding..." : "Add to Cart"}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Storyline */}
            <section
              className="p-6 rounded-xl"
              style={{ background: "var(--background-card)", border: "1px solid var(--border-subtle)" }}
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span>📖</span> Storyline
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
                {game.storyline}
              </p>
            </section>

            {/* Screenshots */}
            <section
              className="p-6 rounded-xl"
              style={{ background: "var(--background-card)", border: "1px solid var(--border-subtle)" }}
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span>🖼️</span> Screenshots
              </h2>
              <div className="space-y-4">
                <div className="relative aspect-video rounded-lg overflow-hidden" style={{ background: "var(--background-elevated)" }}>
                  <img
                    src={game.screenshots[selectedScreenshot]}
                    alt={`${game.title} screenshot ${selectedScreenshot + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = game.cover;
                    }}
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {game.screenshots.map((screenshot, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedScreenshot(index)}
                      className="shrink-0 w-32 h-20 rounded-lg overflow-hidden transition-all duration-200"
                      style={{
                        border: selectedScreenshot === index 
                          ? "2px solid var(--accent-primary)" 
                          : "2px solid transparent",
                        opacity: selectedScreenshot === index ? 1 : 0.6,
                        background: "var(--background-elevated)"
                      }}
                    >
                      <img
                        src={screenshot}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = game.cover;
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Reviews */}
            <section
              className="p-6 rounded-xl"
              style={{ background: "var(--background-card)", border: "1px solid var(--border-subtle)" }}
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span>💬</span> User Reviews
              </h2>
              <div className="space-y-4">
                {(showAllReviews ? game.reviews : game.reviews.slice(0, 3)).map((review, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg"
                    style={{ background: "var(--background-elevated)" }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                          style={{ background: "var(--accent-primary)", color: "var(--background)" }}
                        >
                          {review.author[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{review.author}</div>
                          <div className="text-xs" style={{ color: "var(--foreground-muted)" }}>
                            {new Date(review.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                          </div>
                        </div>
                      </div>
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                    <p style={{ color: "var(--foreground-muted)" }}>{review.text}</p>
                  </div>
                ))}
                {game.reviews.length > 3 && !showAllReviews && (
                  <button
                    onClick={() => setShowAllReviews(true)}
                    className="w-full py-3 rounded-lg font-medium transition-colors"
                    style={{
                      background: "var(--background-elevated)",
                      color: "var(--accent-primary)",
                      border: "1px solid var(--border-accent)",
                    }}
                  >
                    Show All {game.reviews.length} Reviews
                  </button>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Features */}
            <section
              className="p-6 rounded-xl"
              style={{ background: "var(--background-card)", border: "1px solid var(--border-subtle)" }}
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>✨</span> Features
              </h2>
              <ul className="space-y-3">
                {game.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span style={{ color: "var(--accent-primary)" }}>✓</span>
                    <span style={{ color: "var(--foreground-muted)" }}>{feature}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Game Info */}
            <section
              className="p-6 rounded-xl"
              style={{ background: "var(--background-card)", border: "1px solid var(--border-subtle)" }}
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>ℹ️</span> Game Info
              </h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm" style={{ color: "var(--foreground-muted)" }}>Developer</dt>
                  <dd className="font-medium">{game.developer}</dd>
                </div>
                <div>
                  <dt className="text-sm" style={{ color: "var(--foreground-muted)" }}>Publisher</dt>
                  <dd className="font-medium">{game.publisher}</dd>
                </div>
                <div>
                  <dt className="text-sm" style={{ color: "var(--foreground-muted)" }}>Release Date</dt>
                  <dd className="font-medium">
                    {new Date(game.releaseDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm" style={{ color: "var(--foreground-muted)" }}>Genres</dt>
                  <dd className="font-medium">{game.genres.join(", ")}</dd>
                </div>
                <div>
                  <dt className="text-sm" style={{ color: "var(--foreground-muted)" }}>Platforms</dt>
                  <dd className="font-medium">{game.platforms.join(", ")}</dd>
                </div>
              </dl>
            </section>

            {/* Quick Buy */}
            <section
              className="p-6 rounded-xl sticky top-6"
              style={{ background: "var(--background-card)", border: "1px solid var(--border-accent)" }}
            >
              <div className="text-center mb-4">
                <div className="text-sm" style={{ color: "var(--foreground-muted)" }}>Best Price</div>
                <div className="text-4xl font-bold" style={{ color: "var(--accent-success)" }}>
                  ${lowestPrice.toFixed(2)}
                </div>
              </div>
              <a
                href={game.stores.find(s => s.price === lowestPrice)?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 rounded-lg font-bold text-center transition-all duration-200 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, var(--accent-primary), var(--gradient-end))",
                  color: "white",
                }}
              >
                Buy Now
              </a>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>
            © 2024 GameVault. All game prices are subject to change.
          </p>
        </div>
      </footer>
    </div>
  );
}

