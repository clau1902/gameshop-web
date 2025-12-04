"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { authClient } from "@/app/lib/auth-client";

interface CartItem {
  id: string;
  gameId: string;
  storeName: string;
  price: string;
  createdAt: string;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (gameId: string, storeName: string, price: number) => Promise<{ success: boolean; error?: string }>;
  removeFromCart: (gameId: string) => Promise<{ success: boolean; error?: string }>;
  clearCart: () => void;
  isInCart: (gameId: string) => boolean;
  totalItems: number;
  totalPrice: number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = authClient.useSession();

  const fetchCart = useCallback(async () => {
    if (!session?.user) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/cart");
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  }, [session?.user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (gameId: string, storeName: string, price: number) => {
    if (!session?.user) {
      return { success: false, error: "Please sign in to add items to cart" };
    }

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, storeName, price }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error };
      }

      setItems((prev) => [...prev, data.item]);
      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to add to cart" };
    }
  };

  const removeFromCart = async (gameId: string) => {
    if (!session?.user) {
      return { success: false, error: "Please sign in" };
    }

    try {
      const response = await fetch(`/api/cart?gameId=${gameId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        return { success: false, error: data.error };
      }

      setItems((prev) => prev.filter((item) => item.gameId !== gameId));
      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to remove from cart" };
    }
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (gameId: string) => {
    return items.some((item) => item.gameId === gameId);
  };

  const totalItems = items.length;
  const totalPrice = items.reduce((sum, item) => sum + parseFloat(item.price), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        totalItems,
        totalPrice,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

