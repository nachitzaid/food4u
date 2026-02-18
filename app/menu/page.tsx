'use client'

import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { CartProvider } from '@/context/cart-context'
import { CartSidebar } from '@/components/menu/cart-sidebar'
import { MenuItemCard } from '@/components/menu/menu-item-card'
import { Header } from '@/components/header'
import { ChefHat, Search, Clock } from 'lucide-react'
import Link from 'next/link'

// Mock menu data
const MENU_ITEMS = [
  {
    id: '1',
    name: 'Grilled Salmon Fillet',
    description: 'Fresh Atlantic salmon with lemon butter sauce',
    price: 24.99,
    category: 'Mains',
    image: '/placeholder.svg?height=200&width=300',
    isAvailable: true,
  },
  {
    id: '2',
    name: 'Ribeye Steak',
    description: 'Premium cut aged 28 days, served with seasonal vegetables',
    price: 32.99,
    category: 'Mains',
    image: '/placeholder.svg?height=200&width=300',
    isAvailable: true,
  },
  {
    id: '3',
    name: 'Truffle Risotto',
    description: 'Creamy risotto with black truffle and parmesan',
    price: 22.99,
    category: 'Mains',
    image: '/placeholder.svg?height=200&width=300',
    isAvailable: true,
  },
  {
    id: '4',
    name: 'Caesar Salad',
    description: 'Crisp romaine, parmesan, and homemade croutons',
    price: 12.99,
    category: 'Starters',
    image: '/placeholder.svg?height=200&width=300',
    isAvailable: true,
  },
  {
    id: '5',
    name: 'Foie Gras Terrine',
    description: 'Smooth foie gras with brioche and fig jam',
    price: 18.99,
    category: 'Starters',
    image: '/placeholder.svg?height=200&width=300',
    isAvailable: true,
  },
  {
    id: '6',
    name: 'Escargot Bourguignonne',
    description: 'Snails in garlic and parsley butter',
    price: 14.99,
    category: 'Starters',
    image: '/placeholder.svg?height=200&width=300',
    isAvailable: false,
  },
  {
    id: '7',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with molten center',
    price: 9.99,
    category: 'Desserts',
    image: '/placeholder.svg?height=200&width=300',
    isAvailable: true,
  },
  {
    id: '8',
    name: 'Vanilla Panna Cotta',
    description: 'Silky panna cotta with berry compote',
    price: 8.99,
    category: 'Desserts',
    image: '/placeholder.svg?height=200&width=300',
    isAvailable: true,
  },
  {
    id: '9',
    name: 'Espresso Martini',
    description: 'Vodka, coffee liqueur, fresh espresso',
    price: 11.99,
    category: 'Beverages',
    image: '/placeholder.svg?height=200&width=300',
    isAvailable: true,
  },
]

const CATEGORIES = ['All', ...new Set(MENU_ITEMS.map(item => item.category))]

function MenuContent() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchTerm])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-2">
              Our Menu
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Estimated delivery: 30-45 minutes
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-card/30 border-b border-border sticky top-16 z-30">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {CATEGORIES.map(category => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-foreground hover:border-primary/50'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Items Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground text-lg">
                No items found. Try adjusting your search.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredItems.map(item => (
                <MenuItemCard
                  key={item.id}
                  {...item}
                />
              ))}
            </motion.div>
          )}
        </div>
      </section>

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
