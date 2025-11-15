"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import ProfileSidebar from "@/components/customer/ProfileSidebar";
import OrdersTab  from "@/components/customer/OrdersTab";
import WishlistTab from "@/components/customer/WishlistTab";
import AddressTab from "@/components/customer/AddressTab";
import AccountTab from "@/components/customer/AccountTab";
import BasicInfo from "@/components/customer/BasicInfo";
import Wallet from "@/components/customer/WalletTab";
import { redirect } from "next/navigation";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("basicinfo");
  const { data: session } = useSession();
  const userId= session?.user?.id;
  if(!session) return null;
  return (
    <div className="max-w-full mx-auto px-4 md:px-8 py-10">
      <div className="grid grid-cols-12 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="col-span-1">
          <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Main Content */}
        <div className="col-span-3 bg-white p-6 rounded-xl shadow-md">
          
          {activeTab === "basicinfo" && <BasicInfo user_id={userId}/>}
          {activeTab === "orders" && <OrdersTab user_id={userId}/>}
          {activeTab === "wallet" && <Wallet user_id={userId} />}
          {activeTab === "wishlist" && <WishlistTab user_id={userId}/>}
          {activeTab === "addresses" && <AddressTab user_id={userId} />}
          {activeTab === "account" && <AccountTab />}
        </div>
      </div>
    </div>
  );
}