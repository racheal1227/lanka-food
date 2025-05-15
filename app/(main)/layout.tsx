import FloatingContact from '@/components/FloatingContact'
import MainNavigation from '@/components/navigation'

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <MainNavigation />
      <div className="flex-grow flex flex-col overflow-y-auto pb-16 md:pb-0">
        <main className="flex-grow flex flex-col items-center w-full p-5 pt-5 md:pt-20 pb-5">{children}</main>
        {/* <FloatingContact contactUrl="https://example.com/contact" /> */}
        <footer className="w-full flex items-center justify-center border-t text-center text-xs gap-8 py-8">
          <p>TODO: Footer</p>
        </footer>
      </div>
    </>
  )
}
