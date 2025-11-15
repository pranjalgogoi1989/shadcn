"use client";

import React, {useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'
import SellerRequest from '@/models/SellerRequest';
import Seller, { ISeller, IBankDetails } from '@/models/Seller';
import { Dialog, DialogClose, DialogDescription, DialogTrigger, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { set } from 'mongoose';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const SellerProfilePage = () => {
  const {data: session} = useSession();
  const [open, setOpen] = useState(false);
  const [myprofile, setMyProfile] = useState<typeof Seller>(null);
  const user_id = session?.user?.id;
  
  const handleSubmit = async()=>{
    setOpen(false);
    const res = await fetch(`/api/seller/profile/${user_id}`,{
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(myprofile),
    });
    const data = await res.json();
    toast.success(data.message);
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMyProfile({ ...myprofile, [e.target.name]: e.target.value });
  };
  const handleChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMyProfile({ ...myprofile, bankDetails: { ...myprofile.bankDetails, [e.target.name]: e.target.value } });
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!user_id) return;
    async function getMySellerProfile() {
      try {
        const res = await fetch(`/api/seller/profile/${user_id}`);
        const data = await res.json();
        setMyProfile(data.seller);
      } catch (error) {
        console.error("Error fetching seller profile:", error);
      }
    }

    getMySellerProfile();
  },[user_id]);

  if(!session) return null;
  if(!myprofile) return null;
  return (
    <div>
      <div className='px-2 py-2 '>
        <h1 className='font-semibold text-2xl text-center'>Seller Profile</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <Card className='mt-2'>
              <CardContent>
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                      <div className="flex flex-col w-full gap-6 xl:flex-row">
                        <div className="order-1">
                          <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                              {myprofile?.name}
                          </h4>
                          
                          <div className=" items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                              <p>Email: {myprofile?.email}</p>
                              <p>Phone: {myprofile?.phone}</p>
                              <p>Address: {myprofile?.address}</p>
                              <p>GST: {myprofile?.gst}</p>
                              <p>Description : {myprofile.description} </p>
                          </div>
                          <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                              Bank Details
                          </h4>
                          <div className="items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                              <p>Account Name: {myprofile?.bankDetails?.accountName || "-"}</p>
                              <p>Account Number: {myprofile?.bankDetails?.accountNumber  || "-"}</p>
                              <p>Bank Name: {myprofile?.bankDetails?.bankName || "-"}</p>
                              <p>Bank Address: {myprofile?.bankDetails?.bankAddress || "-"}</p>
                              <p>IFSC: {myprofile?.bankDetails?.ifsc || "-"}</p>
                              <p>Branch: {myprofile?.bankDetails?.branch || "-"}</p>
                          </div>
                        </div>
                        
                      </div>
                      <div className='mt-2 py-2'>
                          <DialogTrigger asChild>
                              <Button variant="default">Edit</Button>
                          </DialogTrigger>
                        </div>
                  </div>
              </CardContent>
          </Card>
          <form onSubmit={handleSubmit}>
            <DialogContent className="sm:max-w-[425px] md:max-w-[800px]">
              <DialogHeader>
                  <DialogTitle>Edit Business Information</DialogTitle>
                  <DialogDescription>Update your details to keep your business profile up-to-date.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                  <div className="grid gap-3">
                      <Label>Business Name</Label>
                      <Input type="text" name="name" value={myprofile.name} onChange={handleChange} />
                  </div>
                  <div className='flex justify-between'>
                    <div className="w-full grid gap-3">
                        <Label>Email</Label>
                        <Input type="email" name="email" value={myprofile.email} onChange={handleChange} />
                    </div>
                    <div className="w-full grid gap-3">
                        <Label>Phone</Label>
                        <Input type="tel" name="phone" value={myprofile.phone} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="grid gap-3">
                      <Label>Address</Label>
                      <Input type="text" name="address" value={myprofile.address} onChange={handleChange} />
                  </div>
                  <div className="grid gap-3">
                      <Label>Description</Label>
                      <Input type="text" name="description" value={myprofile.description} onChange={handleChange} />
                  </div>
                  <div className="grid gap-3">
                      <Label>GST</Label>
                      <Input type="text" name="gst" value={myprofile.gst} onChange={handleChange} />
                  </div>
                  <h2 className='text-lg font-semibold'>Bank Details</h2>
                  <div className='flex justify-between'>
                    <div className="w-full grid gap-3">
                        <Label>Account Name</Label>
                        <Input type="text" name="accountName" value={myprofile?.bankDetails?.accountName} onChange={handleChange1} />
                    </div>
                    <div className="w-full grid gap-3">
                        <Label>Account Number</Label>
                        <Input type="text" name="accountNumber" value={myprofile?.bankDetails?.accountNumber} onChange={handleChange1} />
                    </div>
                  </div>
                  <div className='flex justify-between'>
                    <div className="w-full grid gap-3">
                        <Label>Bank Name</Label>
                        <Input type="text" name="bankName" value={myprofile?.bankDetails?.bankName} onChange={handleChange1} />
                    </div>
                    <div className="w-full grid gap-3">
                        <Label>Bank Address</Label>
                        <Input type="text" name="bankAddress" value={myprofile?.bankDetails?.bankAddress} onChange={handleChange1} />
                    </div>
                  </div>
                  <div className='flex justify-between'>
                    <div className="w-full grid gap-3">
                        <Label>IFSC</Label>
                        <Input type="text" name="ifsc" value={myprofile?.bankDetails?.ifsc} onChange={handleChange1} />
                    </div>
                    <div className="w-full grid gap-3">
                        <Label>Branch</Label>
                        <Input type="text" name="branch" value={myprofile?.bankDetails?.branch} onChange={handleChange1} />
                    </div>
                  </div>
                  
              </div>
              <DialogFooter>
                  <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" onClick={handleSubmit}>Save changes</Button>
              </DialogFooter>
              </DialogContent>
          </form>
      </Dialog>


      </div>

    </div>
  )
}

export default SellerProfilePage