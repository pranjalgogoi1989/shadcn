"use client";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent, 
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { redirect } from "next/navigation";

export default function Unauthorized() {
  return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-xl">Unauthorized</CardTitle>
                <CardDescription className="flex place-content-center">
                  You are not authorized to access this page.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex place-content-center">
                <Button onClick={()=> redirect('/users')}>Back to Dashboard</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
}
