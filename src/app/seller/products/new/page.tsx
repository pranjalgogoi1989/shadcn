"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { set } from "mongoose";

export default function AddProductPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [variantFields, setVariantFields] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({});
  const [product, setProduct] = useState({
    title: "",
    description: "",
    brand: "",
    basePrice: "",
    mainImage: [] as string[],
  });
  const [myattributes,setMyAttributes]  = useState<any>({});
  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch("/api/seller/categories");
      const data = await res.json();
      if (data.status===200) setCategories(data.data);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!categoryId) return;
    async function fetchCategoryVariants() {
      const res = await fetch(`/api/seller/category-variants?categoryId=${categoryId}`);
      const data = await res.json();
      if (data.success && data.data) {
        setVariantFields(data.data.variantFields);
        const myvariants = data.data.variantFields;
        const emptyAttributes = Object.fromEntries(myvariants.map((v) => [v.name, { type: v.type, options: v.options || [] }]));
        setMyAttributes(emptyAttributes);
      }
    }
    fetchCategoryVariants();
  }, [categoryId]);

  const addVariant = () => {
     const emptyAttributes = Object.fromEntries(variantFields.map((v) => [v.name, ""]));
    setVariants([
      ...variants,
      { attributes: emptyAttributes, images: [], stock: 0, price: 0, deliveryCharge: 0, originalPrice: 0, discount:0 },
    ]);
  };
  const handleVariantChange = (index: number, key: string, value: string) => {
    const updated = [...variants];
    updated[index].attributes[key] = value;
    setVariants(updated);
  };

  const handleFieldChange = (index: number, key: string, value: any) => {
    const updated = [...variants];
    updated[index][key] = value;
    setVariants(updated);
  };

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (const file of Array.from(files)) {
      formData.append("files", file);
    }

    const res = await fetch("/api/seller/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (data.success) {
      const updated = [...variants];
      updated[index].images.push(...data.urls);
      setVariants(updated);
      toast.success(`${data.urls.length} image(s) uploaded`);
    } else {
      toast.error("Image upload failed");
    }
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (const file of Array.from(files)) {
      formData.append("files", file);
    }

    const res = await fetch("/api/seller/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (data.success) {
      setProduct((prev) => ({...prev, mainImage: [...prev.mainImage, ...data.urls],}));
      toast.success(`${data.urls.length} image(s) uploaded`);
    } else {
      toast.error("Image upload failed");
    }
  };

  const handleSubmit = async () => {
   
    const res = await fetch("/api/seller/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...product, categoryId, variants }),
    });
    const data = await res.json();
    if (data.success) toast.success("Product saved successfully!");
    else toast.error(data.error || "Failed to save product");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Add New Product</h1>

      {/* Basic Product Info */}
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Title</Label>
              <Input
                value={product.title}
                onChange={(e) => setProduct({ ...product, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Brand</Label>
              <Input
                value={product.brand}
                onChange={(e) => setProduct({ ...product, brand: e.target.value })}
              />
            </div>
            <div>
              <Label>Base Price</Label>
              <Input
                type="number"
                value={product.basePrice}
                onChange={(e) => setProduct({ ...product, basePrice: e.target.value })}
              />
            </div>
            <div>
              <Label>Category</Label>
              <select className="border p-2 rounded w-full" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.cat_name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
            />
          </div>
          <div>
            <Label>Upload Images</Label>
            <Input
              type="file"
              multiple
              onChange={(e) => handleMainImageUpload(e)}
              accept="image/*"
            />
            <div className="flex gap-2 mt-2 flex-wrap">

              {product.mainImage.map((img: string, idx: number) => (
                    <img
                      key={idx}
                      src={img}
                      alt="variant-img"
                      className="w-20 h-20 object-cover rounded border"
                      width={100}
                      height={100}
                    />
                  ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Variant Section */}
      {categoryId && (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Variants</h2>
            <Button onClick={addVariant}>+ Add Variant</Button>
          </div>

          {variants.map((variant, i) => (
            <Card key={i} className="p-4 mt-3 space-y-3">
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(myattributes).map(([attrName, attrValue]: any, idx) => (
                  <div key={idx}>
                    <Label>{attrName}</Label>
                    {attrValue.type === "text" && (
                      <Input
                        type="text"
                        placeholder={`Enter ${attrName}`}
                        value={variant.attributes[attrName] || ""}
                        //onChange={(e) => handleChange(attrName, e.target.value)}
                        onChange={(e) => handleVariantChange(i, attrName, e.target.value)}
                      />
                    )}
                    {attrValue.type === "number" && (
                      <Input
                        type="number"
                        placeholder={`Enter ${attrName}`}
                        value={variant.attributes[attrName] || ""}
                        onChange={(e) => handleVariantChange(i,attrName, e.target.value)}
                      />
                   )}

                   {attrValue.type === "select" && (
                    <Select onValueChange={(val) => handleVariantChange(i,attrName, val)} value={variant.attributes[attrName] || ""} >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${attrName}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {attrValue.options?.map((opt: string, idx: number) => (
                          <SelectItem key={idx} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                   )}
                  </div>
                  ))
                }
                 
                
                <div>
                  <Label>Stock</Label>
                  <Input
                    type="number"
                    value={variant.stock}
                    onChange={(e) => handleFieldChange(i, "stock", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Price</Label>
                  <Input
                    type="number"
                    value={variant.price}
                    onChange={(e) => handleFieldChange(i, "price", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Delivery Charge</Label>
                  <Input
                    type="number"
                    value={variant.deliveryCharge}
                    onChange={(e) => handleFieldChange(i, "deliveryCharge", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Original Price</Label>
                  <Input
                    type="number"
                    value={variant.originalPrice}
                    onChange={(e) => handleFieldChange(i, "originalPrice", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Discount (%)</Label>
                  <Input
                    type="number"
                    value={variant.discount}
                    min={0}
                    max={100}
                    step={0.01}
                    onChange={(e) => handleFieldChange(i, "discount", e.target.value)}
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <Label>Upload Images</Label>
                <Input
                  type="file"
                  multiple
                  onChange={(e) => handleImageUpload(i, e)}
                  accept="image/*"
                />
                <div className="flex gap-2 mt-2 flex-wrap">
                  {variant.images.map((img: string, idx: number) => (
                    <img
                      key={idx}
                      src={img}
                      alt="variant-img"
                      className="w-20 h-20 object-cover rounded border"
                    />
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </>
      )}

      <div className="flex justify-end">
        <Button onClick={handleSubmit}>Save Product</Button>
      </div>
    </div>
  );
}