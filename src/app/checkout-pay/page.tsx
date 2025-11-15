"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function CheckoutPage() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const [order, setOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any>([]);
  const [shippingAddress, setShippingAddress] = useState({ cust_name:"",phone:"",address_line_1: "",address_line_2: "", city: "", state: "", pincode: "" });

  useEffect(() => {
    if (orderId) {
      fetch(`/api/order/orderId?orderId=${orderId}`)
        .then((res) => res.json())
        .then((data) => {
            setOrder(data.order);
            setOrderItems(data.order.items);
            }
        );
    }
  }, [orderId]);

  const handleShippingAddressChange = (e: any) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
   //console.log(shippingAddress);
  };

  if (!order) return <p>Loading...</p>;

    const proceedToPayment = async()=>{
        const res = await fetch("/api/order/addressUpdate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: orderId,
                address: shippingAddress,
            }),
        });
        const data = await res.json();
        if(data.success){
            alert("redirecting to payment gateway");
            handleCheckout(orderId);
        }
    }

    async function handleCheckout(orderId: string) {
        const res = await fetch("/api/payment/create-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId }),
        });

        const data = await res.json();
        if (data.success) {
            // Redirect to payment gateway (Stripe / Razorpay)
            window.location.href = data.url; // Payment page URL
        } else {
            alert("Error starting payment!");
        }
    }
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Checkout</h1>

      {order?.items && order?.items.length > 0 ? (
        order.items.map((item: any, idx: number) => (
            <div key={idx} className="flex items-center gap-4 border-b pb-4">
            <img src={item.image} className="w-20 h-20 rounded" alt={item.title} />
            <div>
                <h2 className="font-medium">{item.title}</h2>
                <p>
                Variant:{" "}
                {Object.entries(item.variant)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(", ")}
                </p>
                <p>Quantity: {item.quantity}</p>
                <p>
                Price: ₹{item.price} + Delivery: ₹{item.deliveryCharge || 0}
                </p>
            </div>
            </div>
        ))
        ) : (
        <p>No items found in this order.</p>
        )}
        <div>
            <h2 className="font-medium">Shipping Address</h2>
            <div className="grid grid-cols-2 mt-4 py-4">
                <div className="mt-2 py-2">
                    <Label htmlFor="cust_name">Name</Label>
                    <Input type="text" name="cust_name" id="cust_name" onChange={(e)=>handleShippingAddressChange(e)} defaultValue={shippingAddress.cust_name} required/>
                </div>
                <div className="mt-2 py-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input type="text" name="phone" id="phone" onChange={(e)=>handleShippingAddressChange(e)} defaultValue={shippingAddress.phone} required/>
                </div>
                <div className="mt-2 py-2">
                    <Label htmlFor="address_line_1">Address Line 1</Label>
                    <Input type="text" name="address_line_1" id="address_line_1" onChange={(e)=>handleShippingAddressChange(e)} defaultValue={shippingAddress.address_line_1} required/>
                </div>
                <div className="mt-2 py-2">
                    <Label htmlFor="address_line_2">Address Line 2</Label>
                    <Input type="text" name="address_line_2" id="address_line_2" onChange={(e)=>handleShippingAddressChange(e)} defaultValue={shippingAddress.address_line_2} required/>
                </div>
                <div className="mt-2 py-2">
                    <Label htmlFor="city">City</Label>
                    <Input type="text" name="city" id="city" onChange={(e)=>handleShippingAddressChange(e)} defaultValue={shippingAddress.city} required/>
                </div>
                <div className="mt-2 py-2">
                    <Label htmlFor="state">State</Label>
                    <Input type="text" name="state" id="state" onChange={(e)=>handleShippingAddressChange(e)} defaultValue={shippingAddress.state} required/>
                </div>
                <div className="mt-2 py-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input type="text" name="pincode" id="pincode" onChange={(e)=>handleShippingAddressChange(e)} defaultValue={shippingAddress.pincode} required/>
                </div>
            </div>
        </div>
      <div className="text-right">
        <button
          className="bg-blue-600 text-white px-5 py-2 rounded mt-3"
          onClick={()=> proceedToPayment()}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}