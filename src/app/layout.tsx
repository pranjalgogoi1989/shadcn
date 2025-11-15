"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/lib/CartContext";
import { WishlistProvider } from "@/lib/WishlistContext";
import "./globals.css";
import { SessionProvider, useSession } from "next-auth/react";
import { Navbar1 } from "@/components/ecommerce/topmenu-customer";
import SearchBar from "@/components/ecommerce/SearchBar";
//import { headers } from "next/headers";
import { usePathname } from "next/navigation";
import SiteFooter from "@/components/site-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({  children,}: Readonly<{  children: React.ReactNode;}>) {
  const pathname = usePathname();
  const hideByRoute = pathname.startsWith("/seller") || pathname.startsWith("/users/admin");

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <WishlistProvider>
            <CartProvider>
              <SearchBar /> 
                {!hideByRoute && <Navbar1 />}
                
                {children}
                <SiteFooter />
            </CartProvider>
          </WishlistProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
