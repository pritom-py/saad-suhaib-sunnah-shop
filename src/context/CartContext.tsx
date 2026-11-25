"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItemType {
  productId: string;
  variantId?: string | null;
  nameBn: string;
  nameEn: string;
  variantName?: string | null;
  price: number;
  quantity: number;
  imageUrl?: string;
  sku: string;
}

interface CartContextType {
  items: CartItemType[];
  addItem: (item: Omit<CartItemType, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, variantId?: string | null) => void;
  updateQuantity: (productId: string, variantId: string | null | undefined, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/** A cart line is one product + variant; "no variant" may be stored as null or undefined. */
const sameLine = (item: CartItemType, productId: string, variantId?: string | null) =>
  item.productId === productId && (item.variantId || null) === (variantId || null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemType[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("saad_cart");
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("saad_cart", JSON.stringify(items));
    }
  }, [items, mounted]);

  const addItem = (newItem: Omit<CartItemType, "quantity">, qty: number = 1) => {
    const variantId = newItem.variantId || null;
    setItems((prev) => {
      const exists = prev.some((i) => sameLine(i, newItem.productId, variantId));
      // never mutate the previous state: React may run this updater twice
      return exists
        ? prev.map((i) => (sameLine(i, newItem.productId, variantId) ? { ...i, quantity: i.quantity + qty } : i))
        : [...prev, { ...newItem, variantId, quantity: qty }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (productId: string, variantId?: string | null) => {
    setItems((prev) => prev.filter((i) => !sameLine(i, productId, variantId)));
  };

  const updateQuantity = (
    productId: string,
    variantId: string | null | undefined,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeItem(productId, variantId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => {
        if (sameLine(i, productId, variantId)) {
          return { ...i, quantity };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        totalItems,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
