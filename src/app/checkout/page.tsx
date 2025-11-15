"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/CartContext";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Image from "next/image";
import OrderSuccessPage from "@/components/ecommerce/OrderSuccess";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [mycart, setMycart]= useState(null);
  const default_delivery_charge = process.env.NEXT_PUBLIC_DEFAULT_DELIVERY_CHARGE || 0;
  const [address, setAddress] = useState({ cust_name: "", phone: "", address_line_1: "", address_line_2: "", city: "",pincode: "", state: "",country:""});
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [allAddress, setAllAddress] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [perInfo, setPerInfo] = useState({user_id: userId, first_name:"",last_name:"",email:"",phone:"",bio:"", photo:"/images/owner.jpg"});

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

 

  const getShippingAddress = async () => {
    if(userId==null) return;
    const res = await fetch(`/api/customer/profile/delivery-address?id=${userId}`);
    const rs = await res.json();
    setAllAddress(rs);
    const rs2= await fetch(`/api/customer/profile/personal?id=${userId}`);
    const rs2_data = await rs2.json();
    setPerInfo(rs2_data);
    if(rs2_data){
      const full_name = rs2_data.first_name +" "+ rs2_data.last_name;
      setAddress((prev) => ({
        ...prev,
        ...{
            phone: rs2_data.phone, cust_name: full_name
          },
      }));
    }
  }

   useEffect(()=>{
    getCart();
  },[]);

  const placeOrder = async () => {
    if (!userId) {
      alert("Please log in to continue");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/customer/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        shippingAddress: address,
        paymentMethod: paymentMethod,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      setOrderId(data.orderId);
      localStorage.removeItem("cart");
      toast.success("✅ Order placed successfully!");
    } else {
      toast.error("❌ Failed to place order: " + data.error);
    }
  };

  useEffect(()=>{
    if(userId){
      getShippingAddress();
    }
   //setOrderId("68eaa3b19162206e767cc772");  //temporarily check the ordersuccess page
  },[userId]);

  const handleAddressSelect = async(addr: any) => {
    setAddress((prev) => ({
      ...prev,
      ...{
        address_line_1: addr.address_line_1,
        address_line_2: addr.address_line_2,
        city: addr.city,
        state: addr.state,
        country: addr.country,
        pincode: addr.pincode
      },
    }));
  };
  if(orderId!==null) return (
    <OrderSuccessPage orderId={orderId} />
  )
  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-semibold mb-6">Checkout</h1>
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-medium mb-2">Pre-saved Addresses</h2>
          {allAddress.map((addr, i) => (
            <div key={i} className={`border p-4 rounded-lg mb-4 hover:bg-amber-300 ${addr.is_default ? "bg-gray-100" : ""}`} onClick={() => handleAddressSelect(addr)}>
              <h3 className="font-semibold mb-2">{addr.address_type} {addr.is_default ? '(Default)' : ''}</h3>
              <p>{address.cust_name}</p>
              <p>{addr.address_line_1}, {addr.address_line_2}</p>
              <p>{addr.city}</p>
              <p>{addr.state}</p>
              <p>{addr.pincode}</p>
              <p>Phone: {address.phone}</p>
            </div>
          ))}

          <h2>Other Address</h2>
          {Object.keys(address).map((key) => (
            <input
              key={key}
              name = {key}
              className="w-full mb-3 border p-2 rounded-md"
              placeholder={key[0].toUpperCase() + key.slice(1)}
              value={address[key]}
              onChange={(e) =>
                setAddress({ ...address, [key]: e.target.value })
              }
            />
          ))}
        </div>

        {/* RIGHT: Cart Summary */}
        <div className="border p-4 rounded-lg bg-gray-50">
          <h2 className="font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2 max-h-60 overflow-y-auto">
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
                  </div>
                </CardContent>
              </Card>
            ))
          ) : ''}
          </div>

          <div className="mt-4 border-t pt-3">
            <div className="flex justify-between font-semibold mt-2">
              <span>Sub-Total</span>
              <span>₹
                {mycart?.items && mycart?.items.length > 0 ? mycart.items.reduce((sum, i) => sum + i.price * i.quantity, 0) : 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charge(s)</span>
              <span>₹
                {mycart?.items && mycart?.items.length > 0 ? mycart.items.reduce((sum, i) => sum + i.deliveryCharge, 0) : 0}
              </span>
            </div>
            <div className="flex justify-between font-semibold mt-2">
              <span>Total</span>
              <span>₹
                {mycart?.items && mycart?.items.length > 0 ? mycart.items.reduce((sum, i) => sum + i.price * i.quantity + i.deliveryCharge, 0) : 0}
              </span>
            </div>
          </div>
          <Separator></Separator>
          <div>
            <h2 className="font-semibold mb-4 mt-4">Payment Method</h2>
            <div className="flex items-center mb-4">
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label className="ml-2">Cash on Delivery</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="ONLINE"
                checked={paymentMethod === "ONLINE"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label className="ml-2">Online Payment</label>
            </div>
          </div>
          <button
            onClick={placeOrder}
            disabled={loading}
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>

          {orderId && (
            <p className="mt-4 text-green-600">
              ✅ Order placed successfully. ID: #{orderId}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}