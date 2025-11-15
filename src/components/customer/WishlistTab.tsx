"use client";
import { useWishlist } from "@/lib/WishlistContext";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect } from "react";

export default function WishlistTab({user_id}:{user_id:string}) {
  const { wishlist,syncWishlist, removeFromWishlist } = useWishlist();
  
  useEffect(() => {
    if (user_id) {
      syncWishlist();
    }
  }, []);

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">My Wishlist</h2>
      {wishlist.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist.map((item) => (
            <div key={item.product_id} className="border p-4 rounded-xl shadow-sm bg-white flex flex-col items-center">
              
              <Image
                src={item.image || "/placeholder.png"}
                alt={item.title}
                width={150}
                height={150}
                className="object-contain"
              />
              <h3 className="text-md font-medium mt-2">{item.title}</h3>
              <p className="text-gray-600 mb-2">₹{item.price}</p>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    toast.success("Moved to cart");
                    removeFromWishlist(item.product_id);
                  }}
                >
                  Move to Cart
                </Button>
                <Button variant="destructive" onClick={() => removeFromWishlist(item.product_id)}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}