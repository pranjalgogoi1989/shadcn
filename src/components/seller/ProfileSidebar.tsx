"use client";
import { User, Heart, MapPin, Settings, ClipboardList, List, ShipIcon, Home } from "lucide-react";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { buttonVariants } from "../ui/button";

export default function ProfileSidebar({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const { data: session } = useSession();
  if(!session) return null;
  const menu = [
    { id: "DashBoard", label: "DashBoard", icon: List },
    { id: "Products", label: "Products", icon: List },
    { id: "orders", label: "Orders", icon: ClipboardList },
    { id: "tracking", label: "Tracking", icon: ShipIcon },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex flex-col items-center border-b pb-4 mb-4">
        
        {session.user?.image ? (
           <Image
              src={session.user?.image}
              alt={session.user?.name}
              width={100}
              height={100}
              className="w-12 h-12 rounded-full"
            />
        ):(
          <User className="w-12 h-12 text-gray-500" />
        )}
        <h2 className="mt-2 font-semibold text-gray-800">{session.user?.name}</h2>
        <p className="text-sm text-gray-500">{session.user?.email}</p>
      </div>

      <ul className="space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center w-full gap-3 px-3 py-2 rounded-md text-sm font-medium transition
                ${
                  activeTab === item.id
                    ? buttonVariants({ variant: "default" })
                    : buttonVariants({ variant: "outline" })
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}