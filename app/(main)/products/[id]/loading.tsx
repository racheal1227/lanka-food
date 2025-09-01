import { Skeleton } from '@/components/ui/skeleton'

const THUMB_SKELETON_KEYS = ['thumb-a', 'thumb-b', 'thumb-c', 'thumb-d', 'thumb-e']
const ROW_SKELETON_KEYS = [
  'row-origin',
  'row-weight',
  'row-brand',
  'row-grade',
  'row-package',
  'row-ingredients',
  'row-shelfLife',
  'row-storage',
  'row-certifications',
]

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="aspect-square w-full mb-3">
            <Skeleton className="w-full h-full" />
          </div>
          <div className="flex gap-2">
            {THUMB_SKELETON_KEYS.map((key) => (
              <Skeleton key={key} className="w-16 h-16 rounded-md" />
            ))}
          </div>
        </div>
        <div>
          <Skeleton className="h-8 w-2/3 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-6" />
          <div className="space-y-3">
            {ROW_SKELETON_KEYS.map((key) => (
              <div key={key} className="grid grid-cols-3 gap-4 items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 col-span-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
