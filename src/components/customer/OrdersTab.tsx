"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Variant {
  attributes: Record<string, string>;
  price: number;
  deliveryCharge?: number;
}

interface OrderItem {
  productId: string;
  title: string;
  mainImage: string[];
  variant: Variant;
  quantity: number;
  subtotal: number;
}

interface Order {
  _id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  orderItems: OrderItem[];
}

export default function OrdersTab({user_id}:{user_id:string}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
    const id= user_id;

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/customer/my-order?id="+id); // API to fetch logged-in user's orders
        const data= await res.json();
        setOrders(data.order || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
    console.log(orders);
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading your orders...</div>;
  }

  if (orders.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No orders found.</div>;
  }
  function cancelOrder(id: string) {
    router.push(`/cancel-order/${id}`);
  }
  return (
    <div className="container max-w-5xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold mb-4">My Orders</h1>

      {orders.map((order) => (
        <Card key={order._id} className="shadow-md hover:shadow-lg transition">
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <CardTitle className="text-lg">Order #{order._id}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Badge
              variant={
                order.status === "Paid"
                  ? "default"
                  : order.status === "Delivered"
                  ? "secondary"
                  : order.status === "Cancelled"
                  ? "destructive"
                  : "outline"
              }
            >
              {order.status}
            </Badge>
          </CardHeader>

          <Separator />

          <CardContent className="space-y-4">
            
            {order?.items && order?.items.length > 0 ? (
                order.items.map((item: any, idx: number) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 w-full sm:w-2/3">
                  <div className="relative w-20 h-20 rounded-md overflow-hidden border">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <div className="text-sm text-muted-foreground">
                      {Object.entries(item.variant).map(([key, value]) => (
                        <span key={key} className="mr-2">
                          {key}: <b>{value}</b>
                        </span>
                      ))}
                    </div>
                    <p className="text-sm mt-1">Qty: {item.quantity}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    ₹{item.price.toLocaleString()}
                  </p>
                  {item.deliveryCharge ? (
                    <p className="text-xs text-muted-foreground">
                      + Delivery ₹{item.deliveryCharge}
                    </p>
                  ) : null}
                </div>
              </div>
            ))
            ) : (
            <p>No items found in this order.</p>
            )}

            <Separator />

            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Total: <b>₹ {order?.items.reduce((sum: number, i: any) => sum + (i.price + (i.deliveryCharge || 0)) * i.quantity, 0).toLocaleString()}</b>
              </div>
              <div className="place-content--end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push(`/my-orders/${order._id}`)}
              >
                View Details
              </Button>
              </div>
              
            </div>
          </CardContent>
        </Card>
      ))}
      <div className="flex justify-center items-center gap-2 pt-4">
        <Button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          variant="outline"
        >
          Prev
        </Button>
        <span className="text-sm">Page {page}</span>
        <Button onClick={() => setPage((p) => p + 1)} disabled={!totalPages || parseInt(page) >= parseInt(totalPages)} variant="outline">
          Next
        </Button>
      </div>
    </div>
  );
}