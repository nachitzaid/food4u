import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import '@/styles/globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#e63946',
};

export const metadata: Metadata = {
  title: 'Food4U - Fast & Fresh',
  description: 'Fast, craveable food delivered hot. Burgers, chicken, fries, and combos made fresh.',
  keywords: 'fast food, burgers, chicken, fries, combos, delivery, online ordering',
  openGraph: {
    title: 'Food4U - Fast & Fresh',
    description: 'Fast, craveable food delivered hot.',
    type: 'website',
  },
}

import { AuthProvider } from '@/context/auth-context'
import { CartProvider } from '@/context/cart-context'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <AuthProvider>
          <CartProvider>
            {children}
            <Analytics />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
