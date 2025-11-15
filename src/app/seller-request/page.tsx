"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export default function BecomeSellerPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    business_name: "",
    business_email: "",
    business_phone: "",
    business_address: "",
    description: "",
    gst: "",
  });
  const {data:session} = useSession();
  const [loading, setLoading] = useState(false);
  const user_id = session?.user?.id;
  
  useEffect(() => {
    async function checkAllreadySubmitted(){
        const result = await fetch("/api/seller/requests/" + user_id);
        const data = await result.json();
        if(data.status === 200 && data.data != null){
          setSubmitted(true);
        }
    };
    if(user_id!==undefined){
      checkAllreadySubmitted();
    }
  }, [user_id]);

  if(!session) {
    return (
      <div className="max-w-2xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4">Become a seller</h1>
        <p className="mb-4">You must be logged in to submit a request.</p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/seller/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.status === 200) {
        toast.success("Request submitted successfully!");
        setForm({
          business_name: "",
          business_email: "",
          business_phone: "",
          business_address: "",
          description: "",
          gst: "",
        });
      } else {
        toast.error(data.message || "Failed to submit request");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  if(submitted){
    return (
      <div className="max-w-2xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">You have already submitted a request</h1>
      </div>
    );
  }
  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Become a Seller</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow-lg p-6 rounded-2xl">
        <Input
          name="business_name"
          placeholder="Business Name"
          value={form.business_name}
          onChange={handleChange}
          required
        />
        <Input
          name="business_email"
          type="email"
          placeholder="Business Email"
          value={form.business_email}
          onChange={handleChange}
          required
        />
        <Input
          name="business_phone"
          placeholder="Business Phone"
          value={form.business_phone}
          onChange={handleChange}
          required
        />
        <Input
          name="business_address"
          placeholder="Business Address"
          value={form.business_address}
          onChange={handleChange}
          required
        />
        <Textarea
          name="description"
          placeholder="Tell us about your business..."
          value={form.description}
          onChange={handleChange}
        />
        <Input
          name="gst"
          placeholder="GST Number"
          value={form.gst}
          onChange={handleChange}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Submitting..." : "Submit Request"}
        </Button>
      </form>
    </div>
  );
}