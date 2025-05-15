import FloatingContact from '@/components/FloatingContact'
import MainNavigation from '@/components/navigation'

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <MainNavigation />
      <main className="flex-grow flex flex-col items-center p-5 pt-20">{children}</main>
      <FloatingContact contactUrl="https://example.com/contact" />
      <footer className="w-full flex items-center justify-center border-t text-center text-xs gap-8 py-8">
        <p>TODO: Footer</p>
      </footer>
    </>
  )
}
