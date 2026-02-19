import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import '@/styles/globals.css'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ["latin"]
});
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ["latin"]
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#5C3D2E',
};

export const metadata: Metadata = {
  title: 'Food4U - Premium Restaurant Ordering',
  description: 'Professional restaurant ordering system for modern dining experiences',
  keywords: 'restaurant, ordering, food delivery, online ordering',
  openGraph: {
    title: 'Food4U - Premium Restaurant Ordering',
    description: 'Professional restaurant ordering system for modern dining',
    type: 'website',
  },
}

import { AuthProvider } from '@/context/auth-context'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
