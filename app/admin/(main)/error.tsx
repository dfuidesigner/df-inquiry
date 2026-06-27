"use client"

import { useEffect } from "react"
import { AlertTriangle, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-100 w-full flex-col items-center justify-center p-6">
      <div className="flex max-w-md flex-col items-center space-y-4 rounded-xl border bg-card p-8 text-center shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Something went wrong!
          </h2>
          <p className="text-sm text-muted-foreground">
            An unexpected error occurred while loading this page. Please try
            again.
          </p>
        </div>
        <Button
          onClick={() => unstable_retry()}
          variant="outline"
          className="mt-4 gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Try again
        </Button>
      </div>
    </div>
  )
}
