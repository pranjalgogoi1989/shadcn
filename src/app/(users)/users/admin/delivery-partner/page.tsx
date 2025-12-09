"use client";
import { DataTable } from '@/components/data-table'
import React from 'react';
import { useState, useEffect } from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from 'sonner';

interface IDeliveryPartner {
  _id: string;
  partner_name:string;
  tracking_url: string;
  updatedAt: string;
}
const DeliveryPartnerPage = () => {
  const [deliverypartners, setDeliverPartners] = useState<IDeliveryPartner[]>([]);
  const [form, setForm] = useState({partner_name:"", tracking_url:""});
  const [openDialog, setOpenDialog] = useState(false);

  async function fetchDeliveryPartner(){
    const res = await fetch("/api/delivery-partner");
    const data = await res.json();
    setDeliverPartners(data.data);
  }
  useEffect(() => {
      fetchDeliveryPartner();
  }, []);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  const deleteDeliveryPartner = async(id:string) => {
    const res = await fetch("/api/admin/delivery-partner", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({key_id:id}),
    });
    const data = await res.json();
    toast.success(data.message);
    fetchDeliveryPartner();
  }
  const validKeys: (keyof IDeliveryPartner)[] = ["_id", "partner_name","tracking_url", "updatedAt"];
    const columnOrder: (keyof IDeliveryPartner)[] = ["_id", "partner_name","tracking_url", "updatedAt"];
  
    const baseColumns: ColumnDef<IDeliveryPartner>[] =
      deliverypartners.length > 0
        ? columnOrder
            .filter((key) => validKeys.includes(key)) 
            .map((key) => {
              return {
                accessorKey: key,
                header: key.charAt(0).toUpperCase() + key.slice(1),
              };
            })
        : [];
  
  const actionColumn: ColumnDef<IDeliveryPartner> = {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const rowid = row.original._id; // full row data
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="destructive"
              onClick={() => deleteDeliveryPartner(rowid)}
            >
              Delete
            </Button>
          </div>
        );
      },
    };
    const finalcolumns = [...baseColumns, actionColumn];

    const handleSubmit = async(e) => {
      e.preventDefault();
      try {
        const res = await fetch("/api/admin/delivery-partner", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        const data = await res.json();
        if(data.success){
          toast.success("New Delivery Partner Data Updated");
        }
        setOpenDialog(false);
        } catch (error) {
          toast.error("Error updating category details", error.toString());
        }
      fetchDeliveryPartner();
    };
  return (
    <div className="flex flex-1 flex-col">
      
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className='flex place-content-end'>
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                  <Button>Add New Delivery Partner</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle >
                    <div className='flex place-content-center'>
                      Add New Delivery Partner
                    </div>
                  </DialogTitle>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                      <div className="grid gap-3">
                          <Label>Category Name</Label>
                          <Input type="text" name="partner_name" value={form.partner_name} onChange={handleChange} />
                      </div>
                      <div className="grid gap-3">
                          <Label>Tracking URL</Label>
                          <Input type="text" name="tracking_url" value={form.tracking_url} onChange={handleChange} />
                      </div>

                    </div>
                    <div className='flex justify-center'>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>

                      </DialogClose>
                      <Button type="submit" onClick={handleSubmit}>Submit</Button>
                    </div>
                  </form>
                </DialogContent>
                
              </Dialog>
            </div>
          <DataTable data={deliverypartners} columns={finalcolumns} downloadable={true} />
        </div>
      </div>
    </div>
  )
}

export default DeliveryPartnerPage