'use client';
import React from 'react'
import { redirect } from 'next/navigation';
import { useSession,} from "next-auth/react" 
import LoadingPage from '@/app/loading';

const Welcome_Authorized = () => {
  const {data:session} = useSession();
  if(session && session?.user?.role ==="admin") redirect("/users/admin");
  if(session && session?.user?.role ==="seller") redirect("/seller");
  if(session && session?.user?.role ==="user") redirect("/");
  

  return (
    <LoadingPage />
  );
}

export default Welcome_Authorized