"use client";

import { use, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import LoadingPage from "@/app/loading";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Variant {
  attributes: Record<string, string>;
  price: number;
  deliveryCharge?: number;
}

interface OrderItem {
  productId: string;
  title: string;
  image: string;
  variant: Variant;
  quantity: number;
}

interface Address {
  cust_name: string;
  phone: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  pincode: string;
}

interface Order {
  _id: string;
  status: string;
  createdAt: string;
  paymentMethod: string;
  paymentStatus: string;
  items: OrderItem[];
  shippingAddress: Address;
  trackingNumber?: string;
  trackingStatus?: string;
  invoiceUrl?: string;
  remarks?: string;
}

export default function OrderDetails() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [cancelButtonLoading, setCancelButtonLoading] = useState(false);

  async function fetchOrder() {
    try {
      setLoading(true);
      const res = await fetch(`/api/customer/order?id=${id}`);
      const data = await res.json();
      setOrder(data.order);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching order details:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if(id){
      fetchOrder();
    }
  }, []);

  if (loading) return <LoadingPage />;
  if (!order ) return <div className="text-center py-10 text-muted-foreground">Order not found.</div>;

  const handleCancel = async () => {
    const finalReason = reason === "Other" ? customReason.trim() : reason;

    if (!finalReason) {
      toast.error("Please select a reason before cancelling.");
      return;
    }
    try {
      setCancelButtonLoading(true);
      const res = await fetch(`/api/customer/order/cancel`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id, reason: finalReason }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Order cancelled successfully");
        window.location.reload();
      } else {
        toast.error(data.error || "Unable to cancel order");
      }
      setCancelButtonLoading(false);
    } catch {
      toast.error("Something went wrong");
    }

  }

  const CANCEL_REASONS = [
    "Ordered by mistake",
    "Found a better price elsewhere",
    "Item delivery is taking too long",
    "Need to change address or details",
    "Changed my mind",
    "Other",
  ];


  return (
    <div className="container max-w-5xl mx-auto p-6 space-y-6">
      <h3 className="text-3xl">Cancel Your Order</h3>
      <div className="place-content-center">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items && order.items.length > 0 ? (
                order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex items-center gap-4">
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
                      <p className="font-semibold">₹{item.price.toLocaleString()}</p>
                      {item.deliveryCharge ? (
                        <p className="text-xs text-muted-foreground">
                          Delivery ₹{item.deliveryCharge}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  ))
                ) : (
                <p>No items found in this order.</p>
                )}

              <Separator />

              <div className="flex justify-between text-sm">
                <span>Total Amount</span>
                <span className="font-semibold"><b>₹ {order.items.reduce((sum: number, i: any) => sum + (i.price + (i.deliveryCharge || 0)) * i.quantity, 0).toLocaleString()}</b></span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Payment Method</span>
                <span className="font-semibold">{order.paymentMethod}</span>
              </div>
              {
                order.paymentMethod === "ONLINE" && (
                  <div className="flex justify-between text-sm">
                    <span>Payment Status</span>
                    <span className="font-semibold">{order.paymentStatus}</span>
                  </div>
                )
              }
            </CardContent>
          </Card>
        </div>
        <div className="place-content-end">
          {order.status !== "Cancelled" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={loading}>
                  {cancelButtonLoading ? "Cancelling..." : "Cancel Order"}
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel Order</AlertDialogTitle>
                </AlertDialogHeader>

                <div className="space-y-3 mt-2">
                  <Label>Select a reason</Label>
                  <Select onValueChange={(val) => setReason(val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose reason..." />
                    </SelectTrigger>
                    <SelectContent>
                      {CANCEL_REASONS.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {reason === "Other" && (
                    <Input
                      type="text"
                      placeholder="Please specify..."
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                    />
                  )}
                </div>

                <AlertDialogFooter className="mt-4">
                  <AlertDialogCancel>Close</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancel}
                    className="bg-red-600 text-white hover:bg-red-700"
                    disabled={cancelButtonLoading}
                  >
                    {cancelButtonLoading ? "Cancelling..." : "Confirm Cancel"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {order.status === "Cancelled" && (
            <div>
              <p className="text-sm text-muted-foreground">Order Cancelled</p>
              <p className="text-sm text-muted-foreground">Reason: {order.remarks}</p>
              <Button variant={'outline'} onClick={()=>router.push('/profile')}>Back</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}