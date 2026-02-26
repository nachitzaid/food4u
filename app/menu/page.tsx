import { Suspense } from 'react'
import MenuClient from './menu-client'

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <MenuClient />
    </Suspense>
  )
}
