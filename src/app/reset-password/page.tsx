"use client"
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
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function Page() {
  const [form, setForm] = useState({ email: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("Requesting password reset token...");
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("✅ Password reset token sent to your email! Redirecting to set new password page...");
        setTimeout(() => {
          router.push("/update-password"); 
        }, 3000); 
      } else {
        setMessage((data.message || "Something went wrong"));
      }
    } catch (error) {
      setMessage("Error requesting password reset token");
    }
  };
  return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-xl">Recover your Account</CardTitle>
                <CardDescription>
                  Enter your email below to get a link to reset your password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        onChange={handleChange}
                        placeholder="m@example.com"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <Button type="submit" onClick={handleSubmit} className="w-full">
                        Request Password Reset Token
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 text-center text-sm">
                    Remember your password ? 
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
  );
}
