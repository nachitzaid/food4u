'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ChefHat, Plus, Edit2, Trash2, X, Check } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  isAvailable: boolean
}

// Mock menu items
const MOCK_MENU_ITEMS: MenuItem[] = [
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
    name: 'Caesar Salad',
    description: 'Crisp romaine, parmesan, and homemade croutons',
    price: 12.99,
    category: 'Starters',
    image: '/placeholder.svg?height=200&width=300',
    isAvailable: false,
  },
]

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>(MOCK_MENU_ITEMS)
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<MenuItem, 'id'>>({
    name: '',
    description: '',
    price: 0,
    category: 'Mains',
    image: '',
    isAvailable: true,
  })

  const handleAddItem = () => {
    if (formData.name && formData.description && formData.price > 0) {
      const newItem: MenuItem = {
        id: Date.now().toString(),
        ...formData,
      }
      setItems([...items, newItem])
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: 'Mains',
        image: '',
        isAvailable: true,
      })
      setIsAddingItem(false)
    }
  }

  const handleUpdateItem = (id: string) => {
    if (formData.name && formData.description && formData.price > 0) {
      setItems(
        items.map(item =>
          item.id === id
            ? {
                ...item,
                ...formData,
              }
            : item
        )
      )
      setEditingId(null)
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: 'Mains',
        image: '',
        isAvailable: true,
      })
    }
  }

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const handleEditItem = (item: MenuItem) => {
    setEditingId(item.id)
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      isAvailable: item.isAvailable,
    })
  }

  const handleToggleAvailability = (id: string) => {
    setItems(
      items.map(item =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    )
  }

  const categories = ['Mains', 'Starters', 'Desserts', 'Beverages']

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 hover:opacity-80 transition">
            <ChefHat className="w-8 h-8 text-primary" />
            <span className="font-serif text-2xl font-bold text-foreground">Food4U Admin</span>
          </Link>
          <button className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition">
            Sign Out
          </button>
        </div>
      </nav>

      {/* Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-serif text-4xl font-bold text-foreground mb-2">Menu Management</h1>
            <p className="text-muted-foreground">Add, edit, or remove items from your menu</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsAddingItem(!isAddingItem)
              setEditingId(null)
            }}
            className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Item
          </motion.button>
        </div>
      </section>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {(isAddingItem || editingId) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-border"
          >
            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  {editingId ? 'Edit Item' : 'Add New Item'}
                </h2>
                <button
                  onClick={() => {
                    setIsAddingItem(false)
                    setEditingId(null)
                  }}
                  className="p-2 hover:bg-muted rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Grilled Salmon Fillet"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={e =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={e =>
                      setFormData({ ...formData, price: parseFloat(e.target.value) })
                    }
                    placeholder="24.99"
                    step="0.01"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={e =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    placeholder="/images/salmon.jpg"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={e =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Fresh Atlantic salmon with lemon butter sauce"
                    rows={3}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={e =>
                        setFormData({ ...formData, isAvailable: e.target.checked })
                      }
                      className="w-4 h-4"
                    />
                    <span className="font-medium text-foreground">Available</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (editingId) {
                      handleUpdateItem(editingId)
                    } else {
                      handleAddItem()
                    }
                  }}
                  className="flex-1 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  {editingId ? 'Update Item' : 'Add Item'}
                </motion.button>
                <button
                  onClick={() => {
                    setIsAddingItem(false)
                    setEditingId(null)
                  }}
                  className="flex-1 py-3 bg-secondary/20 text-foreground font-semibold rounded-lg hover:bg-secondary/30 transition border border-border"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu Items Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition"
              >
                <div className="relative w-full h-40 bg-muted overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleToggleAvailability(item.id)}
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        item.isAvailable
                          ? 'bg-green-500/20 text-green-500 border border-green-500/30'
                          : 'bg-red-500/20 text-red-500 border border-red-500/30'
                      }`}
                    >
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </motion.button>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-serif font-semibold text-foreground mb-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {item.description}
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Category: {item.category}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif text-lg font-bold text-primary">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEditItem(item)}
                      className="flex-1 py-2 bg-blue-500/10 text-blue-500 font-medium rounded-lg hover:bg-blue-500/20 border border-blue-500/20 transition flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteItem(item.id)}
                      className="flex-1 py-2 bg-red-500/10 text-red-500 font-medium rounded-lg hover:bg-red-500/20 border border-red-500/20 transition flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {items.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-lg text-muted-foreground mb-4">No menu items yet</p>
              <button
                onClick={() => setIsAddingItem(true)}
                className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition"
              >
                Add Your First Item
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
