"use client";
import { DataTable } from '@/components/data-table'
import React from 'react';
import { useState, useEffect } from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ISellerRequests {
  user_id: string;
  business_name: string;
  business_email: string;
  business_phone: string;
  business_address: string;
  description: string;
  status: string;
  createdAt: string;
}
const SellerRequestsProcessing = () => {
  const [sellers, setSellers] = useState<ISellerRequests[]>([]);

  const handleApprove = async (id: string) => {
    const result = await fetch("/api/seller/requests", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key_id: id, status: "Approved" }),
    });
    toast.success("Approved Request");
  }

  const handleReject = async (id: string) => {
    const result = await fetch("/api/seller/requests", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key_id: id, status: "Rejected" }),
    });
    toast.error("Rejected Request: ");
  }

  const validKeys: (keyof ISellerRequests)[] = ["user_id", "business_name", "business_email","business_address","description","status", "createdAt"];
  const columnOrder: (keyof ISellerRequests)[] = ["user_id", "business_name", "business_email", "business_address","description","status", "createdAt"];

  const baseColumns: ColumnDef<ISellerRequests>[] =
    sellers.length > 0
      ? columnOrder
          .filter((key) => validKeys.includes(key)) 
          .map((key) => {
            return {
              accessorKey: key,
              header: key.charAt(0).toUpperCase() + key.slice(1),
            };
          })
      : [];
  

  const actionColumn: ColumnDef<ISellerRequests> = {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
        const row_id = row.original._id; // full row data
        const status = row.original.status;
        return (
            <div className="flex gap-2">
                <Button size="sm" variant="default" onClick={()=>handleApprove(row_id)}>Approve </Button>
                <Button size="sm" variant="destructive" onClick={()=>handleReject(row_id)}> Reject </Button>
            </div>
        );
    },
  };

  const finalcolumns = [...baseColumns, actionColumn];
  useEffect(() => {
    async function getSellers() {
      const res = await fetch("/api/seller/requests");
      const data = await res.json();
      setSellers(data.data);
    }
    getSellers();
    console.log(sellers);
  },[]);

  return (
    <div className="flex flex-1 flex-col">
      
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <DataTable data={sellers} columns={finalcolumns} />
        </div>
      </div>
    </div>
  )
}

export default SellerRequestsProcessing