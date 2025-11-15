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
  const [categories, setCategories] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  
  async function fetchProducts(){
    const category = searchParams.get("categoryId");
     
    if(category){
      const params = new URLSearchParams({
        page: page.toString(),
        categoryId:category,
      });
      const res = await fetch(`/api/seller/products?${params}`);
      const data = await res.json();
      setProducts(data.products);
      setPageCount(data.totalPages);
    }else{
      const params = new URLSearchParams({
        page: page.toString(),
      });
      const res = await fetch(`/api/seller/products?${params}`);
      const data = await res.json();
      setProducts(data.products);
      setPageCount(data.totalPages);
    }
  }
  async function getCategories() {
    const res = await fetch(`/api/seller/categories`);
    const data = await res.json();
    setCategories(data.data);
  }
  useEffect(() => {
      getCategories();
      fetchProducts();
  }, []);

  const validKeys: string[] = ["Image","Title","Base Price","Category Name","Brand","Variants", "Details"];
  
  const handleNewproduct = () => {
    router.push("/seller/products/new");
  }
  const gotoProductDetails = (productId:string)=>{
    router.push("/seller/products/"+productId);
  }
  return (
    <div className="flex flex-1 flex-col">
      
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 overflow-auto">
            <div className='flex place-content-end'>
              <Button variant={'default'} onClick={handleNewproduct}>Add New Product</Button>
            </div>
            <table className='w-full'>
              <thead className='bg-slate-500 text-white bordered'>
                <tr>
                  {validKeys.map((key) => {
                    return (
                      <th key={key}>
                        {key}
                      </th>
                    )
                  })}
                  
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  return (
                    <tr key={product._id} className="border-b hover:bg-slate-200">
                        <td>
                            <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2">
                              {product.mainImage.map((imageLink,index)=> (
                                <Avatar key={index}>
                                    <AvatarImage src={imageLink} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                              ))}
                                
                            </div>
                        </td>
                        <td>{product.title}</td>
                        <td>{product.basePrice}</td>
                        <td>
                          {categories.map((category) => category._id === product.categoryId && category.cat_name)}
                            
                        </td>
                        <td>{product.brand}</td>
                        <td>
                            {product.variants.map((item: any, index: number) => (
                            <span key={index}>
                            {Object.entries(item.attributes)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(", ")}
                            , Stock: {item.stock}, Price: ₹{item.price}
                            <br />
                            </span>
                        ))}
                        </td>
                        <td>
                          <Button variant={"default"} onClick={() => gotoProductDetails(product._id)}>View Details</Button>
                        </td>
                    </tr>
                  )
                })

                }
              </tbody>
            </table>
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

           {/* <DataTable data={products} columns={finalcolumns} downloadable={true} /> */}
        </div>
      </div>
    </div>
  )
}

export default ProductPage