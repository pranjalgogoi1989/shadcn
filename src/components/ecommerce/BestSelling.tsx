"use client"
import * as React from "react"
import { useCart } from "@/lib/CartContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image"
import { Button } from "../ui/button"

import {useState, useEffect} from "react";
import { Heart, HeartOff } from "lucide-react";
import { useWishlist } from "@/lib/WishlistContext";
import Link from "next/link";

interface BestDeals{
  productId: {type:string},
  productTitle: {type:string},
  variantId: {type:string},
  variantPrice: {type:number},
  variantOriginalPrice: {type:number},
  variantDiscount: {type:number},
  variantImage: [],
}
export default function BestDeals() {
  const [products, setProducts] = useState<BestDeals>(null);
  const { addToCart, totals } = useCart();
  const standardDeliveryCharge = Number(process.env.NEXT_PUBLIC_DELIVERY_CHARGE);
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const isWishlisted = (productId: string) =>
    wishlist.some((item) => item.product_id === productId);

  async function getBestDeals() {
    const res = await fetch("/api/common/best-deals");
    const data = await res.json();
    setProducts(data.products);
  }
  useEffect(() => {
    getBestDeals();

  },[]);

  return (
    <div className="mt-1">
      <Card>
        <CardHeader className="flex">
          <span className="text-3xl font-semibold">Best Deals</span>
        </CardHeader>
        <CardContent>
          <Carousel opts={{align: "start",}} className="w-viewport mt-2">
            <CarouselContent>
              {products && products.map((singleProduct, index) => (
                <CarouselItem key={index} className="hs:basis-1/1 sm:basis-1/2 md:basis-1/3 lg:basis-1/6">
                  <Link href={`/product-details/${singleProduct.productId}`}>
                    <Card className="relative h-[350px]">
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full shadow-md">
                        {isWishlisted(singleProduct.productId) ? (
                          <Heart size={20} 
                            onClick={() => removeFromWishlist(singleProduct.productId)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-600 fill-red-500"
                            
                          />
                        ) : (
                          <HeartOff size={20} 
                            onClick={() => addToWishlist(singleProduct)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                          
                          />
                        )}
                      </div>

                      <div className="absolute top-3 right-3 bg-red-800 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md">
                        {singleProduct.variantDiscount}% OFF
                      </div>
                      
                      <CardContent className="flex flex-col items-center justify-center h-[270px]">
                        <Image src={singleProduct?.variantImage[0]} alt={singleProduct.productTitle} width={200} height={200} className="w-fit"/>
                        <div className="mb-3">
                          <span className="font-semibold" title={singleProduct.productTitle} >{singleProduct.productTitle.slice(0, 20)}</span>
                          <div className="flex text-sm text-semibold">
                          {singleProduct.variantAttributes &&
                            Object.entries(singleProduct.variantAttributes).map(([key, value]) => (
                              <div key={key} className="flex-1/2">
                                {value}
                              </div>
                            ))}
                          </div>
                          <div className="text-sm flex flex-row">
                            <span>Price : <s>₹{singleProduct.variantPrice}</s> </span>/ 
                            <span className="text-red-800 text-xl">₹{(singleProduct.finalPrice).toFixed(2)}</span>
                          </div>
                        </div>
                        
                      </CardContent>
                      
                      
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </CardContent>
      </Card>
      
        
    </div>
  )
}
