"use client";
import BestDeals from "@/components/ecommerce/best-deals";
import Carousal_Banner from "@/components/ecommerce/carousal";
import BestSelling from "@/components/ecommerce/BestSelling";
export default function Home() {
  
  return (
      <div className="flex min-h-svh w-full items-center justify-center">
        <div className="w-full">

          <Carousal_Banner/>
          <BestDeals />
          <BestSelling />
        </div>
      </div>
  );
}
