"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useWishlist } from "@/lib/WishlistContext";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";


export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = useMemo(() => searchParams.get("q") || "", [searchParams]);
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [maxPrice, setMaxPrice] = useState(0);
  const [availability, setAvailability] = useState("In Stock");

  const didRun = useRef(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        q,
        page: page.toString(),
        brands: selectedBrands.join(","),
        minPrice: priceRange[0].toString(),
        maxPrice: priceRange[1].toString(),
        availabilityStatus: availability
      });

      const res = await fetch(`/api/products/search?${params}`, { cache: "no-store" });
      const data = await res.json();

      if (data.success) {
        setProducts(data.products || []);
        //setBrands(data.brands || []);
        if (data.priceRange?.maxPrice) {
          setMaxPrice(data.priceRange.maxPrice);
          if (priceRange[1] === 0) setPriceRange([0, data.priceRange.maxPrice]);
        }
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, [q, page, selectedBrands, priceRange]);

  async function getBrands() {
    const res = await fetch("/api/brands");
    const data = await res.json();
    setBrands(data.brands);
  }
  const handleAvailabilityChange = (value:string) => {
    setAvailability(value);
  };
  const showProductDetails =(p: string)=>{
    router.push(`/product-details/${p}`);
  }
  function handleAddToCart(p: any) {
    addToCart(p);
    toast.success("Product added to cart");
  }
  // Prevent double execution in dev
  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;
    fetchProducts();
    getBrands();
  }, [fetchProducts]);

  // Debounce fetch on price/brand changes
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProducts();
    }, 600); // 600ms debounce

    return () => clearTimeout(handler);
  }, [selectedBrands, priceRange, fetchProducts]);

  const handleBrandChange = useCallback(
    (name: string, checked: boolean) => {
      setSelectedBrands((prev) =>
        checked ? [...prev, name] : prev.filter((b) => b !== name)
      );
    },
    []
  );
  
  const getProduct = (id: string) => {
    router.push(`/product-details/${id}`);
  };
  

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

        <div>
          <h3 className="font-semibold mb-2">Availablity</h3>
          <div className="space-y-1 max-h-48 overflow-y-auto pr-2">
            <div className="flex flex-col items-left space-x-2">
            <div className="flex padding-2">
              <Checkbox value={"In Stock"} onCheckedChange={(val) => handleAvailabilityChange("In Stock")} id="in_stock"/>
              <Label htmlFor="in_stock">In Stock</Label>
            </div>
            <div className="flex">
              <Checkbox onCheckedChange={(val) => handleAvailabilityChange("Out of Stock")} id="out_of_stock"/>
              <Label htmlFor="out_of_stock">Out of Stock</Label>
            </div>

            </div>
              
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
        <h2 className="text-xl font-bold">Results for “{q}”</h2>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin w-6 h-6" />
          </div>
        ) : products.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p: any) => (
              <Card key={p._id} className="cursor:hand" onClick={()=>getProduct(p._id)}>
                <CardContent className="p-4">
                  <Image
                    src={p.images[0] || "/images/products/image-placeholder.webp"}
                    alt={p.title}
                    className="w-full h-40 object-cover rounded-lg mb-2"
                    width={200}
                    height={200}
                  />
                  <h4 className="font-semibold text-sm">{p.title}</h4>
                  <p className="text-gray-500 text-xs">{p.brand}</p>
                  <p className="font-bold text-primary mt-1">₹{p.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 pt-4">
          <Button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            variant="outline"
          >
            Prev
          </Button>
          <span className="text-sm">Page {page}</span>
          <Button onClick={() => setPage((p) => p + 1)} variant="outline">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}