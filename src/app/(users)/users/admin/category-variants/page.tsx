"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

export default function CategoryVariantPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categoryName, setCategoryName] = useState<string>("");
  const [fields, setFields] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 🟢 Fetch all categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();
        if (data.status ===200) setCategories(data.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCategories();
  }, []);

  // 🟢 Fetch variant fields for selected category
  useEffect(() => {
    async function fetchVariants() {
      if (!selectedCategory) return;
      try {
        const res = await fetch(`/api/admin/category-variants?categoryId=${selectedCategory}`);
        const data = await res.json();
        if (data.success && data.data) {
          setFields(data.data.variantFields);
          setCategoryName(data.data.categoryName);
        } else {
          setFields([]);
          setCategoryName(categories.find((c) => c._id === selectedCategory)?.cat_name || "");
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchVariants();
  }, [selectedCategory]);

  // 🟡 Handle field changes
  const handleFieldChange = (index: number, key: string, value: string) => {
    const updated = [...fields];
    updated[index][key] = value;
    setFields(updated);
  };

  const handleOptionChange = (index: number, options: string) => {
    const updated = [...fields];
    updated[index].options = options.split(",").map((opt) => opt.trim());
    setFields(updated);
  };

  // ➕ Add a new field
  const addField = () => {
    setFields([...fields, { name: "", type: "text", options: [] }]);
  };

  // ❌ Remove a field
  const removeField = (index: number) => {
    const updated = [...fields];
    updated.splice(index, 1);
    setFields(updated);
  };

  // 💾 Save or update
  const handleSave = async () => {
    if (!selectedCategory) {
      toast.error("Please select a category first");
      return;
    }
    setLoading(true);
    try {
      const category = categories.find((c) => c._id === selectedCategory);
      const res = await fetch("/api/admin/category-variants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: selectedCategory,
          categoryName: category?.cat_name || "",
          fields,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Category variant saved successfully");
      } else {
        toast.error(data.error || "Failed to save");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving variant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Category Variant Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* 🧩 Category Selector */}
          <div>
            <Label>Select Category</Label>
            <Select onValueChange={setSelectedCategory} value={selectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Choose category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.cat_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 🧱 Dynamic Field Editor */}
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={index} className="p-3 border rounded-lg bg-muted/30">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <Label>Field Name</Label>
                    <Input
                      value={field.name}
                      onChange={(e) => handleFieldChange(index, "name", e.target.value)}
                      placeholder="e.g. Color, Size, Fabric"
                    />
                  </div>

                  <div className="flex-1">
                    <Label>Type</Label>
                    <Select
                      value={field.type}
                      onValueChange={(val) => handleFieldChange(index, "type", val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="select">Select (Options)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeField(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {field.type === "select" && (
                  <div>
                    <Label>Options (comma separated)</Label>
                    <Input
                      placeholder="e.g. Red, Blue, Green"
                      value={field.options?.join(", ") || ""}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ➕ Add Field Button */}
          <Button variant="outline" onClick={addField}>
            <Plus className="w-4 h-4 mr-2" /> Add Field
          </Button>

          {/* 💾 Save */}
          <div className="pt-4">
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Variants"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}