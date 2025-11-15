"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { it } from "node:test";

const WishlistContext = createContext<any>(null);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: session } = useSession();
  const [wishlist, setWishlist] = useState<any[]>([]);

  // Load wishlist from localStorage if user not logged in
  useEffect(() => {
    const local = localStorage.getItem("wishlist");
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) setWishlist(parsed);
      } catch {
        console.error("Invalid wishlist data in localStorage");
      }
    }
  }, []);

  
  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Save to localStorage when updated
  useEffect(() => {
    if (!session?.user) {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, session?.user]);
  
  const syncWishlist = async () => {
      if (session && session?.user) {
        const local = localStorage.getItem("wishlist");
        let localWishlist = [];
        if (local) {
          try {
            localWishlist = JSON.parse(local);
          } catch {}
        }
        try {
          const res = await fetch("/api/customer/wishlist/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ localWishlist }),
          });
          const data = await res.json();
          if (res.ok) {
            setWishlist(data.wishlist.items);
          } else {
            console.error(data.error);
          }
        } catch (err) {
          console.error("Wishlist sync error:", err);
        }
      }
    };
  // 🔄 Sync with DB when user logs in
  useEffect(() => {
    syncWishlist();
  }, [session?.user]);


  const addToWishlist = async (item: any) => {
    //console.log(item);
    setWishlist((prev) => {
      const exists = prev.some((w) => w.product_id === item._id);
      console.log(exists);
      if (exists) return prev;
      const tobeupdated = {
        product_id: item._id,
        title: item.title,
        price: item.price,
        image: item.images[0],
      };
      console.log(tobeupdated);
      const updated = [...prev, tobeupdated];
      return updated;
    });
    if (session?.user) {
      try {
        const tobeupdated = {
          product_id: item._id,
          title: item.title,
          price: item.price,
          image: item.images[0],
        };
        await fetch("/api/customer/wishlist/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({item: tobeupdated}),
        });
      } catch (error) {
        console.error("Failed to sync wishlist to DB:", error);
      }
    }
  };

 const removeFromWishlist = async (id: string) => {
    setWishlist((prev) => prev.filter((item) => item.product_id !== id));
    if (session?.user) {
      try {
        await fetch("/api/customer/wishlist/remove", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product_id : id }),
        });
      } catch (error) {
        console.error("Failed to remove wishlist item from DB:", error);
      }
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, syncWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);