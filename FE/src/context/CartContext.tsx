import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
  selectedIds: string[];
  selectedItems: CartItem[];
  selectedCount: number;
  selectedSubtotal: number;
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
  toggleSelected: (id: string) => void;
  selectAll: () => void;
  clearSelected: () => void;
  removeItems: (ids: string[]) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const didInitSelectionRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      setSelectedIds([]);
      didInitSelectionRef.current = false;
      setIsLoading(false);
      return;
    }

    const response = await apiFetch<CartResponse>("/api/cart");
    const nextItems = response.items.map((item) => ({
      ...item,
      image: resolveProductImage(item.image),
    }));
    setItems(nextItems);

    const nextIds = nextItems.map((i) => i.id);
    setSelectedIds((prev) => {
      if (!didInitSelectionRef.current) {
        didInitSelectionRef.current = true;
        return nextIds;
      }
      return prev.filter((id) => nextIds.includes(id));
    });
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

  const selectedItems = items.filter((item) => selectedIds.includes(item.id));
  const selectedCount = selectedItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const selectedSubtotal = selectedItems.reduce(
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
      void response; // selection/normalization is handled by refreshCart()
      await refreshCart();
    },
    [refreshCart]
  );

  const removeItem = useCallback(async (id: string) => {
    await apiFetch<CartResponse>(`/api/cart/${id}`, {
      method: "DELETE",
    });
    await refreshCart();
  }, [refreshCart]);

  const updateQuantity = useCallback(
    async (id: string, quantity: number) => {
      await apiFetch<CartResponse>(`/api/cart/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    });
      await refreshCart();
    },
    [refreshCart]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setSelectedIds([]);
    didInitSelectionRef.current = false;
  }, []);

  const toggleSelected = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(items.map((i) => i.id));
  }, [items]);

  const clearSelected = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const removeItems = useCallback(
    async (ids: string[]) => {
      if (ids.length === 0) return;

      await Promise.all(
        ids.map((id) =>
          apiFetch<CartResponse>(`/api/cart/${id}`, {
            method: "DELETE",
          })
        )
      );
      await refreshCart();
    },
    [refreshCart]
  );

  const value = useMemo(
    () => ({
      items,
      totalCount,
      subtotal,
      selectedIds,
      selectedItems,
      selectedCount,
      selectedSubtotal,
      isLoading,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      toggleSelected,
      selectAll,
      clearSelected,
      removeItems,
      refreshCart,
    }),
    [
      addItem,
      clearCart,
      clearSelected,
      isLoading,
      items,
      removeItem,
      removeItems,
      refreshCart,
      selectAll,
      selectedCount,
      selectedIds,
      selectedItems,
      selectedSubtotal,
      subtotal,
      toggleSelected,
      totalCount,
      updateQuantity,
    ]
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
