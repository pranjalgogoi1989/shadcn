"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { set } from "mongoose";
import { Label } from "recharts";
export default function OrdersTab({user_id}:{user_id:string}) {
  const [orders, setOrders] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [singleOrder, setSingleOrder] = useState<any[]>([]);
  const [sellers, setSellers] = useState<any[]>([]);
  const standardDeliveryCharge = Number(process.env.NEXT_PUBLIC_DEFAULT_DELIVERY_CHARGE ||0);
  const id= user_id;

  useEffect(() => {
    async function fetchOrders() {
      const res = await fetch("/api/my-order?id="+id);
      const data = await res.json();
      if (data.success){
        const updatedOrders = data.order.map((order) => {
          let allDelivered = true;
          let anyDelivered = false;

          for (const sellerGroup of order.sellers) {
            for (const item of sellerGroup.items) {
              const status = item.status?.toLowerCase();
              if (status === "delivered") {
                anyDelivered = true;
              } else {
                allDelivered = false;
              }
            }
          }
          let newStatus = "Under Process";
          if (allDelivered) newStatus = "Delivered";
          else if (anyDelivered) newStatus = "Partially Delivered";
          return {...order, status: newStatus};
        });

        setOrders(updatedOrders);
      } 
    }
    fetchOrders();
  }, [id]);
  async function handleSingleOrder(order: any[]) {
    setSingleOrder(order);
    setSellers(order?.sellers);
    setOpenDialog(true);
  }
  if (!orders.length)
    return <p className="text-gray-600">You haven’t placed any orders yet.</p>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">My Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-lg p-4 flex justify-between items-center hover:shadow-sm transition"
          >
            <div>
              <div className="font-semibold">Order #{order._id}</div>
              <div className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </div>
             
              <div className="text-sm text-gray-700">
                Status: {order.status}
              </div>
              <div className="text-sm text-gray-700">
                Payment Method: {order.paymentMethod}
              </div>
            </div>
            <Button onClick={()=>handleSingleOrder(order)}>View Details</Button>
          </div>
        ))}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTitle></DialogTitle>
        <DialogContent className="max-w-[425px] md:max-w-[800px] h-[600px] max-h-[700px] place-content-left">
          <h3 className='text-lg font-semibold text-center'>Order Details #{singleOrder._id}</h3>
            
            <div className="space-y-4 max-w-[425px] md:max-w-[800px] overflow-scroll">
              {sellers.map((seller: any, index: number) => (
                <div key={seller.sellerId} className="w-full">
                  <div className="max-w-[420px] md:max-w-[900px] border rounded-lg overflow-hidden shadow-sm" >
                      {seller.sellerName ? (
                        <div className="p-4">
                          <h3 className="text-lg font-semibold">Seller: {seller.sellerName}</h3>
                        </div>
                      ):''
                    }
                    <div className="p-4">
                      <div className="flex border-b bg-grey-100">
                        <div className="text-left text-sm px-2 py-2 w-[10%]">#</div>
                        <div className="text-left text-sm px-2 py-2 w-[30%]">Product</div>
                        <div className="text-left text-sm px-2 py-2 w-[40%]">Details (Price × Quantity + Delivery Charge)</div>
                        <div className="text-right text-sm px-2 py-2 w-[10%]">Price (excluding delivery)</div>
                        <div className="text-right text-sm px-2 py-2 w-[10%]">Status</div>
                      </div>
                      {seller.items.map((item: any) => (

                        <div key={item.productId} className="border-b">
                          <div className="flex">
                            <div className="text-left text-sm px-2 py-2 w-[10%]">
                              {item.image ? <Image src={item.image} alt={item.name} width={50} height={50} /> : ''}
                            </div>
                            <div className="text-left text-sm px-2 py-2 w-[30%]">{item.name}</div>
                            <div className="text-left text-sm px-2 py-2 w-[40%]">
                              ₹{item.price} × {item.quantity} +
                                 {item.deliveryCharge === null ? ` ₹${standardDeliveryCharge}(Delivery Charge)` :` ₹${item.deliveryCharge}(Delivery Charge)`}
                            </div>
                            <div className="text-right text-sm px-2 py-2 w-[10%]">₹{(item.price * item.quantity).toFixed(2)}</div>
                            <div className="text-right text-sm px-2 py-2 w-[10%]">{item.status}</div>
                          </div>
                          {item.trackingVia && item.trackingVia.trackingVia && (
                          <div className="bg-green-200 text-sm">
                            <span className="font-semibold">Shipment Details</span>
                            
                            <div className="flex">
                              <div className="flex-1">Delivery Partner : {item.trackingVia.trackingVia } </div>
                              <div className="flex-1">Tracking ID : {item.trackingVia.trackingNumber }</div>
                            </div>
                          </div>
                          )}
                        </div>


                      ))}
                      <div className="flex bg-grey-100">
                        <div className="text-right text-sm px-2 py-2 w-[80%]">SubTotal</div>
                        <div className="text-right text-sm px-2 py-2 w-[10%]">₹{Number(seller.subtotal).toFixed(2)}</div>
                      </div>
                      <div className="flex  bg-grey-100">
                        <div className="text-right text-sm px-2 py-2 w-[80%]">Delivery Charge</div>
                        <div className="text-right text-sm px-2 py-2 w-[10%]">₹{Number(seller.deliveryTotal).toFixed(2)}</div>
                      </div>
                      <div className="flex bg-grey-100">
                        <div className="text-right text-sm px-2 py-2 w-[80%]">Total</div>
                        <div className="text-right text-sm px-2 py-2 w-[10%]">₹{Number(seller.grandTotal).toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                
                </div>
                ))}
                
            </div>
          
          <DialogFooter>
              <DialogClose asChild>
              <Button variant="default">Close</Button>
              </DialogClose>
          </DialogFooter>
        </DialogContent>
    </Dialog>
    </div>
  );
}