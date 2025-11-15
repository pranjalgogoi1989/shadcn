import { Spinner } from "@/components/ui/shadcn-io/spinner";

import React from 'react'

const LoadingPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
        <Spinner variant={"ring"} size={64} />
        <span className="font-mono text-muted-foreground text-xs">
          Loading...
        </span>
      </div>
  )
}

export default LoadingPage
