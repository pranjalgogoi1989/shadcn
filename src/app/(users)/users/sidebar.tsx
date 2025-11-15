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
import { useState, useEffect } from "react"



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const app_name=process.env.NEXT_PUBLIC_APP_NAME;
  const { data: session } = useSession();
  if(!session) return null;
  const data = {
  user: {
    name: session?.user?.name || "Anonymouse",
    email: session?.user?.email || "test@example.com",
    avatar: session?.user?.image || "/images/user/owner.jpg",
    role: session?.user?.role || "User",
  },
  navMain: [
    { title: "Dashboard", url: "#", icon: IconDashboard, },
    { title: "Users", url: "/users/user", icon: IconListDetails, },
    { title: "Analytics", url: "#", icon: IconChartBar, },
    { title: "Projects",  url: "#", icon: IconFolder, },
    { title: "Team", url: "#", icon: IconUsers, },
  ],
  navClouds: [
    { title: "Design", url: "#", icon: IconDashboard, },
    { title: "Capture", icon: IconCamera, isActive: true, url: "#",
      items: [
        { title: "Active Proposals", url: "#", },
        { title: "Archived", url: "#", },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
}
  
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">{app_name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} menu_name="Main Menu"/>
        <NavMain items={data.navClouds} menu_name="Cloud Menu"/>
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
