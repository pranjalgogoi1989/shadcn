"use client";
import React from 'react';
import  Carousel  from '@/components/custom-components/carousal-custom';
import { useState, useEffect } from 'react';
import { ICarousel } from '@/models/Carousel';
import { set } from 'mongoose';
import { Spinner } from '@/components/ui/shadcn-io/spinner';


const Carousal_Banner = () => {
  const [slides, setSlides] = useState<ICarousel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCarousel = async()=>{
    const res = await fetch("/api/common/carousel");
    const data = await res.json();
    setSlides(data);
    setLoading(false);
  };

  useEffect(() => {

    fetchCarousel();

  }, []);

  return (
    <main className="w-full">
      {
        !loading ? (
          <Carousel items={slides} />
        ):(
          <div className="h-screen flex flex-col items-center justify-center gap-4">
            <Spinner variant={"ring"} size={64} />
            <span className="font-mono text-muted-foreground text-xs">
              Loading...
            </span>
          </div>
        )
      }
    </main>
  )
}

export default Carousal_Banner