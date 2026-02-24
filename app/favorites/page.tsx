'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Header } from '@/components/header'
import { useAuth } from '@/context/auth-context'
import { getMenuItemsByIds, getUserFavorites, toggleUserFavorite } from '@/services/firestore'
import { Heart } from 'lucide-react'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
}

export default function FavoritesPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setLoading(false)
        return
      }
      const favs = await getUserFavorites(user.uid)
      setFavorites(favs)
      const chunks: string[][] = []
      for (let i = 0; i < favs.length; i += 10) {
        chunks.push(favs.slice(i, i + 10))
      }
      const results: MenuItem[] = []
      for (const chunk of chunks) {
        const data = await getMenuItemsByIds(chunk)
        results.push(...(data as MenuItem[]))
      }
      setItems(results)
      setLoading(false)
    }
    load().catch(() => setLoading(false))
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_rgba(240,242,245,0.9)_45%,_rgba(230,233,236,1)_100%)] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center rounded-[2.5rem] bg-card/90 border border-border/60 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.4)] p-10"
        >
          <h1 className="font-serif text-3xl font-bold text-foreground mb-4">Please log in</h1>
          <p className="text-muted-foreground mb-8">Log in to see your favorites.</p>
          <Link
            href={`/auth/login?redirect=${encodeURIComponent('/favorites')}`}
            className="inline-block px-6 py-3 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary/90 transition"
          >
            Log in to continue
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_rgba(240,242,245,0.9)_45%,_rgba(230,233,236,1)_100%)]">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-[2.5rem] bg-card/90 border border-border/60 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.4)] p-6 lg:p-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Your Favorites</h1>
              <p className="text-muted-foreground">Saved meals you love.</p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 bg-muted/20 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 bg-background border border-border rounded-3xl">
              <h3 className="text-xl font-bold font-serif mb-2">No favorites yet</h3>
              <p className="text-muted-foreground mb-6">Tap the heart on a meal to save it here.</p>
              <Link href="/menu" className="text-primary font-bold hover:underline">
                Browse menu
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ translateY: -6 }}
                  className="group"
                >
                  <Link href={`/menu/${item.id}`}>
                    <div className="relative bg-background border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                      <button
                        type="button"
                        onClick={async (e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          const isFav = favorites.includes(item.id)
                          await toggleUserFavorite(user.uid, item.id, isFav)
                          const next = isFav ? favorites.filter((id) => id !== item.id) : [...favorites, item.id]
                          setFavorites(next)
                          setItems(items.filter((m) => next.includes(m.id)))
                        }}
                        className="absolute left-4 top-4 z-10 h-9 w-9 rounded-full border bg-primary text-primary-foreground border-primary/50"
                        aria-label="Remove favorite"
                      >
                        <Heart className="h-4 w-4 mx-auto" />
                      </button>
                      <div className="relative h-44">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                        <div className="absolute top-4 right-4 bg-foreground text-background px-3 py-1.5 rounded-full text-xs font-bold">
                          ${item.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-serif text-xl font-bold mb-2 group-hover:text-primary transition">{item.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{item.description}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-border/50">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">{item.category}</span>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                            Details
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
