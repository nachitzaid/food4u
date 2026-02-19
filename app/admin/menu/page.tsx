'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Trash2, Edit2, Save, X, ChefHat,
  Flame, Zap, AlertCircle, Loader2, Info
} from 'lucide-react'
import { Header } from '@/components/header'
import { getMenuItems, updateMenuItem, addMenuItem, deleteMenuItem, uploadImage } from '@/services/firestore'
import { useAuth } from '@/context/auth-context'
import { useRouter } from 'next/navigation'

interface Ingredient {
  name: string
  removable: boolean
}

interface Extra {
  name: string
  price: number
}

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  calories?: number
  protein?: number
  ingredients: Ingredient[]
  extras: Extra[]
  isAvailable: boolean
}

export default function AdminMenuPage() {
  const { profile, loading: authLoading } = useAuth()
  const router = useRouter()
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const restaurantId = process.env.NEXT_PUBLIC_RESTAURANT_ID ?? 'demo-restaurant'

  useEffect(() => {
    if (!authLoading && profile?.role !== 'admin') {
      router.push('/')
    }
  }, [profile, authLoading, router])

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await getMenuItems(restaurantId)
        setItems(data as MenuItem[])
      } catch (error) {
        console.error('Failed to fetch menu:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMenu()
  }, [restaurantId])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editingItem) return

    setIsUploading(true)
    try {
      const fileName = `${Date.now()}-${file.name}`
      const path = `menu-items/${restaurantId}/${fileName}`
      const url = await uploadImage(file, path)
      setEditingItem({ ...editingItem, image: url })
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem) return

    setIsSaving(true)
    try {
      if (editingItem.id === 'new') {
        const { id, ...rest } = editingItem as any
        await addMenuItem(restaurantId, rest)
      } else {
        await updateMenuItem(restaurantId, editingItem.id, editingItem)
      }

      // Refresh local state
      const refreshed = await getMenuItems(restaurantId)
      setItems(refreshed as MenuItem[])
      setEditingItem(null)
    } catch (error) {
      console.error('Save failed:', error)
      alert('Failed to save item. Please check the console for details.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    try {
      await deleteMenuItem(restaurantId, itemId)
      setItems(prev => prev.filter(i => i.id !== itemId))
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  const startNewItem = () => {
    setEditingItem({
      id: 'new',
      name: '',
      description: '',
      price: 0,
      category: 'Pizza',
      image: '',
      calories: 0,
      protein: 0,
      ingredients: [],
      extras: [],
      isAvailable: true
    })
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="font-serif text-4xl font-bold text-foreground">Menu Management</h1>
            <p className="text-muted-foreground mt-1 text-lg">Add, edit, or customize your dishes</p>
          </div>
          <button
            onClick={startNewItem}
            className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Item
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map(item => (
            <motion.div
              key={item.id}
              className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm group hover:shadow-xl transition-all"
            >
              <div className="relative h-48">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-lg"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-3 bg-destructive text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-serif text-xl font-bold text-foreground">{item.name}</h3>
                  <span className="font-bold text-primary">${item.price.toFixed(2)}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{item.description}</p>

                <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground border-t border-border pt-4">
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    {item.calories} kcal
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-emerald-500" />
                    {item.protein}g protein
                  </span>
                  <span className="ml-auto text-primary uppercase tracking-widest">{item.category}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="bg-card border border-border w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-border flex justify-between items-center bg-muted/20">
                <h2 className="font-serif text-3xl font-bold text-foreground flex items-center gap-3">
                  <ChefHat className="w-8 h-8 text-primary" />
                  {editingItem.id === 'new' ? 'Craft New Dish' : 'Refine Recipe'}
                </h2>
                <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-muted rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column: Basic Info */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Dish Name</label>
                      <input
                        required
                        value={editingItem.name}
                        onChange={e => setEditingItem({ ...editingItem, name: e.target.value })}
                        className="w-full bg-background border border-border p-3 rounded-xl focus:ring-2 focus:ring-primary/40 outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</label>
                      <textarea
                        required
                        rows={3}
                        value={editingItem.description}
                        onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                        className="w-full bg-background border border-border p-3 rounded-xl focus:ring-2 focus:ring-primary/40 outline-none resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Price ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={editingItem.price}
                          onChange={e => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })}
                          className="w-full bg-background border border-border p-3 rounded-xl focus:ring-2 focus:ring-primary/40 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</label>
                        <select
                          value={editingItem.category}
                          onChange={e => setEditingItem({ ...editingItem, category: e.target.value })}
                          className="w-full bg-background border border-border p-3 rounded-xl focus:ring-2 focus:ring-primary/40 outline-none"
                        >
                          <option>Pizza</option>
                          <option>Burgers</option>
                          <option>Pasta</option>
                          <option>Salads</option>
                          <option>Desserts</option>
                          <option>Drinks</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Image URL</label>
                      <div className="flex flex-col gap-4">
                        {editingItem.image && (
                          <div className="relative w-full h-40 rounded-xl overflow-hidden border border-border">
                            <img src={editingItem.image} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <input
                          placeholder="https://example.com/image.jpg"
                          required
                          value={editingItem.image}
                          onChange={e => setEditingItem({ ...editingItem, image: e.target.value })}
                          className="w-full bg-background border border-border p-3 rounded-xl focus:ring-2 focus:ring-primary/40 outline-none"
                        />
                        <p className="text-[10px] text-muted-foreground bg-muted/30 p-2 rounded-lg leading-relaxed">
                          <span className="font-bold text-primary">Note:</span> Direct image upload is disabled because your Firebase Storage requires a pricing upgrade. Please paste an image link from Google or a hosting site (like Unsplash) for now.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Nutrition & Components */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Calories (kcal)</label>
                        <input
                          type="number"
                          value={editingItem.calories}
                          onChange={e => setEditingItem({ ...editingItem, calories: parseInt(e.target.value) || 0 })}
                          className="w-full bg-background border border-border p-3 rounded-xl focus:ring-2 focus:ring-primary/40 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Protein (g)</label>
                        <input
                          type="number"
                          value={editingItem.protein}
                          onChange={e => setEditingItem({ ...editingItem, protein: parseInt(e.target.value) || 0 })}
                          className="w-full bg-background border border-border p-3 rounded-xl focus:ring-2 focus:ring-primary/40 outline-none"
                        />
                      </div>
                    </div>

                    {/* Ingredients */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Ingredients</label>
                        <button
                          type="button"
                          onClick={() => setEditingItem({ ...editingItem, ingredients: [...editingItem.ingredients, { name: '', removable: true }] })}
                          className="text-[10px] bg-primary text-primary-foreground px-2 py-1 rounded-md font-bold uppercase tracking-tighter"
                        >
                          + Add Ingredient
                        </button>
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {editingItem.ingredients.map((ing, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input
                              value={ing.name}
                              onChange={e => {
                                const newIngs = [...editingItem.ingredients]
                                newIngs[idx].name = e.target.value
                                setEditingItem({ ...editingItem, ingredients: newIngs })
                              }}
                              placeholder="Ingredient name"
                              className="flex-1 bg-background border border-border px-3 py-2 rounded-lg text-sm outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newIngs = [...editingItem.ingredients]
                                newIngs[idx].removable = !newIngs[idx].removable
                                setEditingItem({ ...editingItem, ingredients: newIngs })
                              }}
                              className={`px-3 py-2 rounded-lg text-[10px] font-bold border transition ${ing.removable ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-muted text-muted-foreground border-border'
                                }`}
                            >
                              {ing.removable ? 'REMOVABLE' : 'FIXED'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingItem({ ...editingItem, ingredients: editingItem.ingredients.filter((_, i) => i !== idx) })}
                              className="p-2 text-destructive hover:bg-destructive/10 rounded-lg"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Extras */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Extras / Add-ons</label>
                        <button
                          type="button"
                          onClick={() => setEditingItem({ ...editingItem, extras: [...editingItem.extras, { name: '', price: 1.0 }] })}
                          className="text-[10px] bg-primary text-primary-foreground px-2 py-1 rounded-md font-bold uppercase tracking-tighter"
                        >
                          + Add Extra
                        </button>
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {editingItem.extras.map((extra, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input
                              value={extra.name}
                              onChange={e => {
                                const newExtras = [...editingItem.extras]
                                newExtras[idx].name = e.target.value
                                setEditingItem({ ...editingItem, extras: newExtras })
                              }}
                              placeholder="Extra Name"
                              className="flex-1 bg-background border border-border px-3 py-2 rounded-lg text-sm outline-none"
                            />
                            <input
                              type="number"
                              step="0.5"
                              value={extra.price}
                              onChange={e => {
                                const newExtras = [...editingItem.extras]
                                newExtras[idx].price = parseFloat(e.target.value)
                                setEditingItem({ ...editingItem, extras: newExtras })
                              }}
                              className="w-20 bg-background border border-border px-3 py-2 rounded-lg text-sm outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => setEditingItem({ ...editingItem, extras: editingItem.extras.filter((_, i) => i !== idx) })}
                              className="p-2 text-destructive hover:bg-destructive/10 rounded-lg"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-border flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-6 py-3 bg-muted text-foreground font-bold rounded-xl hover:bg-muted/80 transition-all border border-border"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Save To Menu
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
