"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const {data: session } = useSession();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };
  const logo = {
    url: process.env.NEXT_PUBLIC_APP_URL,
    src: process.env.NEXT_PUBLIC_LOGO,
    alt: "logo",
    title: process.env.NEXT_PUBLIC_APP_NAME,
  };
  

  return (
    <div className="flex w-full min-w-full place-content-between">
        <div className="p-3 place-content-start w-1/4">
            <a href={logo.url} className="flex items-center gap-2">
                <Image src={logo.src} className="max-h-8 dark:invert" width={40} height={40} alt={logo.alt} />
                <span className="text-lg font-semibold tracking-tighter">{logo.title}</span>
            </a>
        </div>
        <div className="p-2 w-1/2">
            {(session?.user?.role === "user" || !session) && (
                <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-lg mx-auto">
                    <Input type="text" className="w-full" placeholder="Search for Products..." value={query} onChange={(e) => setQuery(e.target.value)} />
                    <Button type="submit"><Search className="mr-2 h-4 w-4" /> Search </Button>
                </form>
            )}
            
        </div>
        <div className="w-1/4">
            <div className="absolute right-0 p-2 ">
                {(session?.user?.role === "user") && (
                    <>
                        <Button asChild variant={"default"}>
                            <a href="/cart">My Cart</a>
                        </Button>
                        <Button asChild variant={"outline"}>
                            <a href="/seller-request">Become a Seller</a>
                        </Button>
                        <Button asChild variant={"default"}>
                            <a href="/profile">Profile</a>
                        </Button>
                    </>
                )}

                {session ?(
                    <Button asChild variant={"destructive"}>
                        <a href={"/api/auth/signout"}>Logout</a>
                    </Button>
                ):(
                    <>
                    <Button asChild variant={"default"}>
                        <a href="/signin">Sign In</a>
                    </Button>
                    <Button asChild variant={"destructive"}>
                        <a href="/signup">Sign Up</a>
                    </Button>
                    </>
                )
                }
                
                
                
            </div>
        </div>
    </div>
  );
}