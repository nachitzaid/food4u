'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Header } from '@/components/header'
import { ChevronRight, Truck, Clock, Plus, Minus, X } from 'lucide-react'
import { getCartItemKey, useCart } from '@/context/cart-context'
import { getMenuItems, placeOrder } from '@/services/firestore'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Restaurant location (mock)
const RESTAURANT_LOCATION = {
  lat: 40.7128,
  lng: -74.0060,
  name: 'Food4U Restaurant',
  address: '123 Main St, New York, NY 10001',
}

// Delivery fee calculation
function calculateDeliveryFee(distanceKm: number): number {
  const baseFee = 2.99
  const perKmFee = 0.5
  return parseFloat((baseFee + distanceKm * perKmFee).toFixed(2))
}

// Mock distance calculation (replace with Mapbox)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLng = (lng2 - lng1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

import { useAuth } from '@/context/auth-context'

function CheckoutContent() {
  const { items, subtotal, clearCart, updateQuantity, removeItem, replaceItem, remainingMs } = useCart()
  const { user, profile } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState<'address' | 'payment' | 'confirm'>('address')
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    zipCode: '',
    phone: '',
  })
  const [distance, setDistance] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [menuMap, setMenuMap] = useState<Record<string, any>>({})
  const restaurantId = process.env.NEXT_PUBLIC_RESTAURANT_ID ?? 'demo-restaurant'

  const deliveryFee = calculateDeliveryFee(distance)
  const tax = parseFloat((subtotal * 0.08).toFixed(2))
  const total = subtotal + deliveryFee + tax
  const minutes = Math.floor(remainingMs / 60000)
  const seconds = Math.floor((remainingMs % 60000) / 1000)

  const getSizeOptions = (menuItem?: any) =>
    menuItem?.sizes?.length
      ? menuItem.sizes
      : [
          { label: '380g', priceDelta: 0 },
          { label: '480g', priceDelta: 2 },
          { label: '560g', priceDelta: 4 },
        ]

  const getAvailableExtras = (menuItem?: any) => menuItem?.extras ?? []
  const getIngredients = (menuItem?: any) => menuItem?.ingredients ?? []

  const computeUnitPrice = (menuItem: any, sizeLabel: string, selectedExtras: any[]) => {
    const size =
      getSizeOptions(menuItem).find((s: any) => s.label === sizeLabel) ??
      getSizeOptions(menuItem)[0]
    const extrasTotal = selectedExtras.reduce((sum, e) => sum + Number(e.price || 0), 0)
    return Number(menuItem?.price || 0) + Number(size?.priceDelta || 0) + extrasTotal
  }

  const updateCartItem = (
    cartItem: any,
    updates: { size?: string; extras?: any[]; removedIngredients?: string[] }
  ) => {
    const menuItem = menuMap[cartItem.id]
    if (!menuItem) return
    const newSize = updates.size ?? cartItem.size ?? getSizeOptions(menuItem)[0].label
    const newExtras = updates.extras ?? cartItem.extras ?? []
    const newRemoved = updates.removedIngredients ?? cartItem.removedIngredients ?? []
    const newPrice = computeUnitPrice(menuItem, newSize, newExtras)
    const newItem = {
      ...cartItem,
      size: newSize,
      extras: newExtras,
      removedIngredients: newRemoved,
      price: newPrice,
    }
    replaceItem(getCartItemKey(cartItem), newItem)
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock distance calculation
    const mockDistance = Math.random() * 5 + 1
    setDistance(mockDistance)
    setStep('payment')
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('confirm')
  }

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const menu = await getMenuItems(restaurantId)
        const map: Record<string, any> = {}
        menu.forEach((m: any) => {
          map[m.id] = m
        })
        setMenuMap(map)
      } catch (error) {
        console.error('Failed to load menu items for checkout:', error)
      }
    }
    fetchMenu()
  }, [restaurantId])

  const handlePlaceOrder = async () => {
    setIsProcessing(true)
    try {
      if (!user) {
        router.push(`/auth/login?redirect=${encodeURIComponent('/checkout')}`)
        return
      }
      const userId = user?.uid ?? 'guest'
      await placeOrder({
        userId,
        customerName: profile?.name || user?.displayName || 'Guest',
        customerEmail: profile?.email || user?.email || '',
        items,
        subtotal,
        deliveryFee,
        tax,
        total,
        deliveryAddress,
        distance,
      })
      clearCart()
      router.push('/orders')
    } catch (error) {
      console.error('Failed to place order:', error)
      alert('Something went wrong placing your order. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_rgba(240,242,245,0.9)_45%,_rgba(230,233,236,1)_100%)] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center rounded-[2.5rem] bg-card/90 border border-border/60 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.4)] p-10"
        >
          <h1 className="font-serif text-3xl font-bold text-foreground mb-4">Please log in</h1>
          <p className="text-muted-foreground mb-8">You need an account to place an order.</p>
          <Link
            href={`/auth/login?redirect=${encodeURIComponent('/checkout')}`}
            className="inline-block px-6 py-3 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary/90 transition"
          >
            Log in to continue
          </Link>
        </motion.div>
      </div>
    )
  }

  if (items.length === 0 && step === 'address') {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_rgba(240,242,245,0.9)_45%,_rgba(230,233,236,1)_100%)] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center rounded-[2.5rem] bg-card/90 border border-border/60 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.4)] p-10"
        >
          <h1 className="font-serif text-3xl font-bold text-foreground mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Add items to your cart before checking out</p>
          <Link
            href="/menu"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary/90 transition"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_rgba(240,242,245,0.9)_45%,_rgba(230,233,236,1)_100%)]">
      <Header />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2.5rem] bg-card/90 border border-border/60 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.4)] p-6 lg:p-10"
        >
          <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Checkout</h1>
            <div className="flex items-center gap-2 rounded-full bg-muted/40 p-1">
              {['Address', 'Payment', 'Confirmation'].map((s, i) => {
                const isActive =
                  (i === 0 && step === 'address') ||
                  (i === 1 && step === 'payment') ||
                  (i === 2 && step === 'confirm')
                return (
                  <div
                    key={s}
                    className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition ${isActive
                      ? 'bg-foreground text-background shadow'
                      : 'text-muted-foreground'
                      }`}
                  >
                    {s}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Address Form */}
              {step === 'address' && (
                <motion.form
                  onSubmit={handleAddressSubmit}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-background border border-border rounded-3xl p-8"
                >
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                    Delivery Address
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Street Address
                      </label>
                        <input
                          type="text"
                          required
                          value={deliveryAddress.street}
                          onChange={e =>
                            setDeliveryAddress({ ...deliveryAddress, street: e.target.value })
                          }
                          placeholder="123 Main St"
                          className="w-full px-4 py-3 bg-card border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          required
                          value={deliveryAddress.city}
                          onChange={e =>
                            setDeliveryAddress({ ...deliveryAddress, city: e.target.value })
                          }
                          placeholder="New York"
                          className="w-full px-4 py-3 bg-card border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          required
                          value={deliveryAddress.zipCode}
                          onChange={e =>
                            setDeliveryAddress({ ...deliveryAddress, zipCode: e.target.value })
                          }
                          placeholder="10001"
                          className="w-full px-4 py-3 bg-card border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Phone Number
                      </label>
                        <input
                          type="tel"
                          required
                          value={deliveryAddress.phone}
                          onChange={e =>
                            setDeliveryAddress({ ...deliveryAddress, phone: e.target.value })
                          }
                          placeholder="+1 (555) 000-0000"
                          className="w-full px-4 py-3 bg-card border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-6 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition flex items-center justify-center gap-2"
                  >
                    Continue to Payment <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.form>
              )}

              {/* Payment Form */}
              {step === 'payment' && (
                <motion.form
                  onSubmit={handlePaymentSubmit}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-background border border-border rounded-3xl p-8"
                >
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                    Payment Method
                  </h2>

                  <div className="space-y-3 mb-6">
                    {['Credit Card', 'PayPal', 'Apple Pay'].map(method => (
                      <label key={method} className="flex items-center p-4 border border-border rounded-full cursor-pointer hover:bg-muted/50 transition">
                        <input type="radio" name="payment" defaultChecked={method === 'Credit Card'} className="mr-3" />
                        <span className="font-medium text-foreground">{method}</span>
                      </label>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="4532 1234 5678 9010"
                        className="w-full px-4 py-3 bg-card border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Expiry Date
                        </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 bg-card border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          CVV
                        </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-3 bg-card border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setStep('address')}
                      className="flex-1 py-3 bg-muted text-foreground font-semibold rounded-full hover:bg-muted/80 transition border border-border"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition flex items-center justify-center gap-2"
                    >
                      Review Order <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Confirmation */}
              {step === 'confirm' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-background border border-border rounded-3xl p-8"
                >
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                    Order Confirmation
                  </h2>

                  <div className="space-y-6">
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <p className="text-sm font-semibold text-foreground mb-2">Delivery Address</p>
                      <p className="text-muted-foreground">
                        {deliveryAddress.street}, {deliveryAddress.city} {deliveryAddress.zipCode}
                      </p>
                    </div>

                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <p className="text-sm font-semibold text-foreground mb-2">Estimated Delivery</p>
                      <p className="text-muted-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4" /> 30-45 minutes
                      </p>
                    </div>

                    <button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition disabled:opacity-50"
                    >
                      {isProcessing ? 'Processing...' : 'Place Order'}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="sticky top-20 bg-background border border-border rounded-3xl p-6"
              >
                <h3 className="font-serif text-xl font-bold text-foreground mb-4">Order Summary</h3>
                {remainingMs > 0 && (
                  <div className="mb-4 text-xs text-muted-foreground">
                    Cart expires in {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                  </div>
                )}

                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {items.map(item => {
                    const itemKey = getCartItemKey(item)
                    const menuItem = menuMap[item.id]
                    const sizeOptions = getSizeOptions(menuItem)
                    const extrasOptions = getAvailableExtras(menuItem)
                    const ingredients = getIngredients(menuItem)
                    const selectedExtras = item.extras ?? []
                    const removed = item.removedIngredients ?? []
                    return (
                      <div key={itemKey} className="rounded-2xl border border-border p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-foreground">{item.name}</p>
                            {item.size && <p className="text-xs text-muted-foreground">Size: {item.size}</p>}
                          </div>
                          <button
                            onClick={() => removeItem(itemKey)}
                            className="p-1 text-destructive hover:bg-destructive/10 rounded transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                            className="p-1 rounded-full border border-border hover:bg-muted transition"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-sm font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                            className="p-1 rounded-full border border-border hover:bg-muted transition"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <span className="ml-auto font-semibold text-foreground">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>

                        {sizeOptions.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Size</p>
                            <div className="flex flex-wrap gap-2">
                              {sizeOptions.map((s: any) => (
                                <button
                                  key={s.label}
                                  type="button"
                                  onClick={() => updateCartItem(item, { size: s.label })}
                                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                                    (item.size ?? sizeOptions[0].label) === s.label
                                      ? 'bg-foreground text-background border-transparent'
                                      : 'bg-background text-foreground/70 border-border hover:text-foreground'
                                  }`}
                                >
                                  {s.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {extrasOptions.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Add-ons</p>
                            <div className="flex flex-wrap gap-2">
                              {extrasOptions.map((ex: any) => {
                                const isActive = selectedExtras.some((e: any) => e.name === ex.name)
                                return (
                                  <button
                                    key={ex.name}
                                    type="button"
                                    onClick={() => {
                                      const next = isActive
                                        ? selectedExtras.filter((e: any) => e.name !== ex.name)
                                        : [...selectedExtras, ex]
                                      updateCartItem(item, { extras: next })
                                    }}
                                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                                      isActive
                                        ? 'bg-primary/10 text-primary border-primary/30'
                                        : 'bg-background text-foreground/70 border-border hover:text-foreground'
                                    }`}
                                  >
                                    {ex.name} +${Number(ex.price || 0).toFixed(2)}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {ingredients.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Ingredients</p>
                            <div className="flex flex-wrap gap-2">
                              {ingredients.map((ing: any) => {
                                const isRemovable = ing.removable
                                const isRemoved = removed.includes(ing.name)
                                return (
                                  <button
                                    key={ing.name}
                                    type="button"
                                    disabled={!isRemovable}
                                    onClick={() => {
                                      if (!isRemovable) return
                                      const next = isRemoved
                                        ? removed.filter((n: string) => n !== ing.name)
                                        : [...removed, ing.name]
                                      updateCartItem(item, { removedIngredients: next })
                                    }}
                                    className={`px-3 py-1 rounded-full text-[10px] font-semibold border transition ${
                                      !isRemovable
                                        ? 'bg-muted/50 text-muted-foreground border-border/60 cursor-not-allowed'
                                        : isRemoved
                                          ? 'bg-destructive/10 text-destructive border-destructive/30'
                                          : 'bg-background text-foreground/70 border-border hover:text-foreground'
                                    }`}
                                  >
                                    {ing.name}
                                    {isRemovable ? (isRemoved ? ' · removed' : ' · removable') : ' · fixed'}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="space-y-2 py-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold text-foreground">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Truck className="w-4 h-4" /> Delivery
                    </span>
                    <span className="font-semibold text-foreground">${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-semibold text-foreground">${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-border mt-4">
                  <span className="font-serif text-lg font-bold text-foreground">Total</span>
                  <span className="font-serif text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return <CheckoutContent />
}
