"use client";

import React, { useEffect, useState, use, useRef } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { set } from "mongoose";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {useRouter} from "next/navigation";
import Product from "@/models/Product";
import StarReviewForm from "@/components/customer/ProductReview";

export default function ProductPage({ params }: { params: Promise<{ product_id: string }> }) {
  const router = useRouter();
  const { product_id } = use(params);
  const {data:session} = useSession();
  const userId = session?.user?.id;
  const [orderQuantity, setOrderQuantity]= useState("");
  const [product, setProduct] = useState<any>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [isReadyToBuy, setIsReadyToBuy] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [mainImage, setMainImage] = useState("");
  //const [maxQuantity,setMaxQuantity]= useState("1");

  const containerRef = useRef<HTMLDivElement>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [backgroundPosition, setBackgroundPosition] = useState("center");

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setBackgroundPosition(`${x}% ${y}%`);
  };
  // ✅ Fetch product once
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/customer/products/${product_id}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.product);
          setReviews(data.reviews);
          setAvgRating(data.avgRating);
          setTotalOrders(data.totalOrders);
          setMainImage(data.product.mainImage[0]);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    }
    fetchProduct();
  }, [product_id]);

  // ✅ Check if user selected all options
  useEffect(() => {
    if (!product?.variants?.length) return;

    const variantAttributes = Object.keys(product.variants[0].attributes || {});
    const allSelected = variantAttributes.every((key) => selectedOptions[key]);
    setIsReadyToBuy(allSelected);

    if (allSelected) {
      // find the variant that matches all selected attributes
      const match = product.variants.find((v: any) =>
        variantAttributes.every((attr) => v.attributes[attr] === selectedOptions[attr])
      );
      setSelectedVariant(match || null);
      if(match){
        setMainImage(match.images[0]);
      }else{
        setMainImage(product.mainImage[0]);
        alert("Combination mismatch");
        window.location.reload();
      }
      //setMainImage(match.images[0] || product.mainImage[0]);
      //console.log("Combination Match : ",match);
      setOrderQuantity("1");
    } else {
      setSelectedVariant(null);
    }
  }, [selectedOptions, product]);

  const handleSelect = (attrName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [attrName]: value }));
  };

  if (!product) return <p className="p-4">Loading...</p>;

  const variantAttributes = product.variants?.[0]?.attributes || {};
  const displayPrice = selectedVariant?.price ?? product.basePrice;
  const displayStock = selectedVariant?.stock ?? product.stock;
  const displayImages = selectedVariant?.images?.length ? selectedVariant.images : product.mainImage;

  async function handleAddToCart() {
    if (!selectedVariant) {
      toast.error("Please select all variant options first.");
      alert("Please select all variant options first.");
      return;
    }
    if(!session){
      toast.error("Please login first");
    }
    const payload = {
      userId: session?.user?.id, // or your session id
      productId: product._id,
      variantId:selectedVariant._id,
      title: product.title,
      image: displayImages?.[0],
      variant: selectedVariant.attributes,
      price: selectedVariant.price || product.basePrice,
      deliveryCharge: selectedVariant.deliveryCharge || 0,
      quantity: parseInt(orderQuantity),
    };
    

    const res = await fetch("/api/customer/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (data.success) {
      alert(data.message);
      toast(data.message);
    } else {
      alert(data.message);
      toast(data.message);
    }
  }

  async function handleBuyNow() {
    if (!selectedVariant) {
      alert("Please select all variant options first.");
      return;
    }
     if(!session){
      alert("Please login first");
      toast.error("Please login first");
    }
    const payload = {
      userId: session?.user?.id,
      items: [
        {
          productId: product._id,
          variantId:selectedVariant._id,
          title: product.title,
          image: displayImages?.[0],
          variant: selectedVariant.attributes,
          price: selectedVariant.price || product.basePrice,
          deliveryCharge: selectedVariant.deliveryCharge || 0,
          quantity: parseInt(orderQuantity),
        },
      ],
    };
    
    const res = await fetch("/api/customer/order/place", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (data.success) {
      router.push(`/checkout-pay?orderId=${data.orderId}`);
    } else {
      alert(data.message);
      toast.error("Failed to place order");
    }
  }

  //setMainImage(displayImages?.[0] || "/placeholder.png");
  return (
    <div className="p-6 w-[1000px] mx-auto space-y-6 place-content-center">
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* ✅ Product Images */}
        <div
          ref={containerRef}
          className="space-y-2 relative w-full overflow-hidden rounded-xl"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          <Image
            src={mainImage}
            alt={product.title}
            width={400}
            height={400}
            className="rounded-lg object-cover transition-transform duration-200 w-full h-auto"
          />
          <div
            className={`w-[400px] h-[400px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  border rounded-xl bg-no-repeat bg-cover transition-opacity duration-200 ${
              isZoomed ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${mainImage})`,
              backgroundPosition,
              backgroundSize: "250%", // zoom strength
            }}
          >
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {displayImages?.map((img: string, i: number) => (
              <Image
                key={i}
                src={img}
                alt={`${product.title}-${i}`}
                width={80}
                height={80}
                onClick={() => setMainImage(img)}
                className="rounded-md border border-gray-200 cursor-pointer hover:border-blue-500"
              />
            ))}
          </div>
          
        </div>

        {/* ✅ Product Info */}
        <div>
          <h1 className="text-3xl font-semibold">{product.title}</h1>
          <p className="text-gray-600 mt-2">{product.description}</p>
          <div className="flex items-center gap-2 mt-3">
            <Star className="text-yellow-500" /> <span>{avgRating} / 5</span>
            <span className="text-gray-500">({reviews.length} reviews)</span>
            {totalOrders>0 && (
              <span className="ml-3 text-sm text-gray-600 font-semibold">{totalOrders} Order(s)</span>   
            )}
            
          </div>
          {/* ✅ Dynamic Price */}
          <p className="text-xl font-bold mt-4">
            ₹{displayPrice}{" "}
            {selectedVariant && (
              <span className="text-sm text-gray-500 ml-2">(variant price)</span>
            )}
          </p>

          {/* ✅ Variant Selection */}
          <div className="mt-6 space-y-4">
            {Object.entries(variantAttributes).map(([attrName, _], idx) => {
              const options = Array.from(
                new Set(product.variants.map((v: any) => v.attributes[attrName]))
              ).filter(Boolean);

              if (!options.length) return null;

              return (
                <div key={idx}>
                  <label className="block font-medium mb-2">{attrName}</label>
                  <div className="flex flex-wrap gap-2">
                    {options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleSelect(attrName, opt)}
                        className={`px-4 py-2 rounded border ${
                          selectedOptions[attrName] === opt
                            ? "bg-black text-white border-black"
                            : "border-gray-300 text-gray-700"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex gap-4">
            <Label htmlFor="orderQuantity">Quantity</Label>
            <Input type="number" readOnly={!isReadyToBuy} min={1} max={displayStock} value={orderQuantity} name="orderQuantity" onChange={(e)=>setOrderQuantity(e.target.value)}/>
          </div>
          {/* ✅ Buttons */}
          <div className="mt-6 flex gap-4">
            <button
              disabled={!isReadyToBuy}
              className={`px-6 py-3 rounded text-white ${
                isReadyToBuy ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={()=>handleAddToCart()}
            >
              Add to Cart
            </button>

            <button
              disabled={!isReadyToBuy}
              className={`px-6 py-3 rounded text-white ${
                isReadyToBuy ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={()=>handleBuyNow()}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
      {/* Reviews */}
      <div className="col-span-2 mt-8">
        <h3 className="text-xl font-semibold mb-3">Customer Reviews</h3>
        {reviews.some((f: any) => f.userId._id === userId) ? (
          <p> You have already submitted a review for this product</p>
        ) : (
          session && (
            <div>
              <h3 className="text-lg text-center">Submit Your Feedback</h3>
              <StarReviewForm productId={product._id} userId={userId}/>
            </div>
          )
        )}
          
        {reviews.length ? (
          reviews.map((r, i) => (
            <div key={i} className="flex gap-4 border-b py-3">
              <div className="items-center gap-2">
                <Image
                  src={ r.userId.image || "/images/user/owner.jpg"}
                  alt={r.userId.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
              <div className=" items-center gap-2">
                <div className="flex">
                  <span className="font-semibold">{r.userId.name}</span>
                  <Star className="text-yellow-500" /> <span>{r.rating}/5</span>
                </div>
                <div>
                  <p className="gap-2">{r.comment}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}