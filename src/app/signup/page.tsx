"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent, 
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import  Link  from "next/link";
import { toast } from "sonner";
//import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";


export default function SignUp() {
  //const router = useRouter();
  const [signup, setSignup] = useState({ cname: "", email: "", password: ""})
  const [loading, setLoading] = useState(false);
  const handleCHange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignup({ ...signup, [e.target.name]: e.target.value });
  };

  const handleSignUp = async(e) => {
    e.preventDefault();
    setLoading(true);
    const submitForm = await fetch("/api/common/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signup),
    });
    const data = await submitForm.json();
    setLoading(false);
    toast.success(data.message);
    redirect("/signin");
  }

  return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-xl">SignUp</CardTitle>
                <CardDescription>
                  Enter your details below to create your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp}>
                  <div className="flex flex-col gap-6">
                      <div className="grid gap-3">
                          <Label htmlFor="cname">Name</Label>
                          <Input
                          id="cname"
                          type="text"
                          placeholder="John Doe"
                          name="cname"
                          onChange={handleCHange}
                          value={signup.cname}
                          required
                          />
                      </div>
                      <div className="grid gap-3">
                          <Label htmlFor="email">Email</Label>
                          <Input
                          id="email"
                          type="email"
                          placeholder="m@example.com"
                          name="email"
                          onChange={handleCHange}
                          value={signup.email}
                          required
                          />
                      </div>
                    <div className="grid gap-3">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                      </div>
                      <Input id="password" type="password" placeholder="password" name="password" onChange={handleCHange} value={signup.password} required />
                    </div>
                    <div className="flex flex-col gap-3">
                      <Button type="submit" variant="default" disabled={loading}  className="w-full">
                        {loading ? "Please wait..." : "SignUp"}
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 text-center text-sm">
                    Already have an account?
                    <Link href="/signin" className="underline underline-offset-4">
                      Login
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
}
