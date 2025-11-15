"use client"
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";

interface menuItemType{
  title: string;
  url: string;
  icon?:Icon;
}

export function NavMain({items,menu_name}: {items:menuItemType[], menu_name: string}) {
  const pathname=usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Menu Name"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <span>{menu_name}</span>
            </SidebarMenuButton>
            
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title} >
              {
                pathname.startsWith(item.url) || pathname === item.url ?
                <SidebarMenuButton  tooltip={item.title} variant={"primary"} isActive={true}>
                    <Link href={item.url}>
                      <div className="flex">
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </div>
                    </Link>
                </SidebarMenuButton>
                :
                <SidebarMenuButton  tooltip={item.title}>
                    <Link href={item.url}>
                      <div className="flex">
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </div>
                    </Link>
                </SidebarMenuButton>
              }
              
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
