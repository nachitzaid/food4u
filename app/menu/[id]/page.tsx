'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { getCartItemKey, useCart } from '@/context/cart-context'
import {
  Plus,
  Minus,
  ArrowLeft,
  ShoppingCart,
  CheckCircle2,
  Flame,
  Leaf,
  Heart,
} from 'lucide-react'
import Link from 'next/link'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/services/firebase'
import { useAuth } from '@/context/auth-context'
import { getUserFavorites, toggleUserFavorite } from '@/services/firestore'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  sizes?: { label: string; priceDelta: number }[]
  ingredients?: { name: string; removable: boolean }[]
  extras?: { name: string; price: number }[]
  pairings?: { name: string; price: number }[]
}

function ItemDetailContent() {
  const { id } = useParams()
  const { addItem, items, itemCount, subtotal, remainingMs, updateQuantity, removeItem } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const minutes = Math.floor(remainingMs / 60000)
  const seconds = Math.floor((remainingMs % 60000) / 1000)
  const [item, setItem] = useState<MenuItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedBuild, setSelectedBuild] = useState<string[]>([])
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([])
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return
      try {
        const docRef = doc(db, 'menuItems', id as string)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setItem({ id: docSnap.id, ...docSnap.data() } as MenuItem)
        }
      } catch (error) {
        console.error('Error fetching item:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchItem()
  }, [id])

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user || !item?.id) {
        setIsFavorite(false)
        return
      }
      const favs = await getUserFavorites(user.uid)
      setIsFavorite(favs.includes(item.id))
    }
    fetchFavorites().catch(() => undefined)
  }, [user, item?.id])

  useEffect(() => {
    if (!item) return
    if (!selectedSize) {
      const initial = item.sizes?.[0]?.label ?? '380g'
      setSelectedSize(initial)
    }
  }, [item, selectedSize])

  const sizes = item?.sizes?.length
    ? item.sizes
    : [
        { label: '380g', priceDelta: 0 },
        { label: '480g', priceDelta: 2 },
        { label: '560g', priceDelta: 4 },
      ]

  const activeSize = sizes.find((s) => s.label === selectedSize) ?? sizes[0]
  const buildOptions = item?.extras ?? []
  const selectedExtras = buildOptions.filter((e) => selectedBuild.includes(e.name))
  const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0)
  const totalPrice = item ? (item.price + activeSize.priceDelta + extrasTotal) * quantity : 0

  const handleAddToCart = () => {
    if (!user) {
      router.push(`/auth/login?redirect=${encodeURIComponent(`/menu/${id}`)}`)
      return
    }
    if (!item) return
    addItem({
      id: item.id,
      name: item.name,
      price: item.price + activeSize.priceDelta + extrasTotal,
      image: item.image,
      quantity,
      removedIngredients,
      extras: selectedExtras,
      size: activeSize.label,
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-serif italic text-muted-foreground transition-all animate-pulse">Preparing your experience...</p>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h1 className="font-serif text-3xl font-bold mb-4">Dish not found</h1>
        <Link href="/menu" className="text-primary hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to menu
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_rgba(240,242,245,0.9)_45%,_rgba(230,233,236,1)_100%)]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition mb-8 group"
        >
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back to Menu
        </Link>

        <div className="rounded-[2.5rem] bg-card/90 border border-border/60 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.4)] p-6 lg:p-10">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {['Pasta', 'Salad', 'Seafood', 'Soups', 'Roasted Meats', 'Oven-Baked', 'Plant-Based', 'Rice'].map((tab) => (
              <Link
                key={tab}
                href={`/menu?category=${encodeURIComponent(tab)}`}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border transition ${tab === item.category
                  ? 'bg-foreground text-background border-transparent'
                  : 'bg-background text-foreground/70 border-border hover:text-foreground'
                  }`}
              >
                {tab}
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1.2fr_0.85fr] gap-8 mt-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div className="aspect-square rounded-[2.5rem] bg-muted/30 border border-border/60 flex items-center justify-center shadow-inner">
                <div className="relative h-[90%] w-[90%] rounded-full overflow-hidden shadow-2xl">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
              </div>
            </motion.div>

            <div className="space-y-8">
              <div>
                <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-3">{item.name}</h1>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={async () => {
                    if (!user) {
                      router.push(`/auth/login?redirect=${encodeURIComponent(`/menu/${id}`)}`)
                      return
                    }
                    await toggleUserFavorite(user.uid, item.id, isFavorite)
                    setIsFavorite(!isFavorite)
                  }}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold border transition ${
                    isFavorite
                      ? 'bg-primary text-primary-foreground border-primary/50'
                      : 'bg-background text-foreground/70 border-border hover:text-foreground'
                  }`}
                >
                  <Heart className="h-4 w-4" />
                  {isFavorite ? 'Saved' : 'Save'}
                </button>
              </div>

              {item.ingredients?.length ? (
                <div className="space-y-4">
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Ingredients</p>
                  <div className="flex flex-wrap gap-2">
                    {item.ingredients.map((ing) => {
                      const isRemoved = removedIngredients.includes(ing.name)
                      const isRemovable = ing.removable
                      return (
                        <button
                          key={ing.name}
                          type="button"
                          disabled={!isRemovable}
                          onClick={() => {
                            if (!isRemovable) return
                            if (isRemoved) {
                              setRemovedIngredients(removedIngredients.filter((n) => n !== ing.name))
                            } else {
                              setRemovedIngredients([...removedIngredients, ing.name])
                            }
                          }}
                          className={`rounded-full px-4 py-2 text-xs font-semibold border transition ${
                            !isRemovable
                              ? 'bg-muted/50 text-muted-foreground border-border/60 cursor-not-allowed'
                              : isRemoved
                                ? 'bg-destructive/10 text-destructive border-destructive/30'
                                : 'bg-background text-foreground/70 border-border hover:text-foreground'
                          }`}
                          aria-pressed={isRemoved}
                        >
                          {ing.name}
                          {isRemovable ? (isRemoved ? ' · removed' : ' · removable') : ' · fixed'}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : null}

              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Size</p>
                <div className="flex items-center gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size.label}
                      onClick={() => setSelectedSize(size.label)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${activeSize.label === size.label
                        ? 'bg-foreground text-background border-transparent'
                        : 'bg-background text-foreground/70 border-border hover:text-foreground'
                        }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              {buildOptions.length > 0 && (
                <div className="space-y-4">
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Build your meal</p>
                  <div className="grid grid-cols-3 gap-4">
                    {buildOptions.map((addon) => {
                      const isActive = selectedBuild.includes(addon.name)
                      return (
                        <button
                          key={addon.name}
                          onClick={() => {
                            if (isActive) {
                              setSelectedBuild(selectedBuild.filter(name => name !== addon.name))
                            } else {
                              setSelectedBuild([...selectedBuild, addon.name])
                            }
                          }}
                          className={`rounded-2xl border p-4 text-center transition ${isActive
                            ? 'bg-primary/10 border-primary/40 text-primary'
                            : 'bg-background border-border text-foreground/70 hover:text-foreground'
                            }`}
                        >
                          <div className="mx-auto w-9 h-9 rounded-full bg-muted/50 grid place-items-center mb-2">
                            {isActive ? <Flame className="w-4 h-4" /> : <Leaf className="w-4 h-4" />}
                          </div>
                          <p className="text-xs font-semibold">{addon.name}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">+${addon.price.toFixed(2)}</p>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <div className="flex items-center gap-4 bg-muted/30 p-2 rounded-full border border-border">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`
                    flex-1 w-full sm:w-auto h-12 rounded-full flex items-center justify-center gap-3 font-semibold text-base transition shadow-xl
                    ${addedToCart
                      ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                      : 'bg-foreground text-background hover:bg-foreground/90 shadow-foreground/20'
                    }
                  `}
                >
                  {addedToCart ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" /> Added!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" /> Add to order ${totalPrice.toFixed(2)}
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4">
                {[
                  { label: 'Energy', value: `${item.calories ?? '---'} kcal` },
                  { label: 'Protein', value: `${item.protein ?? '---'} g` },
                  { label: 'Category', value: item.category },
                ].map((stat, index) => (
                  <div key={index} className="rounded-2xl bg-background border border-border p-3 text-center">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{stat.label}</p>
                    <p className="text-sm font-semibold text-foreground mt-1">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-3xl bg-background border border-border p-6">
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
            </aside>
          </div>

          {item.pairings?.length ? (
            <div className="mt-10 space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Recommended Pairings</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {item.pairings.map((pair, index) => (
                  <div key={index} className="flex items-center gap-4 rounded-2xl border border-dashed border-border bg-background p-4">
                    <div className="h-12 w-12 rounded-full bg-muted/50 grid place-items-center text-xs font-bold">
                      {pair.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{pair.name}</p>
                      <p className="text-xs text-primary">${pair.price.toFixed(2)}</p>
                    </div>
                    <button className="h-8 w-8 rounded-full bg-foreground text-background grid place-items-center text-sm font-bold">
                      +
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  )
}

export default function ItemDetailPage() {
  return <ItemDetailContent />
}
