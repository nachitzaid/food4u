'use client'

import { motion } from 'framer-motion'
import { Header } from '@/components/header'
import { Truck, Clock, MapPin, CheckCircle2, Phone, MessageSquare, ChefHat, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { subscribeToUserOrders } from '@/services/firestore'
import { auth } from '@/services/firebase'
import { onAuthStateChanged } from 'firebase/auth'

interface OrderItem {
  name: string
  quantity: number
  price?: number
}

interface Order {
  id: string
  status: 'pending' | 'accepted' | 'preparing' | 'out-for-delivery' | 'delivered'
  items: OrderItem[]
  total: number
  subtotal?: number
  deliveryFee?: number
  tax?: number
  deliveryAddress?: {
    street: string
    city: string
    zipCode: string
    phone: string
  }
  createdAt: Date
}

const STATUS_CONFIG = {
  pending: {
    label: 'Order Confirmed',
    icon: Clock,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
  accepted: {
    label: 'Accepted',
    icon: CheckCircle2,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  preparing: {
    label: 'Preparing',
    icon: ChefHat,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  'out-for-delivery': {
    label: 'Out for Delivery',
    icon: Truck,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  delivered: {
    label: 'Delivered',
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
}

const STATUSES = ['pending', 'accepted', 'preparing', 'out-for-delivery', 'delivered'] as const

function OrderCard({ order }: { order: Order }) {
  const currentStatusIndex = STATUSES.indexOf(order.status)
  const statusConfig = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending
  const StatusIcon = statusConfig.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ translateY: -4 }}
      className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-foreground">
            #{order.id.slice(0, 8).toUpperCase()}
          </h3>
          <p className="text-sm text-muted-foreground">
            {order.createdAt instanceof Date
              ? order.createdAt.toLocaleDateString()
              : new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${statusConfig.bgColor}`}>
          <StatusIcon className={`w-6 h-6 ${statusConfig.color}`} />
        </div>
      </div>

      {/* Status Progress */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          {STATUSES.map((status, i) => {
            const isActive = i <= currentStatusIndex
            return (
              <motion.div
                key={status}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`w-2 h-2 rounded-full ${isActive ? 'bg-primary' : 'bg-border'}`}
              />
            )
          })}
        </div>
        <p className="text-sm font-medium text-foreground">{statusConfig.label}</p>
      </div>

      {/* Order Items */}
      <div className="space-y-2 mb-4 p-3 bg-muted/30 rounded-lg">
        {Array.isArray(order.items) && order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-foreground">{item.name}</span>
            <span className="text-muted-foreground">x{item.quantity}</span>
          </div>
        ))}
      </div>

      {/* Delivery Address */}
      {order.deliveryAddress && (
        <div className="flex items-start gap-2 text-sm text-muted-foreground mb-4">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>
            {order.deliveryAddress.street}, {order.deliveryAddress.city} {order.deliveryAddress.zipCode}
          </span>
        </div>
      )}

      <div className="border-t border-border pt-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Total</span>
          <span className="font-serif text-xl font-bold text-primary">
            ${Number(order.total).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg transition flex items-center justify-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Message
        </button>
        <button className="flex-1 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg transition flex items-center justify-center gap-2">
          <Phone className="w-4 h-4" />
          Call
        </button>
      </div>
    </motion.div>
  )
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState<'active' | 'past'>('active')

  // Listen for auth state
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, user => {
      setUserId(user?.uid ?? null)
      if (!user) setLoading(false)
    })
    return () => unsubAuth()
  }, [])

  // Subscribe to real-time orders when user is known
  useEffect(() => {
    if (!userId) return

    setLoading(true)
    const unsubOrders = subscribeToUserOrders(userId, (rawOrders) => {
      setOrders(rawOrders as unknown as Order[])
      setLoading(false)
    })

    return () => unsubOrders()
  }, [userId])

  const activeOrders = orders.filter(o => o.status !== 'delivered')
  const pastOrders = orders.filter(o => o.status === 'delivered')

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_rgba(240,242,245,0.9)_45%,_rgba(230,233,236,1)_100%)]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="rounded-[2.5rem] bg-card/90 border border-border/60 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.4)] p-6 lg:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-2">
                Your Orders
              </h1>
              <p className="text-muted-foreground">Track your current and past orders</p>
            </motion.div>

            <div className="flex items-center gap-2 rounded-full bg-muted/40 p-1">
              <button
                onClick={() => setSelectedTab('active')}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition ${selectedTab === 'active'
                    ? 'bg-foreground text-background shadow'
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                Active ({activeOrders.length})
              </button>
              <button
                onClick={() => setSelectedTab('past')}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition ${selectedTab === 'past'
                    ? 'bg-foreground text-background shadow'
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                Past ({pastOrders.length})
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : !userId ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <CheckCircle2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground mb-4">
                Sign in to see your orders
              </p>
              <Link
                href="/auth/login"
                className="inline-block px-6 py-2 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary/90 transition"
              >
                Sign In
              </Link>
            </motion.div>
          ) : selectedTab === 'active' ? (
            activeOrders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">No active orders</p>
                <Link
                  href="/menu"
                  className="inline-block mt-4 px-6 py-2 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary/90 transition"
                >
                  Order Now
                </Link>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {activeOrders.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </motion.div>
            )
          ) : pastOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <CheckCircle2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">No past orders</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {pastOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
