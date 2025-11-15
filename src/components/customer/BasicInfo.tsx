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
import Image from "next/image";


export default function BasicInfo({user_id}:{user_id:string}) {
  const [openDialog, setOpenDialog] = useState(false);  //for social media
  const [openDialog1, setOpenDialog1] = useState(false); //for personal info
  const [openDialog2, setOpenDialog2] = useState(false);  //for photo Upload
  const [userData, setUserData]=useState({user_id: user_id, first_name:"",last_name:"",email:"",phone:"",bio:"", photo:"/images/owner.jpg"});
  const [formSocial, setFormSocial] = useState({user_id: user_id,facebook:"http://www.facebook.com",twitter:"http://www.twitter.com",linkedin:"http://www.linkedin.com",instagram:"http://www.instagram.com"});
  const [file, setFile] = useState<File | null>(null);
  useEffect(() => {
      try {
          async function getUserDetails() {
              const res = await fetch(`/api/customer/profile?id=${user_id}`, {
                  method: "GET",
                  headers: { "Content-Type": "application/json" },
              });
              const data = await res.json();
              const { social_media, photo, first_name, last_name, email, phone, bio, address } = data;
              setUserData({
                  user_id,
                  first_name: data.first_name,
                  last_name: data.last_name,
                  email: data.email,
                  phone: data.phone,
                  bio: data.bio,
                  photo: data.photo
              });
              setFormSocial({
                user_id,
                facebook: social_media?.facebook,
                twitter: social_media?.twitter,
                linkedin: social_media?.linkedin,
                instagram: social_media?.instagram
            }); 
          }
          getUserDetails();
      }catch (error) {
        console.error("❌ Error fetching users:", error);
      }
    },[user_id]);
    const handleChangeSocial = (e) => {
        setFormSocial({ ...formSocial, [e.target.name]: e.target.value });
    } 
    const handleChangePersonal = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    }
    
    const handleSocial = async (e) => {
        e.preventDefault();
        try {
        const res = await fetch("/api/customer/profile/social", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formSocial),
        });

        const data = await res.json();
        setOpenDialog(false);
        toast.success("Social Media Details Updated");
        } catch (error) {
        throw new Error("Error updating address details", error.toString());
        }
    };
    const handlePhotoUpload = async(e)=>{
        e.preventDefault();
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("username", user_id);
        const res = await fetch("/api/customer/profile/photo", {
            method: "POST",
            body: formData,
        });
        const data = await res.json();
        setUserData({...userData, photo: data.data});
        toast.success("Photo Updated");
        setOpenDialog2(false);
    }
    const handlePersonal = async(e) => {
        e.preventDefault();
        try {
        const res = await fetch("/api/customer/profile/personal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        const data = await res.json();
        setOpenDialog1(false);
        toast.success("Personal Details Updated");
        } catch (error) {
        throw new Error("Error updating address details", error.toString());
        }
        
    };
  return (
    <div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <Card className='mt-2'>
            <CardContent>
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                        <div className="w-30 h-30">
                            <div className='flex flex-col items-center'>
                                {userData.photo ? (
                                    <Image
                                    width={80}
                                    height={80}
                                    src={userData.photo}
                                    className='overflow-hidden border border-gray-200 rounded-full dark:border-gray-800'
                                    alt="user profile photo"
                                    />
                                ):(
                                    <Image
                                    width={80}
                                    height={80}
                                    src={"/images/owner.jpg"}
                                    className='overflow-hidden border border-gray-200 rounded-full dark:border-gray-800'
                                    alt="user profile photo"
                                    />
                                )}
                                
                                <Dialog open={openDialog2} onOpenChange={setOpenDialog2}>
                                    <DialogTitle></DialogTitle>
                                    <DialogTrigger asChild>
                                        <Button variant="default">Change</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px] place-content-center">
                                        <h3 className='text-lg font-semibold text-center'>Upload New Profile Photo</h3>
                                        <form onSubmit={handlePhotoUpload} className="mt-4 space-y-4">
                                            <Input accept="image/*" type="file" name='file' onChange={(e) => setFile(e.target.files?.[0] || null)} />
                                            <div className='flex justify-center'>
                                                <Button variant={"default"} type="submit" onClick={handlePhotoUpload}>Upload</Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>  
                        </div>
                        <div className="order-3 xl:order-2">
                            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                                {userData.first_name} {userData.last_name}
                            </h4>
                            <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                {userData.bio}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
                        <a        
                    target="_blank"
                    rel="noreferrer" href={formSocial?.facebook} className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                            <Image src={"/icons/facebook.png"} alt="facebook" width={20} height={20}></Image>
                        </a>

                        <a href={formSocial?.twitter} target="_blank"
                    rel="noreferrer"  className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                            <Image src={"/icons/twitter.png"} alt="twitter" width={20} height={20}></Image>
                        </a>

                        <a href={formSocial?.linkedin} target="_blank"
                    rel="noreferrer" className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                            <Image src={"/icons/linkedin.png"} alt="linkedin" width={20} height={20}></Image>
                        </a>

                        <a href={formSocial?.instagram} target="_blank"
                    rel="noreferrer" className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                            <Image src={"/icons/instagram.png"} alt="instagram" width={20} height={20}></Image>
                        </a>
                        </div>
                    </div>
                    <DialogTrigger asChild>
                        <Button variant="default">Edit</Button>
                    </DialogTrigger>
                </div>
            </CardContent>
        </Card>
        <form onSubmit={handleSocial}>
            <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Edit Personal Information</DialogTitle>
                <DialogDescription>Update your details to keep your profile up-to-date.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
                <div className="grid gap-3">
                    <Label>Facebook</Label>
                    <Input type="text" name="facebook" value={formSocial.facebook} onChange={handleChangeSocial} />
                </div>
                <div className="grid gap-3">
                    <Label>Instagram</Label>
                    <Input type="text" name="instagram" value={formSocial.instagram} onChange={handleChangeSocial} />
                </div>
                <div className="grid gap-3">
                    <Label>Twitter</Label>
                    <Input type="text" name="twitter" value={formSocial.twitter} onChange={handleChangeSocial}  />
                </div>
                <div className="grid gap-3">
                    <Label>Linkedin</Label>
                    <Input type="text" name="linkedin" value={formSocial.linkedin} onChange={handleChangeSocial}  />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" onClick={handleSocial}>Save changes</Button>
            </DialogFooter>
            </DialogContent>
        </form>
    </Dialog>


    <Dialog open={openDialog1} onOpenChange={setOpenDialog1}>
        <Card className='mt-2'>
            <CardHeader>
                <CardTitle>Personal Details</CardTitle>
                <CardAction>
                    <DialogTrigger asChild>
                        <Button variant="default">Edit</Button>
                    </DialogTrigger>
                </CardAction>
            </CardHeader>
            <CardContent className='justify-between'>
                <div className='flex flex-2'>
                    <div className='w-1/2'>
                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">First Name</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">{userData.first_name} </p>
                    </div>
                    <div className='w-1/2'>
                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Last Name</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">{userData.last_name}</p>
                    </div>
                </div>
                <div className='flex flex-2'>
                    <div className='w-1/2'>
                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Email</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">{userData.email}</p>
                    </div>
                    <div className='w-1/2'>
                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Phone</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">{userData.phone}</p>
                    </div>
                </div>
                <div className='flex flex-2'>
                    <div className='w-full'>
                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Bio</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">{userData.bio}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
        <form onSubmit={handlePersonal}>
            <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Edit Personal Details</DialogTitle>
                <DialogDescription>Make changes to your profile here. Click save when you&apos;re done.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
                <div className="grid gap-3">
                    <Label>First Name</Label>
                    <Input type="text" name="first_name" value={userData.first_name} onChange={handleChangePersonal} />
                </div>
                <div className="grid gap-3">
                    <Label>Last Name</Label>
                    <Input type="text" name="last_name" value={userData.last_name} onChange={handleChangePersonal} />
                </div>
                <div className="grid gap-3">
                    <Label>Email</Label>
                    <Input type="email" name="email" value={userData.email} onChange={handleChangePersonal} />
                </div>
                <div className="grid gap-3">
                    <Label>Phone</Label>
                    <Input type="text" name="phone" value={userData.phone} onChange={handleChangePersonal} />
                </div>
                <div className="grid gap-3">
                    <Label>Bio</Label>
                    <Input type="text" name="bio" value={userData.bio} onChange={handleChangePersonal} />
                </div>
                
            </div>
            <DialogFooter>
                <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" onClick={handlePersonal}>Save changes</Button>
            </DialogFooter>
            </DialogContent>
        </form>
    </Dialog>
    </div>
  );
}