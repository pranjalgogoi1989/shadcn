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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from 'sonner';

export interface ICarousel {
  image: string;
  title: string;
  description: string;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}



const CarouselPage = () => {
  
  const [carousel, setCarousel] = useState<ICarousel[]>([]);

  const [title, setTitle]= useState("");
  const [description, setDescription]= useState("");
  const [mpriority, setMpriority]= useState("0");
  const [file, setFile] = useState<File | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  async function fetchCarousel(){
    const res = await fetch("/api/admin/carousel");
    const data = await res.json();
    setCarousel(data);
  }
  const handleSubmit = async(e)=>{
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("priority", mpriority);

    const res = await fetch("/api/admin/carousel", {
        method: "POST",
        body: formData,
    });
    const data = await res.json();
    toast.success(data.message);
    setOpenDialog(false);
    fetchCarousel();
  }
  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin/carousel`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({key_id:id}),
    });
    const data = await res.json();
    toast.success(data.message);
    fetchCarousel();
  }
  useEffect(() => {
      fetchCarousel();
  }, []);
  
  
  const validKeys: (keyof ICarousel)[] = ["_id", "image","title", "description","priority","createdAt","updatedAt"];
  const columnOrder: (keyof ICarousel)[] = ["_id", "image", "title", "description", "priority","createdAt","updatedAt"];
  
    const baseColumns: ColumnDef<ICarousel>[] =
      carousel.length > 0
        ? columnOrder
            .filter((key) => validKeys.includes(key)) 
            .map((key) => {
              return {
                accessorKey: key,
                header: key.charAt(0).toUpperCase() + key.slice(1),
              };
            })
        : [];
  
  const actionColumn: ColumnDef<ICarousel> = {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const userid = row.original._id; // full row data
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDelete(`${userid}`)}
            >
              Delete
            </Button>
          </div>
        );
      },
    };
    const finalcolumns = [...baseColumns, actionColumn];

  return (
    <div className="flex flex-1 flex-col">
      
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className='flex place-content-end'>
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                  <Button>New Carousel Item</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle >
                    <div className='flex place-content-center'>
                      Create New Carousel Item
                    </div>
                  </DialogTitle>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                       <div className="grid gap-3">
                          <Label>Image File</Label>
                          <Input type="file" name="file" accept='image/*' onChange={(e) => setFile(e.target.files?.[0] || null)}/>
                      </div>
                      <div className="grid gap-3">
                          <Label>Title</Label>
                          <Input type="text" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                      </div>
                      <div className="grid gap-3">
                          <Label>Description</Label>
                          <Input type="text" name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                      </div>
                      <div className="grid gap-3">
                          <Label>Priority</Label>
                          <Input type="number" name="priority" value={mpriority} onChange={(e)=>setMpriority(e.target.value)} />
                      </div>
                    </div>
                    <div className='flex justify-center mt-3'>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>

                      </DialogClose>
                      <Button type="submit" onClick={handleSubmit}>Submit</Button>
                    </div>
                  </form>
                </DialogContent>
                
              </Dialog>

            </div>
          <DataTable data={carousel} columns={finalcolumns} downloadable={true} />
        </div>
      </div>
    </div>
  )
}

export default CarouselPage