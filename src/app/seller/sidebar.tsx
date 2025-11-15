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
import { NavMain } from "@/components/nav-main"
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
import { User } from "lucide-react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const app_name=process.env.NEXT_PUBLIC_APP_NAME;
  
  const { data: session } = useSession();
  if(!session) return null;
  const path_props="/seller";
  const data = {
  user: {
    name: session?.user?.name || "Anonymouse",
    email: session?.user?.email || "test@example.com",
    avatar: session?.user?.image || "/images/user/owner.jpg",
    role: session?.user?.role || "User",
  },
  navMain: [
    { title: "Dashboard", url: path_props, icon: IconDashboard, },
    { title:"Brands", url: path_props+"/brands", icon: IconDashboard, },
    { title: "Products", url: path_props+"/products", icon: IconChartBar, },
    { title: "Orders", url: path_props+"/orders", icon: IconChartBar, },
    { title: "Returns", url: path_props+"/returns", icon: IconChartBar, },
    { title: "Refunds", url: path_props+"/refunds", icon: IconChartBar, },
    { title: "Profile", url: path_props+"/profile", icon: User, },
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
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
