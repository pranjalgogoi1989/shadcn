'use client';
import React from 'react'

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import Image from 'next/image';

import { useState, useEffect } from 'react';

interface ILogo {
  _id: string;
  title: string;
  image:string;
  createdAt: string;
  updatedAt: string;
}

const UserProfile = () => {
    const [file, setFile] = useState<File | null>(null);
    const [dblogo,setDbLogo] = useState<ILogo | null>(null);
    const [openDialog, setOpenDialog] = useState(false);

    const getLogo = async()=>{
        const data = await fetch('/api/logo');
        const rs = await data.json();
        setDbLogo(rs);
        console.log(rs);
    }

    const handlePhotoUpload = async(e)=>{
        e.preventDefault();
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/logo", {
            method: "POST",
            body: formData,
        });
        const data = await res.json();
        toast.success(data.message);
        setOpenDialog(false);
        getLogo();
    }

    useEffect(()=>{
        getLogo();
    },[])
  return (
    <div className="flex flex-col gap-5 xl:flex-row md:items-center xl:items-center xl:justify-between">
        <div className="flex flex-col w-full gap-6 xl:flex-row">
            <div className='flex items-center'>
                <div className='flex flex-col items-center mt-10'>
                    <Image
                        width={300}
                        height={300}
                        src={dblogo?.image || "/images/logo/logo.jpg"}
                        className='overflow-hidden border border-gray-200 rounded-full dark:border-gray-800'
                        alt="logo"
                    />
                    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                        <DialogTitle></DialogTitle>
                        <DialogTrigger asChild>
                            <Button variant="default">Change/Upload</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] place-content-center">
                            <h3 className='text-lg font-semibold text-center'>Upload New Logo</h3>
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
        </div>
    </div>
  )
}

export default UserProfile