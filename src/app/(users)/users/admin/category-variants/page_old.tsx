"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { PlusCircle, Trash2 } from "lucide-react";

export default function CategoryVariantPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [variants, setVariants] = useState<any[]>([
    { name: "", values: [""] },
  ]);

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.data || []);
    }
    fetchCategories();
  }, []);

  const handleAddVariant = () => {
    setVariants([...variants, { name: "", values: [""] }]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, field: string, value: string) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const handleAddValue = (index: number) => {
    const newVariants = [...variants];
    newVariants[index].values.push("");
    setVariants(newVariants);
  };

  const handleValueChange = (vIndex: number, valIndex: number, value: string) => {
    const newVariants = [...variants];
    newVariants[vIndex].values[valIndex] = value;
    setVariants(newVariants);
  };

  const handleSave = async () => {
    const res = await fetch("/api/category-variants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: selectedCategory,
        variants: variants
            .filter(v => v.name.trim()) // ✅ remove empties
            .map(v => ({
            name: v.name.trim(),
            })),
        }),
    });
    
    const data = await res.json();
    if (data.success) alert("Variants saved successfully!");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Category Variant Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category Selector */}
          <div className="space-y-2 w-[100%]">
            <Label>Select Category</Label>
            <Select onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent className="w-[100%]">
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id }>
                    {cat.cat_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Variants Section */}
          <div className="space-y-6">
            {variants.map((variant, vIndex) => (
              <div key={vIndex} className="border p-4 rounded-lg bg-muted/30 relative">
                <Button variant="outline" onClick={() => handleRemoveVariant(vIndex)} className="absolute top-3 right-3 text-red-500"> <Trash2 size={18} /></Button>

                <div className="space-y-3">
                  <div>
                    <Label>Variant Name</Label>
                    <Input
                      value={variant.name}
                      onChange={(e) =>
                        handleVariantChange(vIndex, "name", e.target.value)
                      }
                      placeholder="e.g. Color, Size"
                    />
                  </div>
                  
                </div>
              </div>
            ))}

            <Button onClick={handleAddVariant} variant="outline">
              <PlusCircle size={18} className="mr-2" /> Add Variant Type
            </Button>
          </div>

          <div className="text-right">
            <Button onClick={handleSave}>Save Variants</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}