"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function OrderSuccessPage({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const standardDeliveryCharge = Number(process.env.NEXT_PUBLIC_DEFAULT_DELIVERY_CHARGE ||0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [deliveryTotal, setDeliveryTotal] = useState(0);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch("/api/customer/order?id=" + orderId);
        const data = await res.json();
        if (data.success) {
          setOrder(data.order);        
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <p>Loading order details...</p>
      </div>
    );

  if (!order)
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-red-500">❌ Order not found.</p>
        <Link href="/" className="mt-4 text-blue-600 underline">
          Back to Home
        </Link>
      </div>
    );

  const { shippingAddress, paymentStatus, paymentMethod, totalAmount, items } = order;

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-white rounded-xl shadow-md">
      <div className="text-center border-b pb-6 mb-6">
        <div className="text-green-600 text-5xl mb-3">✅</div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-600 mt-2">
          Your order <strong>#{orderId}</strong> has been placed successfully.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Delivery Info */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Delivery Address</h2>
          <div className="border rounded-lg p-4 bg-gray-50 text-sm">
            {shippingAddress && (
              <div>
                <p className="font-medium">{shippingAddress.cust_name}</p>
                <p>{shippingAddress.address_line_1}, {shippingAddress.address_line_2}</p>
                <p>
                  {shippingAddress.city}, {shippingAddress.state} -{" "}
                  {shippingAddress.pincode}
                </p>
                <p>📞 {shippingAddress.phone}</p>
              </div>
            )}
          </div>

          <h2 className="text-lg font-semibold mt-6 mb-2">Payment Method</h2>
          <div className="border rounded-lg p-4 bg-gray-50 text-sm">
            <p>{paymentMethod}</p>
          </div>
          {paymentMethod === "ONLINE" && (
            <div>
              <h2 className="text-lg font-semibold mt-6 mb-2">Payment Status</h2>
              <div className="border rounded-lg p-4 bg-gray-50 text-sm">
                <p>{paymentStatus}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Order Summary */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
          <div className="border rounded-lg bg-gray-50 p-4">
            <div className="space-y-6">
            {items.map((item: any) => (
                <div key={item._id} className="flex items-center gap-4">
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={item.title}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                  <div>
                    <h3 className="text-md font-medium">{item.title}</h3>
                    <p className="text-grey-600 mb-2">Variant:{" "}
                      {Object.entries(item.variant)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(", ")}
                    </p>
                    <p className="text-gray-600 mb-2">₹{item.price}</p>
                    <p className="text-gray-600 mb-2">Quantity: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <hr className="my-3" />
            <div className="flex justify-between font-semibold">
              <span>Sub Total:</span>
              <span>₹{items.reduce((total, item) => total + item.price * item.quantity, 0)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Delivery:</span>
              <span>₹{items.reduce((total, item) => total + item.deliveryCharge,0)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col md:flex-row justify-center gap-4">
        {paymentMethod === "ONLINE" && paymentStatus === "Pending" && (
        <Link
          href="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium text-center hover:bg-blue-700"
        >
          Proceed to Payment
        </Link>
        )}
        <Link
          href="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium text-center hover:bg-blue-700"
        >
          Continue Shopping
        </Link>
        {/* <button
          onClick={() => router.push(`/orders/${orderId}`)}
          className="border border-blue-600 text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-blue-50"
        >
          View Order Details
        </button> */}
      </div>
    </div>
  );
}