"use client";

import React,{ useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface Product {
  _id: string;
  title: string;
  basePrice: number;
  brand?: string;
  mainImage: string[];
  category: string;
  variants?: any[];
}

export default function ProductSearchPage() {
    const params = useParams();
    const { category } = params;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [maxPrice, setMaxPrice] = useState(0);
  const didRun = useRef(false);

  const fetchProducts = async()=>{
    setLoading(true);
    
    try {
      const catId = await fetch(`/api/common/categories?slug=${category}`);
      const catData = await catId.json();
      const cat = catData.data._id;
      const res = await fetch(`/api/customer/products/search?q=${cat}&category=${cat}`);
      const data = await res.json();
      if (data.success){
        setProducts(data.products);
        setTotalPages(data.totalPages);
        if (data.priceRange?.maxPrice) {
          setMaxPrice(data.priceRange.maxPrice);
          if (priceRange[1] === 0) setPriceRange([0, data.priceRange.maxPrice]);
        }
      } 
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
   
    fetchProducts();
  },[category]);
  
  useEffect(() => {
      if (didRun.current) return;
      didRun.current = true;
      fetchProducts();
      getBrands();
    }, [fetchProducts]);
  async function getBrands() {
    const res = await fetch("/api/customer/brands");
    const data = await res.json();
    setBrands(data.brands);
  }

  const handleBrandChange = useCallback(
      (name: string, checked: boolean) => {
        setSelectedBrands((prev) =>
          checked ? [...prev, name] : prev.filter((b) => b !== name)
        );
      },
      []
    );

  return (
    <div className="flex gap-6 p-6">
      {/* Filters Sidebar */}
      <div className="w-64 space-y-6">
        {/* Brand Filter */}
        <div>
          <h3 className="font-semibold mb-2">Brands</h3>
          <div className="space-y-1 max-h-48 overflow-y-auto pr-2">
            {Array.isArray(brands) && brands.length > 0 ? (
              brands.map((b: any) => (
                <div key={b._id} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedBrands.includes(b.name)}
                    onCheckedChange={(val) => handleBrandChange(b.name, val)}
                    id={b.name}
                  />
                  <Label htmlFor={b.name}>{b.name}</Label>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No brands found</p>
            )}
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <h3 className="font-semibold mb-2">Price Range</h3>
          <Slider min={0} max={maxPrice || 1000} step={10} value={priceRange} onValueChange={(val) => setPriceRange(val as [number, number])} />
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </div>
        {/* Manual apply button (optional) */}
        <Button onClick={() => fetchProducts()} variant="secondary" className="w-full">
          Apply Filters
        </Button>
        <Button
          onClick={() => {
            setSelectedBrands([]);
            setPriceRange([0, maxPrice]);
            setPage(1);
            fetchProducts();
          }}
          variant="outline"
          className="w-full"
        >
          Reset Filters
        </Button>
      </div>

      {/* Results Section */}
      <div className="flex-1 space-y-4">
        <h2 className="text-xl font-bold">Products Listed under “{category}”</h2>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <Card
              key={product._id}
              className="group overflow-hidden transition hover:shadow-md cursor-pointer relative"
            >
              {/* Entire card clickable except Add to Cart */}
              <Link
                href={`/product-details/${product._id}`}
                className="block"
              >
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <Image
                    src={product.mainImage?.[0] || "/placeholder.png"}
                    alt={product.title}
                    width={400}
                    height={400}
                    className="object-cover w-full h-full group-hover:scale-105 transition"
                  />
                </div>
                <div className="p-3 space-y-1">
                  <h3 className="font-medium truncate">{product.title}</h3>
                  <p className="text-sm text-gray-500 truncate">
                    {product.brand || product.category}
                  </p>
                  <p className="font-semibold text-lg">starting from ₹{product.basePrice}</p>
                </div>
              </Link>

              {/* Add to Cart button */}
              <div className="absolute bottom-3 right-3">
                <Link
                href={`/product-details/${product._id}`}
                
              >
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-full"
                >
                  Details
                </Button>
              </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    <div className="flex justify-center items-center gap-2 pt-4">
      <Button
        onClick={() => setPage((p) => Math.max(p - 1, 1))}
        disabled={page === 1}
        variant="outline"
      >
        Prev
      </Button>
      <span className="text-sm">Page {page}</span>
      <Button onClick={() => setPage((p) => p + 1)} disabled={parseInt(page) === parseInt(totalPages)} variant="outline">
        Next
      </Button>
    </div>
  </div>
</div>
  );
}