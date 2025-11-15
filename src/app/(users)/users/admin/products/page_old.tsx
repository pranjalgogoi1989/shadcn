"use client";
import { DataTable } from '@/components/data-table'
import React from 'react';
import { useState, useEffect } from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { Button } from '@/components/ui/button';

import { useSearchParams } from "next/navigation";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { IDimentions } from '@/models/Product';
import { IReview } from '@/models/Review';
import clsx from 'clsx';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"


const ProductPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);  //all products from database
  
  async function fetchProducts(){
    const category = searchParams.get("categoryId");
    if(category){
      const res = await fetch(`/api/admin/products?categoryId=${category}`);
      const data = await res.json();
      setProducts(data.products);
    }else{
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      setProducts(data.products);
      console.log(data.products);
    }
  }
  useEffect(() => {
      fetchProducts();
  }, []);


//"title","description","basePrice","categoryId","brand","mainImage","variants","sellerId"

  const validKeys: string[] = ["mainImage","title","basePrice","categoryName","brand","variants","sellerId","updatedAt"];
  const columnOrder: string[] = ["mainImage","title","description","basePrice","categoryName","brand","variants","sellerId","updatedAt"];
  
  // const baseColumns: ColumnDef<any>[] =
  //     products.length > 0
  //       ? columnOrder
  //           .filter((key) => validKeys.includes(key)) 
  //           .map((key) => {
  //             if (key === "mainImage") {
  //               return {
  //                 accessorKey: key,
  //                 header: "Avatar",
  //                 cell: ({ row }) => (
  //                   <img
  //                     src={row.original.mainImage[0]}
  //                     alt={row.original.title}
  //                     className="h-10 w-10 rounded-full object-cover"
  //                   />
  //                 ),
  //               };
  //             }
  //             return {
  //               accessorKey: key,
  //               header: key.charAt(0).toUpperCase() + key.slice(1),
  //             };
  //           })
  //       : [];

  // const actionColumn: ColumnDef<any> = {
  //     id: "actions",
  //     header: "Actions",
  //     cell: ({ row }) => {
  //       const userid = row.original._id; // full row data
  //       return (
  //         <div className="flex gap-2">
  //           <Button
  //             size="sm"
  //             variant="outline"
  //             onClick={() => alert(`Edit Category ${userid}`)}
  //           >
  //             Edit
  //           </Button>
            
  //           <Button
  //             size="sm"
  //             variant="destructive"
  //             onClick={() => alert(`Delete Category ${userid}`)}
  //           >
  //             Delete
  //           </Button>
  //         </div>
  //       );
  //     },
  //   };
  //   const finalcolumns = [...baseColumns, actionColumn];
    const handleNewproduct = () => {
      router.push("/users/admin/products/add");
    }
  return (
    <div className="flex flex-1 flex-col">
      
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 overflow-auto">
            <div className='flex place-content-end'>
              <Button variant={'default'} onClick={handleNewproduct}>Add New Product</Button>
            </div>
            <div className='flex place-content-start bg-slate-600 text-white text-semibold'>
              {validKeys.map((key) => {
                return (
                  <div key={key} className={clsx(key==="variants" ? "flex-3" : "flex-1")+' place-content-center'}>
                    {key}
                  </div>
                )
              })}
            </div>
            {products.map((product) => {
              return (

                <div key={product._id} className='flex border-b border-slate-600'>
                  <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2">
                    <Avatar>
                      <AvatarImage src={product.mainImage[0]} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarImage src={product.mainImage[1]} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className='flex-1'>{product.title}</div>
                  
                  <div className='flex-1 text-center'>{product.basePrice}</div>
                  <div className='flex-1 text-center'>{product.categoryId}</div>
                  <div className='flex-1 text-center'>{product.brand}</div>
                  <div className='flex-3'>
                    {product.variants.map((item:any) => (

                      Object.entries(item.attributes).map(([k,v]) => `${k}: ${v}`).join(", ") +
                      `, Stock:${item.stock}, Price: ₹${item.price}`
                    )
                    )
                    .join(",\n")}
                  </div>
                  
                  <div className='flex-1'>{product.sellerId}</div>
                  <div className='flex-1'>{product.updatedAt.toLocaleString()}</div>
                </div>
              )}
            )}

           {/* <DataTable data={products} columns={finalcolumns} downloadable={true} /> */}
        </div>
      </div>
    </div>
  )
}

export default ProductPage