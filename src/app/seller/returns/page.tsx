"use client";
import React from 'react'
import Order from '@/models/Order'
import {useState,useEffect} from 'react'
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import Image from 'next/image';
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeliveryPartner from '@/models/DeliveryPartner';
import LoadingPage from '@/app/loading';
import {useRouter} from 'next/navigation';

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
  paymentMethod: string;
  paymentStatus: string;
}


const ReturnPage = () => {
  const router = useRouter();
  const {data:session} = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  
  async function getMyOrders(){
    const params = new URLSearchParams({
      page: page.toString(),
    });
    const res = await fetch(`/api/seller/returns?${params}`);
    const data = await res.json();
    if(data.success){
      setOrders(data.orders);
      setPageCount(data.totalPages);
      
    }
  }
  useEffect(() => {
    getMyOrders();
  },[]);

  if(!session) return <LoadingPage />
  //const setTrackingNumber
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Return Orders</h2>
      <div className="space-y-8">
        {orders.map((order) => (order.paymentMethod === "COD" || (order.paymentMethod === "ONLINE" && order.paymentStatus === "Paid")) && (
            
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
                  <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
              <Button
                size="sm"
                variant="default"
                onClick={() => router.push(`/seller/orders/process-order?id=${order._id}`)}
              >
                Process Order
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      </div>
      <div className="flex justify-center items-center gap-2 pt-4">
        <Button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          variant="outline"
        >
          Prev
        </Button>
        <span className="text-sm">Page {page}</span>
        <Button onClick={() => setPage((p) => p + 1)} disabled={!pageCount || parseInt(page) >= parseInt(pageCount)} variant="outline">
          Next
        </Button>
      </div>
    </div>
  )
}

export default ReturnPage