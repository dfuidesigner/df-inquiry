import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4 text-muted-foreground">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-12 w-12 animate-ping rounded-full bg-primary/20" />
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
      <p className="animate-pulse text-sm font-medium tracking-wide">
        Loading...
      </p>
    </div>
  )
}
