"use client";

import {
  createElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";

import type { CartItem, CartState } from "@/types/cart";
import type { Product } from "@/types/product";

interface CartContextValue extends CartState {
  totalItems: number;
  subtotal: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setOrderNote: (note: string) => void;
  clearCart: () => void;
}

const STORAGE_KEY = "mini-app-cart";

const defaultState: CartState = {
  items: [],
  orderNote: ""
};

const CartContext = createContext<CartContextValue | null>(null);

function readStoredState(): CartState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "items" in parsed &&
      Array.isArray((parsed as CartState).items)
    ) {
      return parsed as CartState;
    }
    return defaultState;
  } catch {
    return defaultState;
  }
}

export function CartProvider({ children }: { children: ReactNode }): JSX.Element {
  const [state, setState] = useState<CartState>(defaultState);
  const hydrated = useRef(false);

  useEffect(() => {
    setState(readStoredState());
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* quota / private mode — cart stays in memory for this session */
    }
  }, [state]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    setState((prev) => {
      const existing = prev.items.find((i) => i.product.id === product.id);
      if (!existing) {
        const capped = Math.min(quantity, product.stock);
        return { ...prev, items: [...prev.items, { product, quantity: Math.max(1, capped) }] };
      }
      return {
        ...prev,
        items: prev.items.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
            : i
        )
      };
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.product.id !== productId)
    }));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setState((prev) => ({
      ...prev,
      items: prev.items
        .map((i) => {
          if (i.product.id !== productId) return i;
          return { ...i, quantity: Math.max(1, Math.min(quantity, i.product.stock)) };
        })
        .filter((i) => i.quantity > 0)
    }));
  }, []);

  const setOrderNote = useCallback((note: string) => {
    setState((prev) => ({ ...prev, orderNote: note }));
  }, []);

  const clearCart = useCallback(() => {
    setState(defaultState);
  }, []);

  const subtotal = useMemo(
    () => state.items.reduce((sum, i) => sum + i.quantity * i.product.price, 0),
    [state.items]
  );

  const totalItems = useMemo(
    () => state.items.reduce((sum, i) => sum + i.quantity, 0),
    [state.items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      ...state,
      subtotal,
      totalItems,
      addItem,
      removeItem,
      updateQuantity,
      setOrderNote,
      clearCart
    }),
    [addItem, clearCart, removeItem, setOrderNote, state, subtotal, totalItems, updateQuantity]
  );

  return createElement(CartContext.Provider, { value }, children);
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
