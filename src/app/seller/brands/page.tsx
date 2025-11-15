"use client";
import React from 'react';
import {useState, useEffect} from 'react';
import LoadingPage from '@/app/loading';
import {Dialog,DialogClose,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle,DialogTrigger,} from "@/components/ui/dialog";
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DataTable } from '@/components/data-table'
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Columns } from 'lucide-react';

const BrandsPage = () => {
  const [brands, setBrands]= useState([]);
  const [loading, setLoading]=useState(false);
  const [openDialog, setOpenDialog]=useState(false);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [newBrand,setnewBrand] = useState({name:"", description:"",dealsWith:""});

  async function getBrands(){
    const params = new URLSearchParams({
        page: page.toString(),
      });
    const res = await fetch("/api/seller/brands?"+params);
    const data= await res.json();
    setBrands(data.brands);
    setPageCount(data.totalPages);
    //console.log(data.totalPages);
  }
  useEffect(()=>{
    setLoading(true);
    getBrands();
    setLoading(false);
  },[]);

  useEffect(()=>{
    setLoading(true);
    getBrands();
    setLoading(false);
  },[page]);

  const handleSubmit = async (e)=>{
    e.preventDefault();
    const submitData = await fetch("/api/seller/brands",{
      method:"POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBrand)
    });
    const data = await submitData.json();
    setOpenDialog(false);
    if(data.status === 200){
      getBrands();
      toast.success("Brand Information submitted successfully");
    }
  }
  return (
    <div className="flex flex-1 flex-col">
      
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className='flex place-content-end'>
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                  <Button>New Brand</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle >
                    <div className='flex place-content-center'>
                      Create New Brand
                    </div>
                  </DialogTitle>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                       <div className="grid gap-3">
                          <Label>Brand Name</Label>
                          <Input type="text" name="name" defaultValue={newBrand.name} onChange={(e) => setnewBrand({...newBrand, [e.target.name] : e.target.value})}/>
                      </div>
                      <div className="grid gap-3">
                          <Label>Description</Label>
                          <Input type="text" name="description" defaultValue={newBrand.description} onChange={(e) => setnewBrand({...newBrand, [e.target.name]:e.target.value})} />
                      </div>
                      <div className="grid gap-3">
                          <Label>Deals With</Label>
                          <Input type="text" name="dealsWith" defaultValue={newBrand.dealsWith} onChange={(e) => setnewBrand({...newBrand, [e.target.name]:e.target.value})} />
                      </div>
                      
                    </div>
                    <div className='flex justify-center mt-3'>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>

                      </DialogClose>
                      <Button type="submit" variant={'default'}>Submit</Button>
                    </div>
                  </form>
                </DialogContent>
                
              </Dialog>

            </div>

            <Card>
              <CardTitle>Brands</CardTitle>  
              <CardContent>
                <div className='flex bg-amber-400'>
                  <div className='flex w-[20%]'>Name</div>
                  <div className='flex w-[40%]'>Description</div>
                  <div className='flex w-[30%]'>Deals With</div>
                  
                </div>
                
                { brands.map((b,index) => (
                  <div key={index} className='flex border-b hover:bg-amber-300'>

                    <div className='flex w-[20%]'>{b.name}</div>
                    <div className='flex w-[40%]'>{b.description}</div>
                    <div className='flex w-[30%]'>{b.dealsWith}</div>
                    
                  </div>
                ))}
                
              </CardContent>
              <CardFooter className='place-content-center'>
                <Button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  variant="outline"
                  >
                  Prev
                  </Button>
                  <span className="text-sm">Page {page}</span>
                  <Button onClick={() => setPage((p) => p + 1)} disabled={!pageCount || parseInt(page) >= parseInt(pageCount)} variant="outline">
                  Next
                  </Button>
              </CardFooter>
            </Card>  
        </div>
      </div>
    </div>
  )
}

export default BrandsPage