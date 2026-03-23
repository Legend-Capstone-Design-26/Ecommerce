import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { resolveProductImage } from "@/lib/catalog";

export interface CartItem {
  id: string;
  productId: number;
  productVariantId: number;
  name: string;
  image: string;
  color: string;
  colorCode?: string | null;
  size: string;
  originalPrice: number;
  memberPrice: number;
  quantity: number;
  stock?: number;
}

interface CartResponse {
  success: boolean;
  items: CartItem[];
}

interface CartContextValue {
  items: CartItem[];
  totalCount: number;
  subtotal: number;
  isLoading: boolean;
  addItem: (item: {
    productId: number;
    color: string;
    size: string;
    quantity?: number;
  }) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    const response = await apiFetch<CartResponse>("/api/cart");
    setItems(
      response.items.map((item) => ({
        ...item,
        image: resolveProductImage(item.image),
      }))
    );
    setIsLoading(false);
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    void refreshCart().catch(() => {
      setItems([]);
      setIsLoading(false);
    });
  }, [isAuthLoading, refreshCart]);

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.memberPrice * item.quantity,
    0
  );

  const addItem = useCallback(
    async (item: {
      productId: number;
      color: string;
      size: string;
      quantity?: number;
    }) => {
      const response = await apiFetch<CartResponse>("/api/cart", {
        method: "POST",
        body: JSON.stringify(item),
      });
      setItems(
        response.items.map((cartItem) => ({
          ...cartItem,
          image: resolveProductImage(cartItem.image),
        }))
      );
    },
    []
  );

  const removeItem = useCallback(async (id: string) => {
    const response = await apiFetch<CartResponse>(`/api/cart/${id}`, {
      method: "DELETE",
    });
    setItems(
      response.items.map((item) => ({
        ...item,
        image: resolveProductImage(item.image),
      }))
    );
  }, []);

  const updateQuantity = useCallback(async (id: string, quantity: number) => {
    const response = await apiFetch<CartResponse>(`/api/cart/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    });
    setItems(
      response.items.map((item) => ({
        ...item,
        image: resolveProductImage(item.image),
      }))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo(
    () => ({
      items,
      totalCount,
      subtotal,
      isLoading,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [addItem, clearCart, isLoading, items, removeItem, subtotal, totalCount, updateQuantity]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
