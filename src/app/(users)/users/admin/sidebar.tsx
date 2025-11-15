/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "next-auth/react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const app_name=process.env.NEXT_PUBLIC_APP_NAME;
  
  const { data: session } = useSession();
  if(!session) return null;
  const path_props="/users/admin";
  const data = {
  user: {
    name: session?.user?.name || "Anonymouse",
    email: session?.user?.email || "test@example.com",
    avatar: session?.user?.image || "/images/user/owner.jpg",
    role: session?.user?.role || "User",
  },
  navMain: [
    { title: "Dashboard", url: path_props, icon: IconDashboard, },
    { title: "List Users", url: path_props+"/list-user", icon: IconUsers, },
    { title: "Categories", url: path_props+"/categories", icon: IconChartBar, },
    { title: "Cat-Variants", url: path_props+"/category-variants", icon: IconChartBar, },
    { title: "Brands", url: path_props+"/brands", icon: IconChartBar, },
    { title: "Products", url: path_props+"/products", icon: IconChartBar, },
    { title: "Orders", url: path_props+"/orders", icon: IconChartBar, },
    { title: "Seller Req.", url: path_props+"/seller-requests", icon: IconChartBar, },
    { title: "Delivery Partner", url: path_props+"/delivery-partner", icon: IconChartBar, },
  ],
  navDesign: [
    { title:"Carousel", url: path_props+"/carousel", icon: IconInnerShadowTop,},
    { title:"Logo", url: path_props+"/logo", icon: IconDashboard,},
  ],
  
}
  const logourl=process.env.NEXT_PUBLIC_LOGO;
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/users/admin">
                <Image src={logourl} alt="Logo" width={30} height={30} />
                <span className="text-base font-semibold">{app_name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} menu_name="Main Menu"/>
        <NavMain items={data.navDesign} menu_name="Web Components"/>
        
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
