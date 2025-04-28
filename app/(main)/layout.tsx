import MainNavigation from '@/components/navigation'

export default function layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <MainNavigation />
      <main className="flex-grow flex flex-col items-center p-5 pt-20">{children}</main>
      <footer className="w-full flex items-center justify-center border-t text-center text-xs gap-8 py-8">
        <p>TODO: Footer</p>
      </footer>
    </>
  )
}
