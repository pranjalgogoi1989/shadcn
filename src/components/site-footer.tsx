import React from 'react'
//import {useState, useEffect} from 'react';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
//import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

const SiteFooter = () => {
    const { data: session } = useSession();
  const subscribe = (e) => {
      e.preventDefault();
      toast.success("You have successfully subscribed to our newsletter.");
      console.log("Subscribed!");
  };
  if (session && session?.user?.role !== "user") return null;
  return (
    <footer className="bg-gray-900 text-white">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-1">
                    <h3 className="text-xl font-bold mb-4">{process.env.NEXT_PUBLIC_APP_NAME}</h3>
                    <p className="text-gray-400 mb-4">We provide high-quality products at competitive prices with excellent customer service.</p>
                    <div className="flex space-x-4">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                            <Image src="/icons/facebook.png" alt="Facebook" width={24} height={24} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                            <Image src="/icons/twitter.png" alt="Twitter" width={24} height={24} />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                            <Image src="/icons/instagram.png" alt="Instagram" width={24} height={24} />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
                            <Image src="/icons/linkedin.png" alt="LinkedIn" width={24} height={24} />
                        </a>
                    </div>
                </div>
                <div className="col-span-1">
                    <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                        <li><Link className="text-gray-400 hover:text-white transition-colors" href="/">Home</Link></li>
                        <li><Link className="text-gray-400 hover:text-white transition-colors" href="/products">Products</Link></li>
                        <li><Link className="text-gray-400 hover:text-white transition-colors" href="/categories">Categories</Link></li>
                        <li><Link className="text-gray-400 hover:text-white transition-colors" href="/about">About Us</Link></li>
                        <li><Link className="text-gray-400 hover:text-white transition-colors" href="/contact">Contact</Link></li>
                    </ul>
                </div>
                <div className="col-span-1">
                    <h3 className="text-xl font-bold mb-4">Customer Service</h3>
                    <ul className="space-y-2">
                        <li><Link className="text-gray-400 hover:text-white transition-colors" href="/faq">FAQ</Link></li>
                        <li><Link className="text-gray-400 hover:text-white transition-colors" href="/shipping">Shipping &amp; Returns</Link></li>
                        <li><Link className="text-gray-400 hover:text-white transition-colors" href="/terms">Terms &amp; Conditions</Link></li>
                        <li><Link className="text-gray-400 hover:text-white transition-colors" href="/privacy">Privacy Policy</Link></li>
                    </ul>
                </div>
                <div className="col-span-1">
                    <h3 className="text-xl font-bold mb-4">Newsletter</h3>
                    <p className="text-gray-400 mb-4">Subscribe to our newsletter for updates and promotions.</p>
                    <form className="flex flex-col sm:flex-row gap-2" onSubmit={subscribe}>
                        <Input type="email" name='subscription_email' placeholder="Your email" className="px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        <Button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">Subscribe</Button>
                    </form>
                </div>
            </div>
            <div className="border-t border-gray-800 mt-4 pt-3 flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-400 text-sm">© 2025 {process.env.NEXT_PUBLIC_APP_NAME} . All rights reserved.</p>
                <div className="mt-0">
                    <ul className="flex space-x-6">
                        <li><Link className="text-gray-400 hover:text-white text-sm transition-colors" href="/terms">Terms</Link></li>
                        <li><Link className="text-gray-400 hover:text-white text-sm transition-colors" href="/privacy">Privacy</Link></li>
                        <li><Link className="text-gray-400 hover:text-white text-sm transition-colors" href="/cookies">Cookies</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    </footer>
  )
}

export default SiteFooter;