'use client'

import { motion } from 'framer-motion'
import { useState, useMemo, useEffect } from 'react'
import { getCartItemKey, useCart } from '@/context/cart-context'
import { CartSidebar } from '@/components/menu/cart-sidebar'
import { Header } from '@/components/header'
import { ChefHat, Search, Plus, ShoppingBag, Heart } from 'lucide-react'
import Link from 'next/link'
import { getMenuItems, getUserFavorites, toggleUserFavorite } from '@/services/firestore'
import { useAuth } from '@/context/auth-context'
import { useRouter, useSearchParams } from 'next/navigation'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  isAvailable?: boolean
  calories?: number
  protein?: number
  ingredients?: { name: string; removable: boolean }[]
  extras?: { name: string; price: number }[]
}

function MenuContent() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<string[]>([])
  const { items, itemCount, subtotal, remainingMs, updateQuantity, removeItem } = useCart()
  const minutes = Math.floor(remainingMs / 60000)
  const seconds = Math.floor((remainingMs % 60000) / 1000)

  const { profile, user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isAdmin = profile?.role === 'admin'
  const restaurantId = process.env.NEXT_PUBLIC_RESTAURANT_ID ?? 'demo-restaurant'
  const targetCount = 100

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true)
        const items = await getMenuItems(restaurantId)

        // Auto-seed if empty and user is admin
        if (items.length < targetCount && isAdmin) {
          const { seedMenu } = await import('@/services/seed')
          await seedMenu(restaurantId)
          const refreshedItems = await getMenuItems(restaurantId)
          setMenuItems(refreshedItems as MenuItem[])
        } else {
          setMenuItems(items as MenuItem[])
        }
      } catch (error) {
        console.error('Failed to load menu:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMenu()
  }, [restaurantId, isAdmin])

  useEffect(() => {
    const category = searchParams.get('category')
    if (category) {
      setSelectedCategory(category)
    }
  }, [searchParams])

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setFavorites([])
        return
      }
      const favs = await getUserFavorites(user.uid)
      setFavorites(favs)
    }
    fetchFavorites().catch(() => undefined)
  }, [user])

  const handleToggleFavorite = async (itemId: string) => {
    if (!user) {
      router.push(`/auth/login?redirect=${encodeURIComponent('/menu')}`)
      return
    }
    const isFav = favorites.includes(itemId)
    await toggleUserFavorite(user.uid, itemId, isFav)
    setFavorites(isFav ? favorites.filter(id => id !== itemId) : [...favorites, itemId])
  }

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(menuItems.map(item => item.category)))],
    [menuItems]
  )

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [menuItems, selectedCategory, searchTerm])

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_rgba(240,242,245,0.9)_45%,_rgba(230,233,236,1)_100%)]">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-[2.5rem] bg-card/90 border border-border/60 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.4)] p-6 lg:p-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Content */}
            <main className="flex-1 min-w-0 space-y-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-1">
                    Meal <span className="text-primary">Category</span>
                  </h2>
                  <p className="text-muted-foreground">Pick a category and explore our newest plates.</p>
                </motion.div>

                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search dishes..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground transition"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map(category => (
                  <motion.button
                    key={category}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCategory(category)}
                    className={`
                      px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                      ${selectedCategory === category
                        ? 'bg-foreground text-background shadow'
                        : 'bg-muted/40 text-foreground/70 hover:text-foreground hover:bg-muted'
                      }
                    `}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>

              <div className="min-h-[400px]">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-64 bg-muted/20 animate-pulse rounded-2xl" />
                    ))}
                  </div>
                ) : filteredItems.length === 0 ? (
                  <div className="text-center py-20 bg-background border border-border rounded-3xl">
                    <ChefHat className="w-16 h-16 text-primary/20 mx-auto mb-4" />
                    <h3 className="text-xl font-bold font-serif mb-2">No items found</h3>
                    <p className="text-muted-foreground mb-6">Try refining your search or explore other categories.</p>
                    <button onClick={() => setSelectedCategory('All')} className="text-primary font-bold hover:underline">View All Category</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredItems.map(item => (
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
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleToggleFavorite(item.id)
                              }}
                              className={`absolute left-4 top-4 z-10 h-9 w-9 rounded-full border transition ${
                                favorites.includes(item.id)
                                  ? 'bg-primary text-primary-foreground border-primary/50'
                                  : 'bg-background/80 text-foreground border-border'
                              }`}
                              aria-label="Toggle favorite"
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
                                  Details <Plus className="w-3 h-3" />
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
            </main>

            {/* Right Summary */}
            <aside className="lg:w-80 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                <div className="rounded-3xl bg-background border border-border p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-serif text-xl font-bold">My Order</h3>
                    <span className="text-xs text-muted-foreground">{itemCount} items</span>
                  </div>
                  {remainingMs > 0 && (
                    <div className="mb-4 text-xs text-muted-foreground">
                      Cart expires in {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </div>
                  )}
                  <div className="space-y-4">
                    {items.length === 0 ? (
                      <div className="text-sm text-muted-foreground">Your cart is empty.</div>
                    ) : (
                      items.map((order) => {
                        const itemKey = getCartItemKey(order)
                        return (
                          <div key={itemKey} className="flex items-center gap-3 rounded-2xl border border-dashed border-border p-3">
                            <div className="h-12 w-12 rounded-full bg-muted/50 grid place-items-center text-xs font-bold">
                              {order.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-foreground">{order.name}</p>
                              <p className="text-xs text-primary">${order.price.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => updateQuantity(itemKey, order.quantity - 1)}
                                className="h-7 w-7 rounded-full border border-border text-xs font-bold hover:bg-muted transition"
                              >
                                -
                              </button>
                              <span className="text-xs text-muted-foreground">x{order.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(itemKey, order.quantity + 1)}
                                className="h-7 w-7 rounded-full border border-border text-xs font-bold hover:bg-muted transition"
                              >
                                +
                              </button>
                              <button
                                type="button"
                                onClick={() => removeItem(itemKey)}
                                className="h-7 w-7 rounded-full border border-destructive/30 text-destructive text-xs font-bold hover:bg-destructive/10 transition"
                              >
                                x
                              </button>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>

                  <div className="mt-6 space-y-2 text-sm">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between font-bold text-foreground pt-2 border-t border-border">
                      <span>Total</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="mt-6 block w-full rounded-full bg-primary text-primary-foreground py-3 text-sm font-semibold shadow-lg shadow-primary/20 text-center"
                  >
                    Confirm Order
                  </Link>
                </div>

                <div className="rounded-3xl bg-foreground text-background p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-background/20 grid place-items-center">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] opacity-70">Delivery</p>
                      <p className="font-semibold">25-40 mins</p>
                    </div>
                  </div>
                  <p className="text-xs opacity-70 leading-relaxed">
                    Crafted by our chefs and delivered fresh to your doorstep.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <CartSidebar />
    </div>
  )
}

export default function MenuPage() {
  return <MenuContent />
}
