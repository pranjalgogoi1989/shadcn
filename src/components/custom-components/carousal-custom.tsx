"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

interface CarouselItem {
  id: number
  image: string
  title?: string
  description?: string
}

interface CarouselProps {
  items: CarouselItem[]
  autoPlay?: boolean
  interval?: number
}

export default function Carousel({
  items = [],
  autoPlay = true,
  interval = 4000,
}: CarouselProps) {
  const [index, setIndex] = useState(0)

  // ✅ Prevent error if items is empty
  const hasItems = items && items.length > 0

  useEffect(() => {
    if (!autoPlay || !hasItems) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length)
    }, interval)
    return () => clearInterval(timer)
  }, [items.length, autoPlay, interval, hasItems])

  const nextSlide = () => hasItems && setIndex((prev) => (prev + 1) % items.length)
  const prevSlide = () => hasItems && setIndex((prev) => (prev - 1 + items.length) % items.length)

  if (!hasItems) {
    return (
      <div className="w-full h-[90vh] flex items-center justify-center bg-gray-100 text-gray-500">
        No slides available
      </div>
    )
  }

  const currentItem = items[index]

  return (
    <div className="relative w-full h-[90vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <Image
            src={currentItem.image}
            alt={currentItem.title || "Slide image"}
            fill
            className="object-cover rounded-lg"
            priority
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-12 text-white">
            {currentItem.title && (
              <h2 className="text-4xl md:text-6xl font-bold mb-3">
                {currentItem.title}
              </h2>
            )}
            {currentItem.description && (
              <p className="text-lg md:text-xl max-w-2xl">{currentItem.description}</p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-5 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-5 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white"
        onClick={nextSlide}
      >
        <ChevronRight className="h-8 w-8" />
      </Button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              i === index ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  )
}