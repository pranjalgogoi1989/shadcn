'use client';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import React, { useState, useEffect } from 'react'
import { toast } from 'sonner';

const RefundPage = () => {
  const [refunds, setRefunds] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);

  const getRefunds = async () => {
    const params = new URLSearchParams({
      page: page.toString(),
    });
    try {
      const response = await fetch('/api/seller/refunds?' + params);
      const data = await response.json();
      if(data.success){
        setRefunds(data.refunds);
        setPageCount(data.totalPages);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getRefunds();
  },[]);

  const submitRefundStatus = async(e) =>{
    e.preventDefault();
    const refundId = e.target.refundId.value;
    const orderId = e.target.orderId.value;
    const itemId = e.target.itemId.value;
    const refundMethod = e.target.refundMethod.value;
    const refundAmount = e.target.refundAmount.value;

    
    const res = await fetch("/api/seller/refunds",{
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refundId: refundId,
        orderId: orderId,
        itemId: itemId,
        refundMethod: refundMethod,
        refundAmount: refundAmount,
      }),
    });
    const data = await res.json();
    if(data.success){
      getRefunds();
      toast.success(data.message);
    }
    setOpenDialog(false);
  }

  return (
    <div>
      <h1>Refunds</h1>
      <Separator />
      {refunds.map((refund) => (
        <div key={refund._id} className= {refund.refundStatus === 'Pending' ? 'hover:bg-amber-100' : 'bg-teal-200 hover:bg-amber-300'}>
          <div className='flex'>
            <div className='flex-1'>Ref.No.: <strong>{refund._id}</strong></div>
            <div className='flex-1'>Order: <strong>{refund.orderId}</strong></div>
            <div className='flex-1'>Item: <strong>{refund.itemId}</strong></div>
            <div className='flex-1'>Amount: <strong>₹{refund.amount.toFixed(2)}</strong></div>
            <div className='flex-1'>Refund Ref.No: <strong>{refund.refundId || '-'}</strong></div>
          </div>
          <div className='flex'>
            <div className='flex-1'>Refund Amount: <strong>₹{refund.refundAmount || '-'}</strong></div>
            <div className='flex-1'>Refund Method: <strong>{refund.refundMethod}</strong></div>
            <div className='flex-1'>Refund Status: <strong>
              <Badge variant={'default'}>
                {refund.refundStatus}
              </Badge>
              </strong></div>
            <div className='flex-1'>Refund Intiated On: <strong>{refund.createdAt}</strong></div>
            <div className='flex-1'>Last Updated On: <strong>{refund.updatedAt}</strong></div>
          </div>
          <div className='flex'>
            <div className='flex-1 place-content-center text-center'>
              {refund.refundStatus === 'Pending' && (

                <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                  <AlertDialogTrigger asChild>
                    <Button variant={'default'}>Proceed</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <form action="" onSubmit={submitRefundStatus}>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Please provide the refund details</AlertDialogTitle>
                        <AlertDialogDescription>

                          <Input className='w-full' type='hidden' id='refundId' name='refundId' defaultValue={refund._id}/>
                          <Input className='w-full' type='hidden' id='orderId' name='orderId' defaultValue={refund.orderId}/>
                          <Input className='w-full' type='hidden' id='itemId' name='itemId' defaultValue={refund.itemId}/>

                          <span className='mt-2'>
                            <Label htmlFor="refundMethod">Refund Method:</Label>
                            
                            <Select id="refundMethod" name="refundMethod" defaultValue={refund.refundMethod}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a status" />
                              </SelectTrigger>
                              <SelectContent className="w-full">
                                <SelectItem value={"Original Payment Method"}>{"Original Payment Method"}</SelectItem>
                                <SelectItem value={"Wallet"}>{"Wallet"}</SelectItem>
                                <SelectItem value={"Manual Bank Transfer"}>{"Manual Bank Transfer"}</SelectItem>
                              </SelectContent>
                            </Select>
                          </span>
                          <span className='mt-2'>
                            <Label htmlFor="refundAmount">Refund Amount:</Label>
                            <Input type="number" className='w-full' id="refundAmount" name="refundAmount" min={1} max={refund.amount} step={1} defaultValue={refund.amount}/>
                          </span>
                          
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className='mt-2'>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button type='submit' variant ={'default'}>Continue</Button>
                        
                      </AlertDialogFooter>
                      </form>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              
            </div>
          </div>
          <Separator />
        </div>
      ))}
      {refunds.length === 0 && <div className='flex'><div className='flex-1'>No Refunds Found</div></div>}

      <div className="flex justify-center items-center gap-2 pt-4">
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
      </div>
    </div>
  )
}

export default RefundPage