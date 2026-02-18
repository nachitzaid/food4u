'use client'

import { motion } from 'framer-motion'
import { ChefHat, BarChart3, ShoppingCart, Users, TrendingUp, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

interface AdminOrder {
  id: string
  status: 'pending' | 'accepted' | 'preparing' | 'out-for-delivery' | 'delivered'
  items: string[]
  total: number
  customer: string
  phone: string
  createdAt: Date
}

// Mock admin data
const MOCK_ADMIN_ORDERS: AdminOrder[] = [
  {
    id: 'ORD-001',
    status: 'pending',
    items: ['Grilled Salmon Fillet x1', 'Caesar Salad x2'],
    total: 52.97,
    customer: 'John Doe',
    phone: '+1 (555) 000-0001',
    createdAt: new Date(),
  },
  {
    id: 'ORD-002',
    status: 'preparing',
    items: ['Ribeye Steak x1', 'Truffle Risotto x1'],
    total: 57.98,
    customer: 'Jane Smith',
    phone: '+1 (555) 000-0002',
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    id: 'ORD-003',
    status: 'out-for-delivery',
    items: ['Chocolate Lava Cake x1'],
    total: 9.99,
    customer: 'Bob Johnson',
    phone: '+1 (555) 000-0003',
    createdAt: new Date(Date.now() - 45 * 60 * 1000),
  },
]

const STATUS_COLORS = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  accepted: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  preparing: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  'out-for-delivery': 'bg-green-500/10 text-green-500 border-green-500/20',
  delivered: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<AdminOrder[]>(MOCK_ADMIN_ORDERS)
  const [isOpen, setIsOpen] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const handleStatusUpdate = (orderId: string, newStatus: AdminOrder['status']) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    )
    if (soundEnabled && newStatus === 'accepted') {
      // Play notification sound (mock)
      console.log('🔔 Order notification sound would play here')
    }
  }

  const stats = [
    {
      label: 'Pending Orders',
      value: orders.filter(o => o.status === 'pending').length,
      icon: AlertCircle,
      color: 'text-yellow-500',
    },
    {
      label: 'In Preparation',
      value: orders.filter(o => o.status === 'preparing').length,
      icon: ChefHat,
      color: 'text-purple-500',
    },
    {
      label: 'Out for Delivery',
      value: orders.filter(o => o.status === 'out-for-delivery').length,
      icon: ShoppingCart,
      color: 'text-green-500',
    },
    {
      label: 'Revenue Today',
      value: `$${orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-emerald-500',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="w-8 h-8 text-primary" />
            <span className="font-serif text-2xl font-bold text-foreground">Food4U Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                soundEnabled
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}
            >
              🔔 {soundEnabled ? 'On' : 'Off'}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition"
            >
              {isOpen ? 'Close' : 'Open'} Restaurant
            </button>
            <button className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition">
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${
          isOpen
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
            : 'bg-destructive/10 border-destructive/20 text-destructive'
        } border-b px-4 sm:px-6 lg:px-8 py-3 text-center font-semibold`}
      >
        Restaurant is {isOpen ? 'OPEN' : 'CLOSED'}
      </motion.div>

      {/* Stats Grid */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs md:text-sm text-muted-foreground font-medium">
                      {stat.label}
                    </p>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className="font-serif text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Orders Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl font-bold text-foreground">Current Orders</h2>
            <div className="flex gap-3">
              <Link
                href="/admin/menu"
                className="px-4 py-2 bg-card border border-border text-foreground font-medium rounded-lg hover:border-primary/50 transition"
              >
                Manage Menu
              </Link>
              <button className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition">
                View Analytics
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {orders.map((order, i) => {
              const orderColor = STATUS_COLORS[order.status]
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Order Info */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="font-serif text-xl font-bold text-foreground">
                          {order.id}
                        </h3>
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${orderColor} capitalize`}
                        >
                          {order.status.replace('-', ' ')}
                        </motion.span>
                      </div>

                      <div className="space-y-2 text-sm">
                        <p className="text-foreground font-medium">{order.customer}</p>
                        <p className="text-muted-foreground">{order.phone}</p>
                        <p className="text-muted-foreground text-xs">
                          {order.createdAt.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    {/* Items */}
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-2">Items</p>
                      <div className="space-y-1">
                        {order.items.map((item, j) => (
                          <p key={j} className="text-sm text-muted-foreground">
                            • {item}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        Total: ${order.total.toFixed(2)}
                      </p>

                      <div className="flex flex-col gap-2 mt-2">
                        {order.status === 'pending' && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleStatusUpdate(order.id, 'accepted')}
                            className="px-4 py-2 bg-green-500/10 text-green-500 font-semibold rounded-lg hover:bg-green-500/20 border border-green-500/20 transition"
                          >
                            Accept Order
                          </motion.button>
                        )}

                        {(order.status === 'pending' || order.status === 'accepted') && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleStatusUpdate(order.id, 'preparing')}
                            className="px-4 py-2 bg-purple-500/10 text-purple-500 font-semibold rounded-lg hover:bg-purple-500/20 border border-purple-500/20 transition"
                          >
                            Start Preparing
                          </motion.button>
                        )}

                        {order.status === 'preparing' && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleStatusUpdate(order.id, 'out-for-delivery')}
                            className="px-4 py-2 bg-green-500/10 text-green-500 font-semibold rounded-lg hover:bg-green-500/20 border border-green-500/20 transition"
                          >
                            Ready for Delivery
                          </motion.button>
                        )}

                        {order.status === 'out-for-delivery' && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleStatusUpdate(order.id, 'delivered')}
                            className="px-4 py-2 bg-emerald-500/10 text-emerald-500 font-semibold rounded-lg hover:bg-emerald-500/20 border border-emerald-500/20 transition"
                          >
                            Mark Delivered
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {orders.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <CheckCircle2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">All orders have been completed</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
