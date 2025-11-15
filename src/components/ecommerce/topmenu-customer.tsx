"use client";
import { Book, Menu, Sunset, Trees, Zap } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MenuItem {
  cat_name: string;
  slug: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface Navbar1Props {
  menu?: MenuItem[];
}

const Navbar1 = () => {
    const [menu, setMenu] = useState<MenuItem[]>(null);

    useEffect(() => {
       const fetchMenu = async () => {
         try {
           const response = await fetch("/api/common/menu");
           const data = await response.json();
           setMenu(data.data);
         } catch (error) {
           console.error("Error fetching menu:", error);
         }
       }
       fetchMenu(); 
    },[]);
  return (
    <section className="place-content-center">
        <div className="container w-full place-content-center">
        {/* Desktop Menu */}
        <nav className="hidden justify-between lg:flex place-content-center">
            <div className="flex items-center gap-6">
            <div className="flex items-center">
                <NavigationMenu>
                <NavigationMenuList>
                    {menu && menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
                </NavigationMenu>
            </div>
            </div>
        </nav>
        {/* Mobile Menu */}
        <div className="block lg:hidden">
            <div className="flex items-center justify-between">
            <Sheet>
                <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                    <Menu className="size-4" />
                </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                <div className="flex flex-col gap-6 p-4">
                    <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                    >
                    {menu && menu.map((item) => renderMobileMenuItem(item))}
                    </Accordion>
                </div>
                </SheetContent>
            </Sheet>
            </div>
        </div>
        </div>
    </section>
    );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.cat_name}>
        <NavigationMenuTrigger>{item.cat_name}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items && item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.cat_name} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.cat_name}>
      <NavigationMenuLink
        href={"/" + item.slug}
        className="bg-background hover:bg-muted hover:text-accent-foreground group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
      >
        {item.cat_name}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.cat_name} value={item.cat_name} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.cat_name}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.cat_name} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.cat_name} href={"/" + item.slug} className="text-md font-semibold">
      {item.cat_name}
    </a>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <a
      className="hover:bg-muted hover:text-accent-foreground flex min-w-80 select-none flex-row gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors"
      href={"/" + item.slug}
    >
      <div className="text-foreground">{item?.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.cat_name}</div>
      </div>
    </a>
  );
};

export { Navbar1 };
