"use client";
import { useEffect, useState } from "react";
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
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';

interface IshippingAddress {
  _id: string;
  user_id: string;
  address_type: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  is_default: boolean;
}

export default function AddressTab({user_id}:{user_id:string}) {
  //const [addresses, setAddresses] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [shippingAddress, setShippingAddress]= useState<IshippingAddress[]>([]);
  const [formShipping, setFormShipping] = useState({user_id: user_id, address_type:"Home", address_line_1:"" ,address_line_2:"" ,city:"" ,state:"" ,country:"" ,pincode:"", is_default:false});
  const user_ids= user_id;
  async function getDeliveryAddress(){
    const res1= await fetch(`/api/customer/profile/delivery-address?id=${user_ids}`);
    const data1= await res1.json();
    setShippingAddress(data1);
  }
  const handleShippingAddress = (e) => {
      setFormShipping({ ...formShipping, [e.target.name]: e.target.value });
  }
  useEffect(() => {
    getDeliveryAddress();
  }, []);

  const submitShippingAddress = async(e) => {
    e.preventDefault();
    try {
        const res = await fetch("/api/customer/profile/delivery-address", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formShipping),
        });
        const data = await res.json();
        setOpenDialog(false);
        getDeliveryAddress();
        toast.success(data.message);
    } catch (error) {
        throw new Error("Error updating address details", error.toString());
    }
  }
  const address_types = [
      { value: "Home",label:"Home" },
      { value: "Work", label: "Work" },
      { value: "Other", label: "Other" },
  ];
  const makeitPrimary = async (id) => {
    const res = await fetch(`/api/customer/profile/delivery-address?id=${user_ids}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({key_id:id}),
    });
    const data = await res.json();
    getDeliveryAddress();
    toast.success(data.message);
  }
  const deleteAddress = async (id) => {
    const res = await fetch(`/api/customer/profile/delivery-address?id=${user_ids}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({key_id:id}),
    });
    const data = await res.json();
    toast.success(data.message);
    getDeliveryAddress();
  }
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">My Addresses</h2>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <Card className='mt-2'>
                <CardHeader>
                    <CardTitle>Shipping Address(s) Details</CardTitle>
                    <CardAction>
                        <DialogTrigger asChild>
                            <Button variant="default">Add New</Button>
                        </DialogTrigger>
                    </CardAction>
                </CardHeader>
                <CardContent className='justify-between'>
                    <div className='flex flex-1 p-6'>
                        {shippingAddress && shippingAddress.map((address, index) => (
                            
                            address.is_default ?
                            <div key={index} className='flex-1/2 w-full p-4 bg-teal-100 bordeer-teal-800 border-rounded' >
                                <p className="mb-2 text-sm leading-normal text-gray-500 dark:text-gray-400">Address Type : {address.address_type} {address.is_default? '(Primary)' : ''}</p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{address.address_line_1} {address.address_line_2} {address.city} {address.state} {address.pincode}</p>
                                
                            </div>
                            :
                            <div key={index} className='flex-1/2 w-full p-4 border border-gray-400'>
                                <p className="mb-2 text-sm leading-normal text-gray-500 dark:text-gray-400">{address.address_type} {address.is_default? '(Primary)' : ''}</p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{address.address_line_1} {address.address_line_2} {address.city} {address.state} {address.pincode}</p>
                                <div className='flex place-content-end'>
                                    <Button variant={"outline"} onClick={()=>makeitPrimary({id: address._id})}>Make it Primary</Button>
                                    <Button variant='default' onClick={()=>deleteAddress({id: address._id})}>Delete</Button>
                                </div>
                            </div>
                            
                        ))}
                    
                    </div>
                </CardContent>
            </Card>
        
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Shipping Address Details</DialogTitle>
                </DialogHeader>
                <div>
                    <form onSubmit={submitShippingAddress}>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label>Address Type</Label>
                                <Select name="address_type" value={formShipping.address_type || ""} onValueChange={(val)=>setFormShipping({...formShipping, address_type: val})}>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder="Select a address type" />
                                    </SelectTrigger>
                                    <SelectContent className='w-full'>
                                        {address_types.map((addr) => (
                                        <SelectItem key={addr.value} value={addr.value}>
                                            {addr.label}
                                        </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="grid gap-3">
                                <Label>Address Line 1</Label>
                                <Input type="text" name="address_line_1" value={formShipping.address_line_1} onChange={handleShippingAddress} />
                            </div>
                            <div className="grid gap-3">
                                <Label>Address Line 2</Label>
                                <Input type="text" name="address_line_2" value={formShipping.address_line_2} onChange={handleShippingAddress} />
                            </div>
                            <div className="grid gap-3">
                                <Label>City</Label>
                                <Input type="text" name="city" value={formShipping.city} onChange={handleShippingAddress} />
                            </div>
                            <div className="grid gap-3">
                                <Label>State</Label>
                                <Input type="text" name="state" value={formShipping.state} onChange={handleShippingAddress} />
                            </div>
                            <div className="grid gap-3">
                                <Label>Country</Label>
                                <Input type="text" name="country" value={formShipping.country} onChange={handleShippingAddress} />
                            </div>
                            <div className="grid gap-3">
                                <Label>Pincode</Label>
                                <Input type="text" name="pincode" value={formShipping.pincode} onChange={handleShippingAddress} />
                            </div>
                            <div className="grid gap-3">
                                <Label><Checkbox name="is_default" id='is_default' checked={formShipping.is_default} onCheckedChange={(val)=>setFormShipping({...formShipping, is_default: val ===true})} /> Make it default shipping address</Label>
                            </div>
                        </div>
                        <DialogFooter className='mt-2'>
                            <DialogClose asChild>
                                <Button variant={"destructive"}>Cancel</Button>
                            </DialogClose>
                            <Button type="submit" variant={"default"} onClick={submitShippingAddress}>Save changes</Button>
                        </DialogFooter>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    </div>
  );
}