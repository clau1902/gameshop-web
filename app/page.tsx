"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { GAMES, ALL_GENRES, ALL_PLATFORMS, Game } from "@/app/data/games";
import Header from "@/app/components/Header";

// Components
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
    <span className={`px-2 py-0.5 text-xs font-medium rounded border ${colors[platform] || "bg-gray-500/20 text-gray-300 border-gray-500/30"}`}>
      {platform}
    </span>
  );
}

function GameCard({ game, index, isInWishlist, onToggleWishlist }: { 
  game: Game; 
  index: number;
  isInWishlist: boolean;
  onToggleWishlist: (gameId: string) => void;
}) {
  const lowestPrice = Math.min(...game.stores.map((s) => s.price));

  return (
    <article
      className={`group relative rounded-xl overflow-hidden animate-slide-up stagger-${(index % 8) + 1}`}
      style={{
        background: "var(--background-card)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      {/* Clickable Link Overlay */}
      <Link 
        href={`/games/${game.id}`}
        className="absolute inset-0 z-10"
        aria-label={`View details for ${game.title}`}
      />

      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={game.cover}
          alt={game.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background-card)] via-transparent to-transparent" />
        
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWishlist(game.id);
          }}
          className="absolute top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 z-20"
          style={{
            background: isInWishlist ? "var(--accent-secondary)" : "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
          }}
          title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <span className="text-xl">{isInWishlist ? "❤️" : "🤍"}</span>
        </button>
        
        {/* Price Tag */}
        <div className="absolute top-3 right-3 px-3 py-1.5 rounded-lg font-mono font-semibold text-sm"
          style={{ 
            background: "linear-gradient(135deg, var(--accent-primary), var(--gradient-end))",
            color: "white"
          }}>
          From ${lowestPrice.toFixed(2)}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title & Rating */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-lg font-bold leading-tight" style={{ color: "var(--foreground)" }}>
            {game.title}
          </h3>
          <div className="flex flex-col items-end shrink-0">
            <StarRating rating={game.rating} size="sm" />
            <span className="text-xs mt-0.5" style={{ color: "var(--foreground-muted)" }}>
              {game.reviewCount.toLocaleString()} reviews
            </span>
          </div>
        </div>

        {/* Developer & Date */}
        <p className="text-sm mb-3" style={{ color: "var(--foreground-muted)" }}>
          {game.developer} • {new Date(game.releaseDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
        </p>

        {/* Genres */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {game.genres.map((genre) => (
            <span
              key={genre}
              className="px-2 py-0.5 text-xs rounded-full"
              style={{ 
                background: "var(--background-elevated)",
                color: "var(--accent-primary)",
                border: "1px solid var(--border-accent)"
              }}
            >
              {genre}
            </span>
          ))}
        </div>

        {/* Platforms */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {game.platforms.map((platform) => (
            <PlatformBadge key={platform} platform={platform} />
          ))}
        </div>

        {/* Description */}
        <p className="text-sm mb-4 line-clamp-2" style={{ color: "var(--foreground-muted)" }}>
          {game.description}
        </p>

        {/* View Details CTA */}
        <div 
          className="flex items-center justify-between pt-3 border-t"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: "var(--foreground-muted)" }}>
              {game.stores.length} stores
            </span>
          </div>
          <span 
            className="text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all"
            style={{ color: "var(--accent-primary)" }}
          >
            View Details
            <span>→</span>
          </span>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          boxShadow: "inset 0 0 60px rgba(0, 217, 255, 0.1)",
          borderRadius: "12px",
        }}
      />
    </article>
  );
}

function SearchIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  );
}

