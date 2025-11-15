"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/api/seller/orders")
      .then((res) => res.json())
      .then(setOrders);
  }, []);

  return (
    <table className="w-full border-collapse border border-gray-200">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2">Order ID</th>
          <th className="p-2">Product</th>
          <th className="p-2">Qty</th>
          <th className="p-2">Customer</th>
          <th className="p-2">Status</th>
          <th className="p-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order: any) => (
          <tr key={order._id} className="border-t">
            <td className="p-2">{order._id}</td>
            <td className="p-2">{order.product_name}</td>
            <td className="p-2">{order.quantity}</td>
            <td className="p-2">{order.customer_name}</td>
            <td className="p-2">{order.status}</td>
            <td className="p-2">
              <Button size="sm" onClick={() => console.log("Open Tracking Update")}>
                Update Tracking
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}