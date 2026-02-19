'use client'

import { motion } from 'framer-motion'
import { useState, useMemo, useEffect } from 'react'
import { CartProvider } from '@/context/cart-context'
import { CartSidebar } from '@/components/menu/cart-sidebar'
import { MenuItemCard } from '@/components/menu/menu-item-card'
import { Header } from '@/components/header'
import { ChefHat, Search, Clock, Plus, Flame } from 'lucide-react'
import Link from 'next/link'
import { getMenuItems } from '@/services/firestore'
import { useAuth } from '@/context/auth-context'

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

  const { profile } = useAuth()
  const isAdmin = profile?.role === 'admin'
  const restaurantId = process.env.NEXT_PUBLIC_RESTAURANT_ID ?? 'demo-restaurant'

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true)
        const items = await getMenuItems(restaurantId)

        // Auto-seed if empty and user is admin
        if (items.length === 0 && isAdmin) {
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
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Categories */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              <div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-6">Categories</h3>
                <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide">
                  {categories.map(category => (
                    <motion.button
                      key={category}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCategory(category)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl whitespace-nowrap lg:whitespace-normal
                        font-medium transition group w-full text-left
                        ${selectedCategory === category
                          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                          : 'bg-card border border-border text-foreground hover:border-primary/50 hover:bg-muted'
                        }
                      `}
                    >
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center transition flex-shrink-0
                        ${selectedCategory === category ? 'bg-white/20' : 'bg-primary/10 text-primary group-hover:bg-primary/20'}
                      `}>
                        <ChefHat className="w-4 h-4" />
                      </div>
                      <span className="truncate">{category}</span>
                    </motion.button>
                  ))}
                </nav>
              </div>

              {/* Info section for desktop */}
              <div className="hidden lg:block p-6 bg-primary/5 border border-primary/10 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Delivery Time</p>
                    <p className="font-bold text-foreground font-serif">25-40 mins</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Crafted by our master chefs and delivered fresh to your doorstep.
                </p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Search and Branding */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-1">
                  Taste <span className="text-primary">{selectedCategory === 'All' ? 'Everything' : `Our ${selectedCategory}`}</span>
                </h2>
                <p className="text-muted-foreground">Premium ingredients, masterfully prepared.</p>
              </motion.div>

              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search delicacies..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground transition"
                />
              </div>
            </div>

            {/* Grid */}
            <div className="min-h-[400px]">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-80 bg-muted/20 animate-pulse rounded-2xl" />
                  ))}
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-24 bg-card border border-border rounded-3xl">
                  <ChefHat className="w-16 h-16 text-primary/20 mx-auto mb-4" />
                  <h3 className="text-xl font-bold font-serif mb-2">No items found</h3>
                  <p className="text-muted-foreground mb-6">Try refining your search or explore other categories.</p>
                  <button onClick={() => setSelectedCategory('All')} className="text-primary font-bold hover:underline">View All Category</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map(item => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ translateY: -8 }}
                      className="group"
                    >
                      <Link href={`/menu/${item.id}`}>
                        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                          <div className="relative h-48">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg">
                              <span className="text-sm font-bold text-white">${item.price.toFixed(2)}</span>
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
        </div>
      </div>

      <CartSidebar />
    </div>
  )
}

export default function MenuPage() {
  return (
    <CartProvider>
      <MenuContent />
    </CartProvider>
  )
}
