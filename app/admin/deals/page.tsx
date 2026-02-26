'use client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, Save, X, Loader2, Tag } from 'lucide-react'
import { Header } from '@/components/header'
import { useAuth } from '@/context/auth-context'
import { useRouter } from 'next/navigation'
import { addDeal, deleteDeal, getDeals, getMenuItems, getAllMenuItems, updateDeal } from '@/services/firestore'

interface Deal {
  id: string
  menuItemId?: string
  title: string
  description: string
  originalPrice?: number
  discountPercent?: number
  discountedPrice?: number
  image: string
}

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
}

export default function AdminDealsPage() {
  const { profile, loading: authLoading } = useAuth()
  const router = useRouter()
  const [deals, setDeals] = useState<Deal[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [menuSearch, setMenuSearch] = useState('')

  const restaurantId = process.env.NEXT_PUBLIC_RESTAURANT_ID ?? 'demo-restaurant'

  useEffect(() => {
    if (!authLoading && profile?.role !== 'admin') {
      router.push('/')
    }
  }, [profile, authLoading, router])

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const data = await getDeals(restaurantId)
        let menu = await getMenuItems(restaurantId)
        if (menu.length === 0) {
          menu = await getAllMenuItems()
        }
        setMenuItems(menu as MenuItem[])
        if (data.length === 0 && profile?.role === 'admin') {
          const { seedDeals } = await import('@/services/seed')
          await seedDeals(restaurantId)
          const refreshed = await getDeals(restaurantId)
          setDeals(refreshed as Deal[])
        } else {
          setDeals(data as Deal[])
        }
      } catch (error) {
        console.error('Failed to fetch deals:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDeals()
  }, [restaurantId, profile])

  const computeDiscounted = (original: number, percent: number) => {
    const value = original * (1 - percent / 100)
    return Math.max(0, Number(value.toFixed(2)))
  }

  const startNewDeal = () => {
    setMenuSearch('')
    setEditingDeal({
      id: 'new',
      menuItemId: '',
      title: '',
      description: '',
      originalPrice: 0,
      discountPercent: 15,
      discountedPrice: 0,
      image: ''
    })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingDeal) return

    setIsSaving(true)
    try {
      const payload = {
        ...editingDeal,
        originalPrice: editingDeal.originalPrice ?? 0,
        discountPercent: editingDeal.discountPercent ?? 0,
        discountedPrice: editingDeal.discountedPrice ?? editingDeal.originalPrice ?? 0,
      }
      if (editingDeal.id === 'new') {
        const { id, ...rest } = payload as any
        await addDeal(restaurantId, rest)
      } else {
        await updateDeal(restaurantId, editingDeal.id, payload)
      }

      const refreshed = await getDeals(restaurantId)
      setDeals(refreshed as Deal[])
      setEditingDeal(null)
    } catch (error) {
      console.error('Save failed:', error)
      alert('Failed to save deal. Please check the console for details.')
    } finally {
      setIsSaving(false)
    }
  }

  const filteredMenu = menuItems.filter((m) =>
    m.name.toLowerCase().includes(menuSearch.toLowerCase())
  )

  const handleDelete = async (dealId: string) => {
    if (!confirm('Are you sure you want to delete this deal?')) return
    try {
      await deleteDeal(dealId)
      setDeals(prev => prev.filter(d => d.id !== dealId))
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_rgba(240,242,245,0.9)_45%,_rgba(230,233,236,1)_100%)]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-[2.5rem] bg-card/90 border border-border/60 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.4)] p-6 lg:p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="font-serif text-4xl font-bold text-foreground">Hot Deals Management</h1>
              <p className="text-muted-foreground mt-1 text-lg">Add, edit, or update your trending deals</p>
            </div>
            <button
              onClick={startNewDeal}
              className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-full shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Deal
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {deals.map(deal => {
              const original = deal.originalPrice ?? (deal as any).price ?? 0
              const discounted = deal.discountedPrice ?? (deal as any).price ?? 0
              return (
              <motion.div
                key={deal.id}
                className="bg-background border border-border rounded-3xl overflow-hidden shadow-sm group hover:shadow-xl transition-all"
              >
                <div className="relative h-44">
                  <img src={deal.image} alt={deal.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button
                      onClick={() => setEditingDeal(deal)}
                      className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-lg"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(deal.id)}
                      className="p-3 bg-destructive text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-xl font-bold text-foreground">{deal.title}</h3>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground line-through">${Number(original).toFixed(2)}</div>
                      <div className="font-bold text-primary">${Number(discounted).toFixed(2)}</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{deal.description}</p>
                </div>
              </motion.div>
              )
            })}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {editingDeal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="bg-card border border-border w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
                <h2 className="font-serif text-2xl font-bold text-foreground flex items-center gap-3">
                  <Tag className="w-6 h-6 text-primary" />
                  {editingDeal.id === 'new' ? 'Create Deal' : 'Edit Deal'}
                </h2>
                <button onClick={() => setEditingDeal(null)} className="p-2 hover:bg-muted rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Menu Item</label>
                  <input
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    placeholder="Search menu items..."
                    className="mb-2 w-full bg-background border border-border p-3 rounded-xl focus:ring-2 focus:ring-primary/40 outline-none"
                  />
                  <select
                    value={editingDeal.menuItemId ?? ''}
                    onChange={(e) => {
                      const selected = menuItems.find((m) => m.id === e.target.value)
                      if (!selected) {
                        setEditingDeal({ ...editingDeal, menuItemId: '' })
                        return
                      }
                      const original = selected.price
                      const percent = editingDeal.discountPercent ?? 15
                      setEditingDeal({
                        ...editingDeal,
                        menuItemId: selected.id,
                        title: editingDeal.title || selected.name,
                        description: editingDeal.description || selected.description,
                        image: selected.image,
                        originalPrice: original,
                        discountedPrice: computeDiscounted(original, percent),
                      })
                    }}
                    className="w-full bg-background border border-border p-3 rounded-xl focus:ring-2 focus:ring-primary/40 outline-none"
                  >
                    <option value="">Select a menu item</option>
                    {filteredMenu.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} — ${m.price.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Hot Deal Name</label>
                  <input
                    required
                    value={editingDeal.title}
                    onChange={e => setEditingDeal({ ...editingDeal, title: e.target.value })}
                    className="w-full bg-background border border-border p-3 rounded-xl focus:ring-2 focus:ring-primary/40 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={editingDeal.description}
                    onChange={e => setEditingDeal({ ...editingDeal, description: e.target.value })}
                    className="w-full bg-background border border-border p-3 rounded-xl focus:ring-2 focus:ring-primary/40 outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Original Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingDeal.originalPrice ?? 0}
                      onChange={e => {
                        const original = parseFloat(e.target.value) || 0
                        const percent = editingDeal.discountPercent ?? 0
                        setEditingDeal({
                          ...editingDeal,
                          originalPrice: original,
                          discountedPrice: computeDiscounted(original, percent),
                        })
                      }}
                      className="w-full bg-background border border-border p-3 rounded-xl focus:ring-2 focus:ring-primary/40 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Image URL</label>
                    <input
                      required
                      value={editingDeal.image}
                      onChange={e => setEditingDeal({ ...editingDeal, image: e.target.value })}
                      className="w-full bg-background border border-border p-3 rounded-xl focus:ring-2 focus:ring-primary/40 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Discount (%)</label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      max="90"
                      value={editingDeal.discountPercent ?? 0}
                      onChange={(e) => {
                        const percent = parseFloat(e.target.value) || 0
                        const original = editingDeal.originalPrice ?? 0
                        setEditingDeal({
                          ...editingDeal,
                          discountPercent: percent,
                          discountedPrice: computeDiscounted(original, percent),
                        })
                      }}
                      className="w-full bg-background border border-border p-3 rounded-xl focus:ring-2 focus:ring-primary/40 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Discounted Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingDeal.discountedPrice ?? 0}
                      onChange={(e) => setEditingDeal({ ...editingDeal, discountedPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-background border border-border p-3 rounded-xl focus:ring-2 focus:ring-primary/40 outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingDeal(null)}
                    className="px-5 py-2 bg-muted text-foreground font-bold rounded-xl hover:bg-muted/80 transition-all border border-border"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Deal
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
