'use client';
import React from 'react'
import { useState, useEffect } from 'react';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { IProduct, IDimentions, ICategory, IReview, ISubCategory, IBrand } from '@/models/Product';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from '@/components/ui/sonner';
import { set } from 'mongoose';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

const AddProduct = () => {
    const { data: session } = useSession();
    const [product, setProduct] = useState<IProduct>({
        title: "",
        description: "",
        category: "",
        price: 0,
        discountPercentage: 0,
        deliveryCharge:0,
        deliveryTime:7,
        rating: 0,
        stock: 0,
        tags: [],
        brand: "",
        sku: "",
        weight: 0,
        dimensions: {
            width: 0,
            height: 0,
            length: 0,
            depth: 0,
            color: "",
        },
        warrantyInformation: "",
        shippingInformation: "",
        availabilityStatus: "",
        reviews: [],
        returnPolicy: "",
        minimumOrderQuantity: 0,
        meta: [],
        images: [],
        thumbnails: "",
        seller_id: session?.user?.id || "",
    });

    const [category, setCategory] = useState([]);
    const [sCat, setSCat] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    async function fetchCategories(){
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategory(data);
    }
    useEffect(() => {
        fetchCategories();
    }, []);
    
    function handleChange(e) {
        setProduct({ ...product, [e.target.name]: e.target.value });
    }
     
    async function handleSubmit(e) {
        e.preventDefault();
        console.log(files);
        try {
            const formData = new FormData();
            if(files){
                files.map((file) => {
                    formData.append("files", file);
                })
            }
            formData.append("product", JSON.stringify(product));
            const res = await fetch("/api/products", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            toast(data.message);
        } catch (error) {
            console.error(error);
        }
    }
    function handleProductDimension(e){
        setProduct({...product, dimensions: {...product.dimensions, [e.target.name]: e.target.value}});
    }
   function handleFilesChange(e){
        const newFiles = Array.from(e.target.files);
        setFiles((prev) => [...prev, ...newFiles]);
    };
  return (
    <div>
        <Card>
            <CardHeader>
                <div className='flex flex-col justify-content-center'>
                    <CardTitle className='text-2xl'>Add New Product</CardTitle>
                    <CardDescription>Enter Product Details</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                        <div className='flex'>
                            <div className="flex-1">
                                <Label>Product Name</Label>
                                <Input type="text" name="title" value={product.title} onChange={handleChange} />
                            </div>
                            <div className="flex-1">
                                <Label>Category</Label>
                                <Select name="category" value={product.category || ""} onValueChange={(val)=>setProduct({...product, category: val})}>
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent className='w-full'>
                                    {category.map((cats) => (
                                    <SelectItem key={cats._id} value={cats._id}>
                                        {cats.cat_name}
                                    </SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                            </div>
                            <div className="flex-1">
                                <Label>Description</Label>
                                <Input type="text" name="description" value={product.description} onChange={handleChange} />
                            </div>
                        </div>
                        <div className='flex'>
                            <div className="flex-1">
                                <Label>Price</Label>
                                <Input type="number" name="price" value={product.price} onChange={handleChange} />
                            </div>
                            <div className="flex-1">
                                <Label>Discount Percentage</Label>
                                <Input type="number" name="discountPercentage" value={product.discountPercentage} onChange={handleChange} />
                            </div>
                            <div className="flex-1">
                                <Label>Rating</Label>
                                <Input type="number" name="rating" value={product.rating} onChange={handleChange} />
                            </div>
                        </div>
                        <div className='flex'>
                            <div className="flex-1">
                                <Label>Stock</Label>
                                <Input type="number" name="stock" value={product.stock} onChange={handleChange} />
                            </div>
                            <div className="flex-1">
                                <Label>Brand</Label>
                                <Input type="text" name="brand" value={product.brand} onChange={handleChange} />
                            </div>
                            <div className="flex-1">
                                <Label>Availability Status</Label>
                                <Input type="text" name="availabilityStatus" value={product.availabilityStatus} onChange={handleChange} />
                            </div>
                        </div>
                        <div className='flex'>
                            <div className='flex-1'>
                                <Label>Delivery Charge</Label>
                                <Input type='text' name='deliveryCharge' value={product.deliveryCharge} onChange={handleChange} />
                            </div>
                            <div className='flex-1'>
                                <Label>Delivery Time (in Days)</Label>
                                <Input type='text' name='deliveryTime' value={product.deliveryTime} onChange={handleChange} />
                            </div>
                        </div>

                        <div className='flex'>
                            <div className="flex-1">
                                <Label>Minimum Order Quantity</Label>
                                <Input type="number" name="minimumOrderQuantity" value={product.minimumOrderQuantity} onChange={handleChange} />
                            </div>
                            <div className='flex-1'>
                                <Label>Tags</Label>
                                <Input type="text" name="tags" value={product.tags} onChange={handleChange} />
                            </div>          
                            <div className='flex-1'>
                                <Label>SKU</Label>
                                <Input type="text" name="sku" value={product.sku} onChange={handleChange} />
                            </div>
                            <div className='flex-1'>
                                <Label>Weight</Label>
                                <Input type="number" name="weight" value={product.weight} onChange={handleChange} />
                            </div>
                        </div>
                        <div className='bg-gray-300'>
                            <div className='flex'>
                                <div className='text-2xl justify-center'>Product Variant Details</div>
                            </div>
                            <div className='flex'>
                                <div className='flex-1'>
                                    <Label>Width</Label>
                                    <Input type="number" name="width" value={product.dimensions.width} onChange={handleProductDimension} />
                                </div>
                                <div className='flex-1'>
                                    <Label>Height</Label>
                                    <Input type="number" name="height" value={product.dimensions.height} onChange={handleProductDimension} />
                                </div>
                                <div className='flex-1'>
                                    <Label>Length</Label>
                                    <Input type="number" name="length" value={product.dimensions.length} onChange={handleProductDimension} />
                                </div>
                                <div className='flex-1'>
                                    <Label>Color</Label>
                                    <Input type="text" name="color" value={product.dimensions.color} onChange={handleProductDimension} />
                                </div>
                            </div>
                        </div>
                        <div className='flex'>
                            <div className='flex-1'>
                            <Label>Warranty Information</Label>
                            <Input type="text" name="warrantyInformation" value={product.warrantyInformation} onChange={handleChange} />
                            </div>
                            <div className='flex-1'>
                            <Label>Shipping Information</Label>
                            <Input type="text" name="shippingInformation" value={product.shippingInformation} onChange={handleChange} />
                            </div>
                        </div>
                        <div className='bg-gray-300'>
                            <div className='flex'>
                                <div className='text-2xl justify-center'>Product Images</div>
                            </div>
                            <div className='flex'>
                                <div className='flex-1'>
                                    <Label>Select All Images of the Product</Label>
                                    <Input accept="image/*" type="file" multiple name='image_1' onChange={handleFilesChange} />
                                </div>
                                <div className='flex-2'>
                                    {files.length > 0 && (
                                    <div className="border p-3 rounded bg-gray-50 text-sm">
                                        <p className="font-semibold mb-2">Files selected:</p>
                                        <ul className="list-disc pl-5 space-y-1">
                                        {files.map((file, index) => (
                                            <li key={index}>{file.name}</li>
                                        ))}
                                        </ul>
                                    </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className='flex justify-center'>
                            <Button variant="outline">Cancel</Button>
                            <Button type="submit" onClick={handleSubmit}>Submit</Button>
                        </div>
                    </div>
                </form>
            </CardContent>
            
        </Card>
    </div>
  )
}

export default AddProduct

