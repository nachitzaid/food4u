'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Header } from '@/components/header'
import { ChevronRight, Truck, Clock } from 'lucide-react'
import { CartProvider, useCart } from '@/context/cart-context'
import Link from 'next/link'

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

function CheckoutContent() {
  const { items, subtotal, clearCart } = useCart()
  const [step, setStep] = useState<'address' | 'payment' | 'confirm'>('address')
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    zipCode: '',
    phone: '',
  })
  const [distance, setDistance] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  const deliveryFee = calculateDeliveryFee(distance)
  const tax = parseFloat((subtotal * 0.08).toFixed(2))
  const total = subtotal + deliveryFee + tax

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

  const handlePlaceOrder = async () => {
    setIsProcessing(true)
    // Simulate order placement
    await new Promise(resolve => setTimeout(resolve, 2000))
    clearCart()
    setIsProcessing(false)
    // Redirect to order tracking
    window.location.href = '/orders'
  }

  if (items.length === 0 && step === 'address') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="font-serif text-3xl font-bold text-foreground mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Add items to your cart before checking out</p>
          <Link
            href="/menu"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Progress Steps */}
          <div className="flex justify-between items-center mb-12">
            {['Address', 'Payment', 'Confirmation'].map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    (i === 0 && step === 'address') ||
                    (i === 1 && step === 'payment') ||
                    (i === 2 && step === 'confirm')
                      ? 'bg-primary text-primary-foreground'
                      : i < (['address', 'payment', 'confirm'].indexOf(step) ?? 0)
                      ? 'bg-accent text-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {i + 1}
                </motion.div>
                <div className={`flex-1 h-1 mx-2 ${i < 2 ? 'bg-border' : ''}`} />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Address Form */}
              {step === 'address' && (
                <motion.form
                  onSubmit={handleAddressSubmit}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-card border border-border rounded-2xl p-8"
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
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                          className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                          className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition flex items-center justify-center gap-2"
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
                  className="bg-card border border-border rounded-2xl p-8"
                >
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                    Payment Method
                  </h2>

                  <div className="space-y-3 mb-6">
                    {['Credit Card', 'PayPal', 'Apple Pay'].map(method => (
                      <label key={method} className="flex items-center p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition">
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
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                          className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setStep('address')}
                      className="flex-1 py-3 bg-secondary/20 text-foreground font-semibold rounded-lg hover:bg-secondary/30 transition border border-border"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition flex items-center justify-center gap-2"
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
                  className="bg-card border border-border rounded-2xl p-8"
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
                      className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
                    >
                      {isProcessing ? 'Processing...' : 'Place Order'}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="sticky top-20 bg-card border border-border rounded-2xl p-6"
              >
                <h3 className="font-serif text-xl font-bold text-foreground mb-4">Order Summary</h3>

                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-foreground">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
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
  return (
    <CartProvider>
      <CheckoutContent />
    </CartProvider>
  )
}
