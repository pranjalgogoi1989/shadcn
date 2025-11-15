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
import { Toaster } from "../ui/sonner";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import Image from "next/image";
import { tr } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";


export default function Wallet({user_id}:{user_id:string}) {
    const [wallets, setWallet] = useState(null);
    

    const getWallet = async () => {
      try {
        const response = await fetch(`/api/customer/wallet`);
        const data = await response.json();
        if(data.success){
            setWallet(data.wallet);
        }else{
            toast.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching wallet:", error);
      }
    }
    useEffect(() => {
      getWallet();
    }, []);

    const addFund = async () => {
        toast.success("Funds added successfully");
    }
  return (
    <div>
        { wallets && wallets.map((wallet) => (
        <Card key={wallet._id} className='mt-2'>
            <CardContent>
                <div className="flex flex-row gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex flex-row items-center w-full gap-6 xl:flex-row">
                        <div className="w-13 h-13">
                            <div className='flex flex-col items-center'>
                                <Image src="/images/Indian_Rupee.png" alt="wallet" width={100} height={100} className="w-12 h-12" />  
                            </div>  
                        </div>
                        <div className="">
                            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                                My Wallet
                            </h4>
                            <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                                <p className="text-lg text-gray-500 dark:text-gray-400">
                                Balance : 

                                <span className="text-lg text-semibold text-gray-500 dark:text-gray-400">
                                    ₹ {Number(wallet.balance || 0).toFixed(2)} ({wallet.currency})
                                </span>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
                            <Button variant={'default'} onClick={addFund}>Add Fund</Button>
                        </div>
                    </div>
                    
                </div>
                <div className="mt-6 items-center w-full gap-6 xl:flex-row">
                    <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                        Transactions:
                    </h4>
                    <Separator />
                    
                    <div className="flex flex-row items-center w-full gap-6 xl:flex-row text-white bg-slate-800 text-semibold">
                        <div className="flex-1">
                            Type
                        </div>
                        <div className="flex-1">
                            Source
                        </div>
                        <div className="flex-1">
                            Amount
                        </div>
                        <div className="flex-1">
                            Status
                        </div>
                        <div className="flex-1">
                            Remarks
                        </div>
                        <div className="flex-1">
                            Date
                        </div>
                    </div>
                    
                    <Separator />
                    {wallet && wallet.transactions.map((transaction) => (
                        <div key={transaction._id} className="items-center w-full gap-6 xl:flex-row hover:bg-amber-400">
                            <div className={transaction.type === "Credit" ? "flex flex-row items-center w-full gap-6 xl:flex-row text-green-600" : "flex flex-row items-center w-full gap-6 xl:flex-row text-red-600"}>
                                <div className="flex-1">
                                    {transaction.type}
                                </div>
                                <div className="flex-1">
                                    {transaction.source}
                                </div>
                                <div className="flex-1">
                                    {transaction.type === "Credit" ? '+':'-' }
                                    {transaction.amount}
                                </div>
                                <div className="flex-1">
                                    {transaction.status}
                                </div>
                                <div className="flex-1">
                                    {transaction.remarks}
                                </div>
                                <div className="flex-1">
                                    {transaction.createdAt}
                                </div>
                            </div>
                            <Separator />
                        </div>
                    ))}
                    
                </div>
            </CardContent>
        </Card>
        ))}
    </div>
  );
}