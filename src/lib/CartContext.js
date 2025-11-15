"use client";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ userId, children }) => {
  const [cart, setCart] = useState([]);
  const [totals, setTotals] = useState({ totalItems: 0, totalPrice: 0 });
  const defaultDelivery = Number(process.env.NEXT_PUBLIC_DEFAULT_DELIVERY_CHARGE || 0);

  // --- Update totals ---
  const updateLocalTotals = (items) => {
    const totalItems = items.reduce((sum, i) => sum + (i.quantity || 0), 0);

    const total = items.reduce((sum, i) => {
      const itemTotal = (i.price || 0) * (i.quantity || 0);
      // const delivery = i.deliveryCharge ?? defaultDelivery;
      return sum + itemTotal;
    }, 0);
    const deliveryTotal = items.reduce((sum, i) => {
      const delivery = i.deliveryCharge ?? defaultDelivery;
      return sum + delivery;
    },0);
    setTotals({
      totalItems,
      subTotal: Number(total.toFixed(2)),
      delivery: Number(deliveryTotal.toFixed(2)),
      totalPrice: Number(total.toFixed(2)) + Number(deliveryTotal.toFixed(2)),
    });
  };

  // --- Add item ---
  const addToCart = async (item) => {
    if (!item || !item.productId) return;
    console.log(item);
    setCart((prev) => {
      const existing = prev.find(
        (i) =>
          i.sellerId === item.sellerId &&
          i.productId === item._id &&
          i.color === item.color &&
          i.size === item.size
      );

      let updated;
      if (existing) {
        updated = prev.map((i) =>
          i.sellerId === item.sellerId &&
          i.productId === item._id &&
          i.color === item.color &&
          i.size === item.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        updated = [...prev, { ...item, quantity: 1 }];
      }
      updateLocalTotals(updated);
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  // --- Remove item ---
  const removeFromCart = (productId) => {
    const updated = cart.filter((i) => i.productId !== productId);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    updateLocalTotals(updated);
  };

  // --- Update quantity ---
  const updateQuantity = (productId, newQty) => {
    const updated = cart.map((i) =>
      i.productId === productId ? { ...i, quantity: newQty } : i
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    updateLocalTotals(updated);
  };

  // --- Sync with DB when user logs in ---
  const syncCartWithDB = async () => {
    console.log("Syncing cart with DB");
    if (!userId) return;

    const localCart = JSON.parse(localStorage.getItem("cart") || "[]");

    const res = await fetch("/api/customer/cart/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, localCart }),
    });

    const data = await res.json();
    if (data.success) {
      setCart(data.cart.items);
      updateLocalTotals(data.cart.items);
      localStorage.removeItem("cart"); // clear after sync
    }
  };

  // --- Load on mount ---
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(saved);
    updateLocalTotals(saved);
  }, []);

  // --- On user login ---
  useEffect(() => {
    if (userId) syncCartWithDB();
  }, [userId]);

  return (
    <CartContext.Provider
      value={{ cart, totals, addToCart, removeFromCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);