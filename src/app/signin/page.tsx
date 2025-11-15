"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card , CardDescription, CardHeader,CardTitle, CardFooter, CardContent} from "@/components/ui/card";
import Link from "next/link";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("anjanbaruah97@gmail.com");
  const [password, setPassword] = useState("123456");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      
      if (!res.error) {
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        localStorage.setItem("token", session.token);
        setMessage("✅ Login successful! Redirecting to users page...");
        setTimeout(() => {
          router.push("/users");
        }, 1200);
      } else {
        setMessage("❌ " + (res.error || "Invalid credentials"));
      }
    } catch (error) {
      setMessage("❌"+error+" Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-xl">Login to your account</CardTitle>
                <CardDescription>
                  Enter your email below to login to your account
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
                        onChange={(e)=>setEmail(e.target.value)}
                        placeholder="m@example.com"
                        defaultValue={email}
                        required
                      />
                    </div>
                    <div className="grid gap-3">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <a
                          href="/reset-password"
                          className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                        >
                          Forgot your password?
                        </a>
                      </div>
                      <Input id="password" type="password" 
                      onChange={(e) => setPassword(e.target.value)}
                      defaultValue={password}
                      required />
                    </div>
                    <div className="flex flex-col gap-3">
                      <Button type="submit" onClick={handleSubmit} disabled={loading}  className="w-full pointer">
                        {loading ? "Logging in..." : "Login"}
                      </Button>
                    </div>
                  </div>
                </form> 
                 <div className="flex flex-col gap-6 mt-5">
                    <div className="flex flex-col gap-3">
                      <Button variant="outline"
                      onClick={() => signIn("google", { callbackUrl: "/users" })}
                      className="w-full">
                        Login with Google
                      </Button>
                      <Button variant="outline"
                      onClick={() => signIn("github", { callbackUrl: "/users" })}
                      className="w-full">
                        Login with Github
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href={"/signup"} className="underline underline-offset-4">
                      Sign up
                    </Link>
                  </div>
                
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
}
