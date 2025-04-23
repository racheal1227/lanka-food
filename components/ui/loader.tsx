import { Loader2 } from 'lucide-react'

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[200px]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
    </div>
  )
}
