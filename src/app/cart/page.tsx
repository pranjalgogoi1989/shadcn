"use client";
import { useCart } from "@/lib/CartContext";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast, Toaster } from "sonner";
import User from "@/models/User";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardAction, CardContent } from "@/components/ui/card";
import LoadingPage from "../loading";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totals } = useCart(); 
  const [mycart, setMycart]= useState(null);
  const [loading,setLoading]=useState(false);
  const router = useRouter();

  const getCart = async() =>{
    setLoading(true);
    const res= await fetch('/api/customer/cart');
    const data= await res.json();
    if(data.success){
      setMycart(data.cart);
    }else{
      toast.error(data.message);
    }
    setLoading(false);
  }

  useEffect(()=>{
    getCart();
  },[]);


  async function handleCheckout() {
    router.push('/checkout');
  }
  async function deleteItemFromcart(itemId:string){
    const res = await fetch('/api/customer/cart',{
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({productId:itemId}),
    })
    const data= await res.json();
    if(data.success){
      toast.success(data.message);
    }else{
      toast.error(data.message);
    }
  }
  const deleteFromCart = async(itemId:string)=>{
    setLoading(true);
    deleteItemFromcart(itemId);
    setLoading(false);
    setMycart({...mycart, items: mycart.items.filter((item: any) => item._id !== itemId)});
  }
  function submitOrder(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="w-full min-w-full items-center justify-center">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
          {loading && (
            <Card>
              <CardContent>
                <LoadingPage></LoadingPage>
              </CardContent>
            </Card>
          )}
          {mycart?.items && mycart?.items.length > 0 ? (
            mycart.items.map((item: any, idx: number) => (
              <Card key={idx}>
                <CardContent>
                  <div className="flex">
                    <div className="flex-1">
                        <img src={item.image} className="w-20 h-20 rounded" alt={item.title} />
                    </div>
                    <div className="flex-4">
                      <h2 className="font-medium">{item.title}</h2>
                      <p>
                      Variant:{" "}
                      {Object.entries(item.variant)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(", ")}
                      </p>
                      
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: ₹{item.price} + Delivery: ₹{item.deliveryCharge || 0}</p>   
                    </div>
                    <div className="flex-1">
                      <Button variant={"destructive"} onClick={()=>deleteFromCart(item._id)}>Remove from Cart</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : ''}
          {!mycart && (
            <div className="place-content-center">
              <h3 className="text-xl font-bold mb-4">Your Cart is Empty</h3>
            </div>
          )}
          {mycart && mycart.items.length > 0 && (
            <div className="place-content-end">
              <Button variant={'default'} onClick={()=>handleCheckout()}>Proceed to Submit the Order</Button>
            </div>
          )}
      </div>
    </div>
  );
}