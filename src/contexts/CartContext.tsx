// src/contexts/CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import BASE_URL from "../config";

type CartContextType = {
  cartCount: number;
  updateCartCount: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = async () => {
    const token = localStorage.getItem("access");

    try {
      const res = await fetch(`${BASE_URL}/cart/get`, {
        headers: {
          "Content-Type": "application/json",
          access: token || "",
        },
        credentials: "include",
      });
      const data = await res.json();
      setCartCount(data.length); // 장바구니 아이템 수
    } catch (error) {
      console.error("장바구니 수 불러오기 실패", error);
    }
  };

  useEffect(() => {
    updateCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export default CartProvider;
