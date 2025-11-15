"use client";
import { Outfit } from 'next/font/google';
import React from 'react';
import { SessionProvider } from "next-auth/react";
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SiteHeader } from '@/components/site-header';
import { AppSidebar } from './sidebar';
import { Toaster } from "@/components/ui/sonner"
const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className={`${outfit.className} dark:bg-gray-900`}>
        <SessionProvider> 
          <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
            <AppSidebar variant="inset" />
            <SidebarInset>
              <SiteHeader />
              {children}
              <Toaster />
            </SidebarInset>
          </SidebarProvider>
            
        </SessionProvider>
      </div>
  );
}
