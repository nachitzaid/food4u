'use client'

import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { CartProvider } from '@/context/cart-context'
import { CartSidebar } from '@/components/menu/cart-sidebar'
import { MenuItemCard } from '@/components/menu/menu-item-card'
import { MenuItemModal } from '@/components/menu/menu-item-modal'
import { Header } from '@/components/header'
import { Search, Clock } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// Mock menu data with detailed information
const MENU_ITEMS = [
  {
    id: '1',
    name: 'Grilled Salmon Fillet',
    description: 'Fresh Atlantic salmon with lemon butter sauce, served with garlic mashed potatoes and seasonal vegetables',
    price: 24.99,
    category: 'Mains',
    image: '/placeholder.svg?height=400&width=400',
    isAvailable: true,
    rating: 4.8,
    reviews: 142,
    deliveryTime: '25-30 min',
    distance: '2.3 km',
    tags: ['Fresh Fish', 'Healthy', 'High Protein'],
    ingredients: ['Atlantic Salmon', 'Lemon', 'Butter', 'Garlic', 'Potatoes', 'Seasonal Vegetables', 'Olive Oil', 'Sea Salt'],
    nutritionalInfo: { calories: 385, protein: 42, fat: 18, carbs: 24 },
    sizes: [
      { size: 'S', label: '250g' },
      { size: 'M', label: '350g' },
      { size: 'L', label: '450g' }
    ],
    restaurant: { name: 'Seaside Grill', distance: '2.3 km' }
  },
  {
    id: '2',
    name: 'Ribeye Steak',
    description: 'Premium cut aged 28 days, served with seasonal vegetables and truffle jus',
    price: 32.99,
    category: 'Mains',
    image: '/placeholder.svg?height=400&width=400',
    isAvailable: true,
    rating: 4.9,
    reviews: 287,
    deliveryTime: '30-35 min',
    distance: '3.1 km',
    tags: ['Premium', 'Aged Beef', 'Special'],
    ingredients: ['Ribeye Steak', 'Herbs', 'Garlic', 'Seasonal Vegetables', 'Truffle Oil', 'Butter'],
    nutritionalInfo: { calories: 520, protein: 48, fat: 32, carbs: 8 },
    sizes: [
      { size: 'S', label: '250g' },
      { size: 'M', label: '350g' },
      { size: 'L', label: '450g' }
    ],
  },
  {
    id: '3',
    name: 'Truffle Risotto',
    description: 'Creamy risotto with black truffle, parmesan, and wild mushrooms',
    price: 22.99,
    category: 'Mains',
    image: '/placeholder.svg?height=400&width=400',
    isAvailable: true,
    rating: 4.7,
    reviews: 156,
    deliveryTime: '20-25 min',
    distance: '2.1 km',
    tags: ['Vegetarian', 'Creamy', 'Luxurious'],
    ingredients: ['Arborio Rice', 'Black Truffle', 'Parmesan', 'Wild Mushrooms', 'White Wine', 'Vegetable Broth', 'Butter'],
    nutritionalInfo: { calories: 395, protein: 18, fat: 22, carbs: 42 },
    sizes: [
      { size: 'S', label: '250g' },
      { size: 'M', label: '350g' },
      { size: 'L', label: '450g' }
    ],
  },
  {
    id: '4',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce, house-made parmesan crisps, and homemade croutons',
    price: 12.99,
    category: 'Starters',
    image: '/placeholder.svg?height=400&width=400',
    isAvailable: true,
    rating: 4.6,
    reviews: 89,
    deliveryTime: '15-20 min',
    distance: '1.8 km',
    tags: ['Fresh', 'Light', 'Vegetarian'],
    ingredients: ['Romaine Lettuce', 'Parmesan Cheese', 'Croutons', 'Caesar Dressing', 'Black Pepper'],
    nutritionalInfo: { calories: 280, protein: 12, fat: 16, carbs: 18 },
  },
  {
    id: '5',
    name: 'Foie Gras Terrine',
    description: 'Smooth foie gras with brioche toast points and fig jam',
    price: 18.99,
    category: 'Starters',
    image: '/placeholder.svg?height=400&width=400',
    isAvailable: true,
    rating: 4.9,
    reviews: 64,
    deliveryTime: '18-23 min',
    distance: '2.5 km',
    tags: ['Luxury', 'French', 'Rich'],
    ingredients: ['Foie Gras', 'Brioche', 'Fig Jam', 'Truffle Oil', 'Sea Salt', 'Black Pepper'],
    nutritionalInfo: { calories: 425, protein: 8, fat: 38, carbs: 22 },
  },
  {
    id: '6',
    name: 'Chicken and Vegetable Bowls',
    description: 'Perfectly balanced bowl with stewed chicken, fresh vegetables and white sauce with mustard',
    price: 15.99,
    category: 'Mains',
    image: '/placeholder.svg?height=400&width=400',
    isAvailable: true,
    rating: 4.5,
    reviews: 125,
    deliveryTime: '15-20 min',
    distance: '1.5 km',
    tags: ['Healthy', 'Fresh', 'Balanced'],
    ingredients: ['Stewed Chicken', 'White Sauce', 'Mustard', 'Carrot', 'Tomato', 'Broccoli', 'Brown Rice', 'Cucumber'],
    nutritionalInfo: { calories: 340, protein: 32, fat: 12, carbs: 28 },
    sizes: [
      { size: 'S', label: '250g' },
      { size: 'M', label: '350g' },
      { size: 'L', label: '450g' }
    ],
  },
  {
    id: '7',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with molten center, served with vanilla ice cream',
    price: 9.99,
    category: 'Desserts',
    image: '/placeholder.svg?height=400&width=400',
    isAvailable: true,
    rating: 4.8,
    reviews: 234,
    deliveryTime: '10-15 min',
    distance: '1.9 km',
    tags: ['Chocolate', 'Warm', 'Indulgent'],
    ingredients: ['Chocolate', 'Butter', 'Eggs', 'Sugar', 'Flour', 'Vanilla Ice Cream'],
    nutritionalInfo: { calories: 385, protein: 6, fat: 22, carbs: 48 },
  },
  {
    id: '8',
    name: 'Vanilla Panna Cotta',
    description: 'Silky panna cotta with berry compote and fresh mint',
    price: 8.99,
    category: 'Desserts',
    image: '/placeholder.svg?height=400&width=400',
    isAvailable: true,
    rating: 4.7,
    reviews: 156,
    deliveryTime: '10-15 min',
    distance: '2.0 km',
    tags: ['Creamy', 'Light', 'Elegant'],
    ingredients: ['Heavy Cream', 'Vanilla', 'Gelatin', 'Sugar', 'Fresh Berries', 'Mint'],
    nutritionalInfo: { calories: 245, protein: 4, fat: 16, carbs: 24 },
  },
]

const CATEGORIES = ['All', ...new Set(MENU_ITEMS.map(item => item.category))]

function MenuContent() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchTerm])

  const handleItemClick = (item) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedItem(null)
  }

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
                <motion.div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <MenuItemCard {...item} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <CartSidebar />

      {/* Menu Item Detail Modal */}
      <MenuItemModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
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
