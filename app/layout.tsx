import '@/app/globals.css'

import { Geist } from 'next/font/google'

import Providers from '@/app/providers'

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
      <body className="bg-background text-foreground h-screen overflow-x-hidden" suppressHydrationWarning>
        <Providers>
          <div className="flex flex-col h-screen">{children}</div>
        </Providers>
      </body>
    </html>
  )
}
