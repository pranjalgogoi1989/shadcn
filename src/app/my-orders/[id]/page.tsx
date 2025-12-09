"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import axios from "axios";
import LoadingPage from "@/app/loading";
import { Input } from "@/components/ui/input";
import StarReviewForm from "@/components/customer/ReviewForm";
import { useSession } from "next-auth/react";
import { Dialog,DialogTrigger,DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { addDays, isBefore } from "date-fns";
import Link from "next/link";

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
}
interface ReturnItems{
  _id:string,
  orderId:string,
  itemId:string,
  reason:string,
  status:string,
  updatedAt:string
}


export default function OrderDetails() {
  const params = useParams();
  const { id } = params;
  const {data:session} = useSession();
  const [orders, setOrders] = useState(null);
  const invoiceUrl = `/api/common/invoice/${id}`;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState([]);
  const [allreturns, setAllreturns]= useState<ReturnItems>(null);
  const [reqReturn, setReqReturn]=useState({orderId:id, itemId:"", cancelReason:""});
  const [returnRequest, setReturnRequest] = useState(false);

  async function fetchOrder() {
    try {
      setLoading(true);
      const res = await fetch(`/api/customer/order?id=${id}`);
      const data = await res.json();
      setOrder(data.order);

      const res1 = await fetch(`/api/customer/return?orderId=${id}`);
      const data1 = await res1.json();
      setAllreturns(data1.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching order details:", err);
    } finally {
      setLoading(false);
    }
  }

  async function checkReviews(){
    try {
      const res = await fetch(`/api/customer/order/review?orderId=${id}`);
      const data = await res.json();
      if(data.success){
        setFeedback(data.orderreview);
      }
    } catch (error) {
      
    }
  }

  const downloadInvoice = ()=>{

    toast.success("Invoice Downloaded");
  }

  useEffect(() => {
    if(id){
      fetchOrder();
      checkReviews();
    }
  }, []);

  if (loading) return <LoadingPage />;
  if (!order ) return <div className="text-center py-10 text-muted-foreground">Order not found.</div>;


  const submitReturn =async()=>{
    setReturnRequest(true);
    const res= await fetch('/api/customer/return',{
      method:'POST',
      headers: { "Content-Type": "application/json" },
      body:JSON.stringify(reqReturn)
    });
    const data = await res.json();
    if(data.success){
      alert(data.message);
    }else{
      alert(data.message);
    }
    const res1 = await fetch(`/api/customer/return?orderId=${id}`);
    const data1 = await res1.json();
    setAllreturns(data1.data);
    setReturnRequest(false);
  }

  function setReason(reason:string, itemId:string){
    setReqReturn({ ...reqReturn, cancelReason:reason, itemId:itemId});
   
  }

  return (
    <div className="container max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Order #{order._id}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {order.items && order.items.length > 0 ? (
            order.items.map((item: any, idx: number) => (
              <div key={idx}>
                <div className="flex flex-col sm:flex-row justify-between gap-4">
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
                {item.trackingVia && (  
                  <div className="mt-4">
                    <Separator />
                    Tracking Info:
                    <div className="flex">
                      <div className="flex-1 text-sm text-muted-foreground">
                        Delivery Partner: <strong>{item.trackingVia.trackingVia}</strong>
                      </div>
                      <div className="flex-1 text-sm text-muted-foreground">
                        Tracking Number: <strong>{item.trackingVia.trackingNumber}</strong>
                      </div>
                      <div className="flex-1 text-sm text-muted-foreground">
                        Tracking Status: <strong>{item.trackingVia.status}</strong>
                      </div>
                      
                      {item.trackingVia.status === "Delivered" && (
                        <div className="flex-1 text-sm text-muted-foreground">
                           {isBefore(new Date(), addDays(new Date(item.trackingVia.updatedAt), 15)) ? (

                              (allreturns || []).some((ret) => ret.itemId === item._id.toString()) ? (
                                <div>
                                  <p>Return Requested</p>
                                  <p>Reason: {allreturns.find((ret) => ret.itemId === item._id.toString())?.reason}</p>
                                  <p>
                                    Status:{" "}
                                    <Badge
                                      variant={
                                        allreturns.find((ret) => ret.itemId === item._id.toString())?.status === "Pending"
                                          ? "destructive"
                                          : "default"
                                      }
                                    >
                                      {allreturns.find((ret) => ret.itemId === item._id.toString())?.status}
                                    </Badge>
                                  </p>
                                  <p>Date: {allreturns.find((ret) => ret.itemId === item._id.toString())?.updatedAt}</p>
                                </div>
                              ) : (

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="destructive" disabled={loading}>Return Order</Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        <p className="text-center">Are you sure you want to return this item?</p>
                                      </AlertDialogTitle>
                                    </AlertDialogHeader>
                                    {
                                      (() => {
                                        const updatedAt = new Date(item.trackingVia.updatedAt);
                                        const expiryDate = new Date(updatedAt);
                                        expiryDate.setDate(updatedAt.getDate() + 15);

                                        const now = new Date();
                                        const diffTime = expiryDate.getTime() - now.getTime();
                                        const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // convert ms → days

                                        if (daysLeft > 1) {
                                          return (
                                            <p className="text-sm text-green-600">
                                              ✅ Return window open — {daysLeft} days left
                                            </p>
                                          );
                                        } else if (daysLeft === 1) {
                                          return (
                                            <p className="text-sm text-yellow-600">
                                              ⚠️ Return window closes tomorrow
                                            </p>
                                          );
                                        } else if (daysLeft === 0) {
                                          return (
                                            <p className="text-sm text-orange-500">
                                              ⚠️ Return window closes today
                                            </p>
                                          );
                                        } else {
                                          return (
                                            <p className="text-sm text-muted-foreground">
                                              ❌ Return window has expired
                                            </p>
                                          );
                                        }
                                      })()
                                    }
                                    <div className="space-y-3 mt-2">
                                      <Label>Write Brifly why you want to return the item</Label>
                                      <Textarea id="reason" name="reason" onChange={(e)=>setReason(e.target.value, item._id)}></Textarea>
                                    </div>
                    
                                    <AlertDialogFooter className="mt-4">
                                      <AlertDialogCancel>Close</AlertDialogCancel>
                                      <AlertDialogAction onClick={submitReturn} >
                                        {returnRequest ? 'Requesting Return...':'Confirm Return'}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )
                            ) : (
                              <p className="text-sm text-muted-foreground">Return Window has expired</p>
                            )}  
                          
                        </div>
                      )}
                    </div>
                    {item.trackingVia.status === "Delivered" && (
                      <div className="mt-4">
                        <Separator />
                        <div className="flex">
                          <div className="flex-1 text-sm text-muted-foreground">
                            Invoice: <strong><Link href={invoiceUrl} target="_blank" rel="noopener noreferrer">Download</Link></strong>
                          </div>
                        </div>
                        
                        {feedback.map((f: any, idx: number) => f.productId === item.productId && (
                          <div key={idx} className="p-6">
                            <span className="font-semibold">Feedback:</span>
                            <div className="flex">
                              <span className="flex-1/6">
                                Rating: {f.rating}/5 
                              </span>
                              <span className="flex-5/6">
                                Remarks: {f.comment}
                              </span>
                            </div>
                          </div>
                          ))
                        }
                        {feedback.some((f: any) => f.productId === item.productId) ? (
                         <div></div>
                        ) : (
                          <div key={idx}>
                            <h3 className="text-lg text-center">Submit Your Feedback</h3>
                            <StarReviewForm
                              orderId={order._id}
                              productId={item.productId}
                              userId={session?.user.id}
                              onSuccess={() => {}}
                            />
                          </div>
                        )}
                       
                      </div>
                    )}


                  </div>
                )}
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

      <Card>
        <CardHeader>
          <CardTitle>Shipping Address</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <p className="font-medium">{order.shippingAddress?.cust_name}</p>
            <p>{order.shippingAddress?.address_line_1} {order.shippingAddress?.address_line_2}</p>
            <p>
              {order.shippingAddress?.city}, {order.shippingAddress?.state} -{" "}
              {order.shippingAddress?.pincode}
            </p>
            <p>📞 {order.shippingAddress?.phone}</p>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-3">
        {order.invoiceUrl && (
          <Button
            onClick={() => window.open(order.invoiceUrl, "_blank")}
            variant="secondary"
          >
            Download Invoice
          </Button>
        )}
      </div>
    </div>
  );
}