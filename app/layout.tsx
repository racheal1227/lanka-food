import './globals.css'

import { Geist } from 'next/font/google'
import { ThemeProvider } from 'next-themes'

import MainNavigation from '@/components/navigation'

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Lanka Food',
  description: 'Lanka Food',
  keywords:
    'Lanka Food, Sri Lanka, Food, Sri Lankan Food, Sri Lankan Recipes, Sri Lankan Cuisine, Sri Lankan Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes, Sri Lankan Food Recipes',
}

const geistSans = Geist({
  display: 'swap',
  subsets: ['latin'],
})

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={geistSans.className} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="bg-background text-foreground min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <MainNavigation />
          <main className="flex flex-col items-center">
            <div className="flex flex-col gap-20 max-w-5xl p-5 mt-16">{children}</div>
            <footer className="w-full flex items-center justify-center border-t text-center text-xs gap-8 py-16">
              <p>TODO: Footer</p>
            </footer>
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
