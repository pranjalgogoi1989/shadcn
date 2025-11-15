"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function SellerDashboard() {
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    fetch("/api/seller/stats")
      .then((res) => res.json())
      .then(setStats);
  }, []);

  return (
    <div className="p-6 space-y-6 w-full">
      <h1 className="text-2xl font-bold mb-4">Seller Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card><CardHeader><CardTitle>Total Products</CardTitle></CardHeader><CardContent>{stats.totalProducts || 0}</CardContent></Card>
        <Card><CardHeader><CardTitle>Total Orders</CardTitle></CardHeader><CardContent>{stats.totalOrders || 0}</CardContent></Card>
        <Card><CardHeader><CardTitle>Total Revenue</CardTitle></CardHeader><CardContent>₹{stats.totalRevenue?.toFixed(2) || "0.00"}</CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Monthly Sales</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.sales || []}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}