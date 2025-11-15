"use client";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [form, setForm] = useState({ token: "", password: "", confirmPassword: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setMessage("Updating your password...");
    try {
      const res = await fetch("/api/common/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token); // store JWT
        setMessage("✅ Password Changed successful! Redirecting to sign in page...");
        setTimeout(() => {
          router.push("/signin"); 
        }, 2000); 
      } else {
        setMessage("❌ " + data.message);
        setTimeout(() => {
          router.push("/signin"); 
        }, 2000); 
      }
    } catch (error) {
      throw new Error("Error updateing password", error.toString());
    }
    
  };

  return (
    <>
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="flex flex-col gap-6">
            <Card className="w-[500]">
              <CardHeader>
                <CardTitle className="text-center text-xl">Update your passowrd</CardTitle>
                <CardDescription>
                  Enter a new password to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-3">
                        <Label htmlFor="token">
                            Token <span className="text-error-500">*</span>{" "}
                        </Label>
                        <Input placeholder="xxxx" id="token" type="text" name="token" value={form.token} onChange={handleChange} required/>
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="password">
                            Enter New Password <span className="text-error-500">*</span>{" "}
                        </Label>
                        
                        <Input
                        type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange}
                        placeholder="Enter new password"
                        />
                        <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        >
                        </span>
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="confirmPassword">
                        Confirm New Password <span className="text-error-500">*</span>{" "}
                        </Label>
                        <Input
                            type={showPassword2 ? "text" : "password"} name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
                            placeholder="Confirm new password"
                        />
                        <span
                            onClick={() => setShowPassword2(!showPassword2)}
                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        >
                        </span>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      <Button type="submit" onClick={handleSubmit} className="w-full">
                        Update Password
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 text-center text-sm">
                    Don't want to change password ? 
                    <Link href={"/"} className="underline underline-offset-4">
                      Login
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
     </>
  );
}
