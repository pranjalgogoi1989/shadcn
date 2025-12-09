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

interface ICategories {
  _id: string;
  cat_name:string;
  slug: string;
  parentId: string;
  updatedAt: string;
}
const CategoriesPage = () => {
  const [categories, setCategories] = useState<ICategories[]>([]);
  const [category,setCategory] = useState({cat_name:"", parentId:""});
  const [openDialog, setOpenDialog] = useState(false);

  async function fetchCategories(){
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data.data);
  }
  useEffect(() => {
      fetchCategories();
  }, []);
  const handleChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  }
  const deleteCategory = async(userid) => {
    const res = await fetch("/api/admin/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({key_id:userid}),
    });
    const data = await res.json();
    toast.success(data.message);
    fetchCategories();
  }
  
  const validKeys: (keyof ICategories)[] = ["_id", "cat_name","slug", "parentId","updatedAt"];
    const columnOrder: (keyof ICategories)[] = ["_id","cat_name","slug", "parentId","updatedAt"];
  
    const baseColumns: ColumnDef<ICategories>[] =
      categories.length > 0
        ? columnOrder
            .filter((key) => validKeys.includes(key)) 
            .map((key) => {
              return {
                accessorKey: key,
                header: key.charAt(0).toUpperCase() + key.slice(1),
              };
            })
        : [];
  
  const actionColumn: ColumnDef<ICategories> = {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const userid = row.original._id; // full row data
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="default">Products</Button>         
            <Button size="sm" variant="destructive" onClick={() => deleteCategory(userid)}> Delete </Button>
          </div>
        );
      },
    };
    const finalcolumns = [...baseColumns, actionColumn];

    const handleSubmit = async(e) => {
      e.preventDefault();
      try {
        await fetch("/api/admin/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(category),
        });

        setOpenDialog(false);
        fetchCategories();
        toast.success("Category Data Updated");
        } catch (error) {
        throw new Error("Error updating category details", error.toString());
        }
      fetchCategories();
    };
  return (
    <div className="flex flex-1 flex-col">
      
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className='flex place-content-end'>
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                  <Button>Create New Category</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle >
                    <div className='flex place-content-center'>
                      Create New Category
                    </div>
                  </DialogTitle>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                      <div className="grid gap-3">
                          <Label>Category Name</Label>
                          <Input type="text" name="cat_name" value={category.cat_name} onChange={handleChange} />
                      </div>
                      <div className="grid gap-3">
                          <Label>Parent Id</Label>
                          <Input type="text" name="parentId" value={category.parentId} onChange={handleChange} />
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
          <DataTable data={categories} columns={finalcolumns} downloadable={true} />
        </div>
      </div>
    </div>
  )
}

export default CategoriesPage