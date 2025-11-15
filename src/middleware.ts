import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";


export async function middleware(request: NextRequest){

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  const path=request.nextUrl.pathname;
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  const now = new Date();
  //console.log("serverTime: "+now.toISOString());

  const userRole =  token?.role;
  //console.log("Path is : "+path);
  if(token && path.startsWith("/users/admin") && userRole!=="admin"){
    console.log("admin checked");
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }else if(token && path.startsWith("/users/user") && userRole!=="user"){
    console.log("user checked");
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }
  //console.log("middleware checked");
  return NextResponse.next();
}
export const config = {
  matcher: ["/users/admin/:path*","/users/user/:path*"],
};