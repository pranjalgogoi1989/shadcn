"use client";

import { use, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import axios from "axios";
import LoadingPage from "@/app/loading";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "recharts";
import { Dialog, DialogContent, DialogTrigger, DialogFooter, DialogClose, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

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
  createdAt:string
  updatedAt:string
}

const SellerProcessOrderPage = () => {
    const searchParams = useSearchParams();
    const id  = searchParams.get("id");
    const {data:session}= useSession();
    const router = useRouter();
    const [orders, setOrders] = useState(null);
    const [order, setOrder] = useState<Order | null>(null);
    const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
    const [deliveryPartner, setDeliveryPartner] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [returnrequest, setReturnrequest] = useState<ReturnItems>(null);

    async function fetchReturn(){
      const res = await fetch(`/api/seller/returns/${id}`);
      const data = await res.json();
      setReturnrequest(data.data);
    }
    async function fetchOrder() {
        try {
            setLoading(true);
            const res = await fetch(`/api/seller/orders/${id}`);
            const data = await res.json();
            setOrders(data.order);
            setShippingAddress(data.order.shippingAddress);
            fetchReturn();
            setLoading(false);
        } catch (err) {
            console.error("Error fetching order details:", err);
        } finally {
            setLoading(false);
        }
    }
    async function getDeliveryPartner(){
        try {
            const res = await fetch(`/api/seller/delivery-partner`);
            const data = await res.json();
            setDeliveryPartner(data.data);
        } catch (err) {
            console.error("Error fetching delivery partner:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(id){
            fetchOrder();
        }
        getDeliveryPartner();
    }, []);

    if (loading) return <LoadingPage />;
    if (!orders ) return <div className="text-center py-10 text-muted-foreground">Order not found.</div>;

    const confirmOrder = async(item_id: string)=> {
      const res = await fetch("/api/seller/orders/confirm-item",{
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
                orderId: id,
                itemId:item_id,
                status: "Processed" 
          }),
      });
      const data=await res.json();
      fetchOrder();
      toast.success(data.message);       
    }

  const updateTracking = async (e)=>{
    e.preventDefault();
    const res = await fetch("/api/seller/tracking",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
              orderId: id,
              itemId: e.target.itemId.value,
              trackingVia: e.target.trackingVia.value,
              trackingNumber: e.target.trackingNumber.value,
              status: e.target.trackingStatus.value,
        }),
    });
    const data=await res.json();
    if(data.success){
      toast.success(data.message);
    }
    fetchOrder();
    setOpenDialog(false);
  }

  const printLabel = async(item: any)=> {
    const logoUrl = process.env.NEXT_PUBLIC_LOGO;
    const sellerdetails = await fetch("/api/seller/profile/"+session?.user?.id);
    const seller = await sellerdetails.json();
    if(seller){
      const sellerName = seller.seller.name;
      const result = await fetch("/api/seller/shipping-label",{
        method:"POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId:id,
          itemdetails:item,
          sellerName: sellerName,
          customer : shippingAddress?.cust_name,
          address : shippingAddress?.address_line_1 + ", " + shippingAddress?.address_line_2,
          city: shippingAddress?.city,
          state: shippingAddress?.state,
          pincode: shippingAddress?.pincode,
          paymentMethod: order?.paymentMethod,
          logoUrl:logoUrl,
        })
      });

      const blob = await result.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "shipping_label.pdf";
      a.click();
    }
      
  }
  const confirmReturn = async(returnId: string, status: string)=> {
    const res = await fetch(`/api/seller/returns/${returnId}`,{
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        returnId: returnId,
        amount: 0,
        status: status
      })});
    const data=await res.json();
    toast.success(data.message);
    fetchReturn();
  }
  const initiateRefund = async(returnId:string,itemId:string, amount:string, status)=>{
    const res = await fetch(`/api/seller/returns/${returnId}`,{
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        returnId: returnId,
        orderId: id,
        itemId: itemId,
        amount: amount,
        status: status
      })});
    const data=await res.json();
    toast.success(data.message);
    fetchReturn();
  }

  return (
    <div className="container max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Order #{orders._id}</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {orders.items && orders.items.length > 0 ? (
            orders.items.map((item: any, idx: number) => (
            <div key={idx}>
              <div  className="flex flex-col sm:flex-row justify-between gap-4">
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
                <div className="text-right">
                  {item.status}
                  <br />
                  {item.status ==="Pending" && <Button variant={"default"} onClick={()=>confirmOrder(item.variantId)}>Confirm Order</Button>}
                  {item.trackingVia &&(
                    <div>
                      <Button variant={"default"} onClick={()=>printLabel(item)}>Print Label</Button>
                      <br />
                    </div>
                  )}

                  {(item.status ==="Processed"|| item.status ==="processed") && (
                    ( ()=>{
                      item.trackingVia?.trackingStatus!=="Delivered" && (
                        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                          <DialogTrigger asChild>
                            <Button variant={"default"}>Update Tracking Details</Button>
                          </DialogTrigger>
                          <DialogTitle></DialogTitle>
                          <DialogContent className="sm:max-w-lg">
                            <p className="text-lg text-muted-foreground text-center">Tracking Details</p>
                            <form action="" onSubmit={updateTracking}>
                              <Input type="hidden" name="itemId" value={item.variantId} />
                              <div className="mt-2">
                                <label htmlFor="trackingVia">Delivery Partner</label>
                                <Select id="trackingVia" name="trackingVia" defaultValue={item.trackingVia?.trackingVia}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a delivery partner" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {deliveryPartner && deliveryPartner.map((partner) => (
                                      <SelectItem key={partner._id} value={partner.partner_name}>
                                        {partner.partner_name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="mt-2">
                                <label htmlFor="trackingNumber" className="block text-sm font-medium text-gray-900 dark:text-white">Tracking Number</label>
                                <Input className="mt-2" name="trackingNumber" id="trackingNumber" placeholder="Tracking Number" defaultValue={item.trackingVia?.trackingNumber}/>
                              </div>
                              <div className="mt-2 w-full">
                                <label htmlFor="trackingStatus">Status</label>
                                <Select id="trackingStatus" name="trackingStatus" defaultValue={item.trackingVia?.status}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a status" />
                                  </SelectTrigger>
                                  <SelectContent className="w-full">
                                    <SelectItem value={"Waiting for Shipment"}>{"Waiting for Shipment"}</SelectItem>
                                    <SelectItem value={"Shipped"}>{"Shipped"}</SelectItem>
                                    <SelectItem value={"Out for Delivery"}>{"Out for Delivery"}</SelectItem>
                                    <SelectItem value={"Delivered"}>{"Delivered"}</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <Button type="submit" className="mt-4" variant={'default'}>Update Tracking</Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                      )
                    })
                    
                  )}
                </div>
              </div>
              {item.trackingVia &&(
                <div className="mt-2">
                  <div className="flex">
                    <div className="flex-1">
                      Delivery Partner : <strong>{item.trackingVia.trackingVia}</strong>
                    </div>
                    <div className="flex-1">
                      Tracking Number : <strong>{item.trackingVia.trackingNumber}</strong>
                    </div>
                    <div className="flex-1">
                      Status: <strong>{item.trackingVia.status}</strong>
                    </div>
                    <div className="flex-1">
                      Date: <strong>{item.trackingVia.updatedAt}</strong>
                    </div>
                  </div>
                </div>
              )}

              <Separator />
              {returnrequest && returnrequest.some((ret) => ret.itemId === item._id) &&(
                <div>
                  <p className="text-xl text-semibold text-center bg-amber-400">{item.status ==="Refunded"? "Refund Requested" : "Refund Processed" }</p>
                  <div className="flex">
                    <div className="flex-3/6">
                      Reason: {returnrequest.find((ret) => ret.itemId === item._id)?.reason}
                    </div>
                    <div className="flex-1/6">
                      Date : {returnrequest.find((ret) => ret.itemId === item._id)?.createdAt}
                    </div>
                    <div className="flex-1/6">
                      Status: {returnrequest.find((ret) => ret.itemId === item._id)?.status}
                    </div>
                    <div className="flex-1/6">
                      {returnrequest.find((ret) => ret.itemId === item._id)?.status === "Pending" &&(
                        <Button variant={'default'} value={returnrequest.find((ret) => ret.itemId === item._id)?._id} onClick={(e)=>confirmReturn(e.target.value,"Processed")}>Confirm</Button>
                      )}
                      {returnrequest.find((ret) => ret.itemId === item._id)?.status === "Processed" &&(
                        <Button variant={'default'} value={returnrequest.find((ret) => ret.itemId === item._id)?._id} onClick={(e)=>confirmReturn(e.target.value,"Received By Seller")}>Mark Received</Button>
                      )}

                      {returnrequest.find((ret) => ret.itemId === item._id)?.status === "Received By Seller" &&(
                        <Button variant={'default'} value={returnrequest.find((ret) => ret.itemId === item._id)?._id} onClick={(e)=>initiateRefund(e.target.value, item._id, item.price * item.quantity + item.deliveryCharge || 0,"Refund Initiated")}>Initiate Refund</Button>
                      )}
                    </div>
                  </div>
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
            <span className="font-semibold"><b>₹ {orders.items.reduce((sum: number, i: any) => sum + (i.price + (i.deliveryCharge || 0)) * i.quantity, 0).toLocaleString()}</b></span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shipping Address</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            
            <p className="font-medium">{orders.shippingAddress?.cust_name}</p>
            <p>{orders.shippingAddress?.address_line_1} {orders.shippingAddress?.address_line_2}</p>
            <p>
              {orders.shippingAddress?.city}, {orders.shippingAddress?.state} -{" "}
              {orders.shippingAddress?.pincode}
            </p>
            <p>📞 {orders.shippingAddress?.phone}</p>
          </div>
          
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        {orders.invoiceUrl && (
          <Button
            onClick={() => window.open(orders.invoiceUrl, "_blank")}
            variant="secondary"
          >
            Download Invoice
          </Button>
        )}
        <Button variant={"default"} onClick={()=>router.push("/seller/orders")}>Back</Button>
      </div>
    </div>
  );
}
export default SellerProcessOrderPage;