export default function GameBrowser() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"rating" | "date" | "price">("rating");
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState<"browse" | "wishlist">("browse");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hoveredTab, setHoveredTab] = useState<"browse" | "wishlist" | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem("gameVaultWishlist");
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  // Save wishlist to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("gameVaultWishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Toggle game in wishlist
  const toggleWishlist = (gameId: string) => {
    setWishlist((prev) => 
      prev.includes(gameId) 
        ? prev.filter((id) => id !== gameId)
        : [...prev, gameId]
    );
  };

  // Generate search suggestions based on query
  const suggestions = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (query.length < 1) return [];

    const results: { type: string; value: string; game?: Game }[] = [];
    
    // Add matching games
    GAMES.forEach((game) => {
      if (game.title.toLowerCase().includes(query)) {
        results.push({ type: "game", value: game.title, game });
      }
    });

    // Add matching developers
    const matchingDevs = new Set<string>();
    GAMES.forEach((game) => {
      if (game.developer.toLowerCase().includes(query) && !matchingDevs.has(game.developer)) {
        matchingDevs.add(game.developer);
        results.push({ type: "developer", value: game.developer });
      }
    });

    // Add matching genres
    ALL_GENRES.forEach((genre) => {
      if (genre.toLowerCase().includes(query)) {
        results.push({ type: "genre", value: genre });
      }
    });

    // Add matching platforms
    ALL_PLATFORMS.forEach((platform) => {
      if (platform.toLowerCase().includes(query)) {
        results.push({ type: "platform", value: platform });
      }
    });

    return results.slice(0, 8); // Limit to 8 suggestions
  }, [searchQuery]);

  // Handle keyboard navigation in suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => 
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => 
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter" && selectedSuggestionIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[selectedSuggestionIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  // Select a suggestion
  const selectSuggestion = (suggestion: { type: string; value: string }) => {
    setSearchQuery(suggestion.value);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    inputRef.current?.blur();
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredGames = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    // Start with all games or wishlist based on active tab
    const baseGames = activeTab === "wishlist" 
      ? GAMES.filter((game) => wishlist.includes(game.id))
      : GAMES;
    
    const filtered = baseGames.filter((game) => {
      // Search matching - check multiple fields
      const matchesSearch = query === "" ||
        game.title.toLowerCase().includes(query) ||
        game.developer.toLowerCase().includes(query) ||
        game.description.toLowerCase().includes(query) ||
        game.genres.some((g) => g.toLowerCase().includes(query)) ||
        game.platforms.some((p) => p.toLowerCase().includes(query)) ||
        game.stores.some((s) => s.name.toLowerCase().includes(query));

      // Genre filtering
      const matchesGenres = selectedGenres.length === 0 ||
        selectedGenres.some((genre) => game.genres.includes(genre));

      // Platform filtering
      const matchesPlatforms = selectedPlatforms.length === 0 ||
        selectedPlatforms.some((platform) => game.platforms.includes(platform));

      return matchesSearch && matchesGenres && matchesPlatforms;
    });

    // Sort (use slice to avoid mutating the filtered array)
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "date":
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        case "price":
          return Math.min(...a.stores.map((s) => s.price)) - Math.min(...b.stores.map((s) => s.price));
        default:
          return 0;
      }
    });

    return sorted;
  }, [searchQuery, selectedGenres, selectedPlatforms, sortBy, activeTab, wishlist]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "var(--font-sans)" }}>
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
      <Header />

      {/* Main Content */}
      <div className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              <span style={{ color: "var(--foreground)" }}>Find Your Next </span>
              <span
                style={{
                  background: "linear-gradient(90deg, var(--accent-primary), var(--gradient-end))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Adventure
              </span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--foreground-muted)" }}>
              Browse our curated collection of games, read honest reviews, and find the best prices across all platforms.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div 
              className="inline-flex rounded-xl p-1"
              style={{ background: "var(--background-elevated)" }}
            >
              <button
                onClick={() => setActiveTab("browse")}
                onMouseEnter={() => setHoveredTab("browse")}
                onMouseLeave={() => setHoveredTab(null)}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300"
                style={{
                  background: activeTab === "browse" 
                    ? "var(--accent-primary)" 
                    : hoveredTab === "browse" 
                      ? "rgba(0, 217, 255, 0.2)" 
                      : "transparent",
                  color: activeTab === "browse" 
                    ? "var(--background)" 
                    : hoveredTab === "browse"
                      ? "var(--accent-primary)"
                      : "var(--foreground-muted)",
                  transform: hoveredTab === "browse" && activeTab !== "browse" ? "scale(1.02)" : "scale(1)",
                  boxShadow: hoveredTab === "browse" && activeTab !== "browse" 
                    ? "0 0 15px rgba(0, 217, 255, 0.3)" 
                    : activeTab === "browse"
                      ? "0 4px 15px rgba(0, 217, 255, 0.4)"
                      : "none",
                }}
              >
                <span className="transition-transform duration-300" style={{ 
                  transform: hoveredTab === "browse" ? "scale(1.2)" : "scale(1)" 
                }}>🎮</span>
                Browse Games
              </button>
              <button
                onClick={() => setActiveTab("wishlist")}
                onMouseEnter={() => setHoveredTab("wishlist")}
                onMouseLeave={() => setHoveredTab(null)}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 relative"
                style={{
                  background: activeTab === "wishlist" 
                    ? "var(--accent-secondary)" 
                    : hoveredTab === "wishlist" 
                      ? "rgba(255, 107, 53, 0.2)" 
                      : "transparent",
                  color: activeTab === "wishlist" 
                    ? "white" 
                    : hoveredTab === "wishlist"
                      ? "var(--accent-secondary)"
                      : "var(--foreground-muted)",
                  transform: hoveredTab === "wishlist" && activeTab !== "wishlist" ? "scale(1.02)" : "scale(1)",
                  boxShadow: hoveredTab === "wishlist" && activeTab !== "wishlist" 
                    ? "0 0 15px rgba(255, 107, 53, 0.3)" 
                    : activeTab === "wishlist"
                      ? "0 4px 15px rgba(255, 107, 53, 0.4)"
                      : "none",
                }}
              >
                <span className="transition-transform duration-300" style={{ 
                  transform: hoveredTab === "wishlist" ? "scale(1.2)" : "scale(1)" 
                }}>❤️</span>
                Wishlist
                {wishlist.length > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold transition-all duration-300"
                    style={{ 
                      background: activeTab === "wishlist" ? "var(--accent-primary)" : "var(--accent-secondary)", 
                      color: "white",
                      transform: hoveredTab === "wishlist" ? "scale(1.1)" : "scale(1)",
                    }}
                  >
                    {wishlist.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar with Autocomplete */}
          <div className="max-w-2xl mx-auto mb-8 relative z-50" ref={searchRef}>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-20" style={{ color: "var(--foreground-muted)" }}>
                <SearchIcon />
              </div>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search games, developers, genres..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                  setSelectedSuggestionIndex(-1);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-lg outline-none transition-all duration-200 focus:ring-2 relative z-10"
                style={{
                  background: "var(--background-elevated)",
                  color: "var(--foreground)",
                  border: "1px solid var(--border-subtle)",
                }}
              />
              
              {/* Autocomplete Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div 
                  className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden shadow-2xl z-[100] max-h-[70vh] overflow-y-auto"
                  style={{
                    background: "var(--background-card)",
                    border: "1px solid var(--border-accent)",
                  }}
                >
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={`${suggestion.type}-${suggestion.value}`}
                      onClick={() => selectSuggestion(suggestion)}
                      onMouseEnter={() => setSelectedSuggestionIndex(index)}
                      className="w-full px-4 py-3 flex items-center gap-3 text-left transition-colors duration-150"
                      style={{
                        background: selectedSuggestionIndex === index ? "var(--background-elevated)" : "transparent",
                        color: "var(--foreground)",
                      }}
                    >
                      {/* Type Icon */}
                      <span className="text-lg">
                        {suggestion.type === "game" && "🎮"}
                        {suggestion.type === "developer" && "🏢"}
                        {suggestion.type === "genre" && "🏷️"}
                        {suggestion.type === "platform" && "💻"}
                      </span>
                      
                      {/* Suggestion Content */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{suggestion.value}</div>
                        <div className="text-xs capitalize" style={{ color: "var(--foreground-muted)" }}>
                          {suggestion.type}
                          {suggestion.type === "game" && suggestion.game && (
                            <span> • {suggestion.game.developer} • ⭐ {suggestion.game.rating}</span>
                          )}
                        </div>
                      </div>

                      {/* Game cover thumbnail for games */}
                      {suggestion.type === "game" && suggestion.game && (
                        <img 
                          src={suggestion.game.cover} 
                          alt="" 
                          className="w-10 h-14 object-cover rounded"
                        />
                      )}
                    </button>
                  ))}
                  
                  {/* Search hint */}
                  <div 
                    className="px-4 py-2 text-xs border-t"
                    style={{ 
                      color: "var(--foreground-muted)",
                      borderColor: "var(--border-subtle)",
                      background: "var(--background-elevated)"
                    }}
                  >
                    <kbd className="px-1.5 py-0.5 rounded text-xs mr-1" style={{ background: "var(--background-card)" }}>↑↓</kbd>
                    to navigate
                    <kbd className="px-1.5 py-0.5 rounded text-xs mx-1" style={{ background: "var(--background-card)" }}>Enter</kbd>
                    to select
                    <kbd className="px-1.5 py-0.5 rounded text-xs mx-1" style={{ background: "var(--background-card)" }}>Esc</kbd>
                    to close
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Filter Toggle & Sort */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200"
              style={{
                background: showFilters ? "var(--accent-primary)" : "var(--background-elevated)",
                color: showFilters ? "var(--background)" : "var(--foreground)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <FilterIcon />
              Filters
              {(selectedGenres.length > 0 || selectedPlatforms.length > 0) && (
                <span
                  className="w-5 h-5 rounded-full text-xs flex items-center justify-center"
                  style={{ background: "var(--accent-secondary)", color: "white" }}
                >
                  {selectedGenres.length + selectedPlatforms.length}
                </span>
              )}
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: "var(--foreground-muted)" }}>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "rating" | "date" | "price")}
                className="px-3 py-2 rounded-lg outline-none cursor-pointer"
                style={{
                  background: "var(--background-elevated)",
                  color: "var(--foreground)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <option value="rating">Top Rated</option>
                <option value="date">Newest</option>
                <option value="price">Lowest Price</option>
              </select>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div
              className="max-w-4xl mx-auto p-6 rounded-xl mb-8 animate-slide-up"
              style={{
                background: "var(--background-card)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              {/* Genres */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--foreground-muted)" }}>
                  Genres
                </h3>
                <div className="flex flex-wrap gap-2">
                  {ALL_GENRES.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => toggleGenre(genre)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                      style={{
                        background: selectedGenres.includes(genre) ? "var(--accent-primary)" : "var(--background-elevated)",
                        color: selectedGenres.includes(genre) ? "var(--background)" : "var(--foreground)",
                        border: `1px solid ${selectedGenres.includes(genre) ? "var(--accent-primary)" : "var(--border-subtle)"}`,
                      }}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Platforms */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--foreground-muted)" }}>
                  Platforms
                </h3>
                <div className="flex flex-wrap gap-2">
                  {ALL_PLATFORMS.map((platform) => (
                    <button
                      key={platform}
                      onClick={() => togglePlatform(platform)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                      style={{
                        background: selectedPlatforms.includes(platform) ? "var(--accent-primary)" : "var(--background-elevated)",
                        color: selectedPlatforms.includes(platform) ? "var(--background)" : "var(--foreground)",
                        border: `1px solid ${selectedPlatforms.includes(platform) ? "var(--accent-primary)" : "var(--border-subtle)"}`,
                      }}
                    >
                      {platform}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedGenres.length > 0 || selectedPlatforms.length > 0) && (
                <button
                  onClick={() => {
                    setSelectedGenres([]);
                    setSelectedPlatforms([]);
                  }}
                  className="mt-4 text-sm font-medium"
                  style={{ color: "var(--accent-secondary)" }}
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Results Count */}
          <div className="text-center mb-8">
            <p style={{ color: "var(--foreground-muted)" }}>
              {activeTab === "wishlist" ? (
                <>
                  <span style={{ color: "var(--accent-secondary)" }}>{filteredGames.length}</span> games in your wishlist
                </>
              ) : (
                <>
                  Showing <span style={{ color: "var(--accent-primary)" }}>{filteredGames.length}</span> games
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <main className="relative z-10 px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          {filteredGames.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.map((game, index) => (
                <GameCard 
                  key={game.id} 
                  game={game} 
                  index={index}
                  isInWishlist={wishlist.includes(game.id)}
                  onToggleWishlist={toggleWishlist}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">{activeTab === "wishlist" ? "❤️" : "🎮"}</div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--foreground)" }}>
                {activeTab === "wishlist" ? "Your wishlist is empty" : "No games found"}
              </h3>
              <p style={{ color: "var(--foreground-muted)" }}>
                {activeTab === "wishlist" 
                  ? "Browse games and click the heart to add them to your wishlist"
                  : "Try adjusting your search or filters"
                }
              </p>
              {activeTab === "wishlist" && (
                <button
                  onClick={() => setActiveTab("browse")}
                  className="mt-4 px-6 py-2 rounded-lg font-medium transition-all duration-200"
                  style={{
                    background: "var(--accent-primary)",
                    color: "var(--background)",
                  }}
                >
                  Browse Games
                </button>
              )}
            </div>
          )}
        </div>
      </main>

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
