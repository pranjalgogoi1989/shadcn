"use client";
import { Outfit } from 'next/font/google';
import React from 'react';
import { SessionProvider } from "next-auth/react";
const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    
      <div className={`${outfit.className} dark:bg-gray-900`}>
        <SessionProvider> 
            {children}
        </SessionProvider>
      </div>
  );
}
