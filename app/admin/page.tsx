'use client'

import { motion } from 'framer-motion'
import { Header } from '@/components/header'
import {
  BarChart3, ShoppingCart, TrendingUp, Clock, CheckCircle2,
  AlertCircle, ChefHat, Loader2, Users, Mail, Phone, Calendar
} from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { subscribeToAllOrders, updateOrderStatus } from '@/services/firestore'
import { subscribeToUsers } from '@/services/auth'

type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'out-for-delivery' | 'delivered'

interface OrderItem {
  name: string
  quantity: number
  price?: number
  removedIngredients?: string[]
  extras?: { name: string; price: number }[]
}

interface AdminOrder {
  id: string
  status: OrderStatus
  items: OrderItem[]
  total: number
  deliveryAddress?: {
    street: string
    city: string
    zipCode: string
    phone: string
  }
  userId?: string
  customerName?: string
  customerEmail?: string
  createdAt: Date
}

interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  lastLoginAt?: Date
  createdAt?: Date
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  accepted: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  preparing: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  'out-for-delivery': 'bg-green-500/10 text-green-500 border-green-500/20',
  delivered: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'orders' | 'users'>('orders')
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // Real-time subscriptions
  useEffect(() => {
    const unsubOrders = subscribeToAllOrders((rawOrders) => {
      setOrders(rawOrders as unknown as AdminOrder[])
      if (activeTab === 'orders') setLoading(false)
    })
    const unsubUsers = subscribeToUsers((rawUsers) => {
      setUsers(rawUsers as unknown as UserProfile[])
      if (activeTab === 'users') setLoading(false)
    })
    return () => {
      unsubOrders()
      unsubUsers()
    }
  }, [activeTab])

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId)
    try {
      await updateOrderStatus(orderId, newStatus)
    } catch (err) {
      console.error('Failed to update order status:', err)
    } finally {
      setUpdatingId(null)
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
      value: `$${orders
        .filter(o => {
          const d = o.createdAt instanceof Date ? o.createdAt : new Date(o.createdAt)
          return d.toDateString() === new Date().toDateString()
        })
        .reduce((sum, o) => sum + Number(o.total ?? 0), 0)
        .toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-emerald-500',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${isOpen
          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
          : 'bg-destructive/10 border-destructive/20 text-destructive'
          } border-b px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between`}
      >
        <span className="font-semibold">Restaurant is {isOpen ? 'OPEN' : 'CLOSED'}</span>
        <button
          onClick={() => setIsOpen(v => !v)}
          className="text-sm underline opacity-70 hover:opacity-100 transition"
        >
          Toggle
        </button>
      </motion.div>

      {/* Stats Grid */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card border border-border rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs md:text-sm text-muted-foreground font-medium">
                  Total Users
                </p>
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <p className="font-serif text-2xl font-bold text-foreground">
                {users.length}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-1 bg-muted p-1 rounded-xl w-fit">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'orders'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                Orders
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'users'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                Users
              </button>
            </div>

            <div className="flex gap-3">
              <Link
                href="/admin/menu"
                className="px-4 py-2 bg-card border border-border text-foreground font-medium rounded-lg hover:border-primary/50 transition flex items-center gap-2"
              >
                <ChefHat className="w-4 h-4" />
                Manage Menu
              </Link>
              <Link
                href="/admin/analytics"
                className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : activeTab === 'orders' ? (
            orders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-card border border-border border-dashed rounded-2xl"
              >
                <CheckCircle2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground font-serif">No orders yet today</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {orders.map((order, i) => {
                  const orderColor = STATUS_COLORS[order.status] ?? STATUS_COLORS.pending
                  const isUpdating = updatingId === order.id
                  const createdAt = order.createdAt instanceof Date
                    ? order.createdAt
                    : new Date(order.createdAt)

                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:shadow-primary/5 transition-all"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Status & Info */}
                        <div className="md:col-span-3">
                          <div className="flex items-center gap-3 mb-4">
                            <h3 className="font-serif text-xl font-bold text-foreground">
                              #{order.id.slice(0, 6).toUpperCase()}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${orderColor} uppercase tracking-wider`}>
                              {order.status.replace('-', ' ')}
                            </span>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                              <Users className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                              <div>
                                <p className="font-bold text-foreground leading-none">{order.customerName || 'Guest'}</p>
                                <p className="text-xs text-muted-foreground">{order.customerEmail || 'No email'}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Phone className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                              <p className="text-foreground">{order.deliveryAddress?.phone || 'N/A'}</p>
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {createdAt.toLocaleTimeString()} — {createdAt.toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        {/* Items */}
                        <div className="md:col-span-6 border-l border-border px-6">
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Order Items</p>
                          <div className="space-y-3">
                            {order.items.map((item, j) => (
                              <div key={j} className="flex flex-col">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded font-bold text-primary">
                                    {item.quantity}x
                                  </span>
                                  <span className="text-sm font-semibold text-foreground">{item.name}</span>
                                </div>
                                {(item.removedIngredients?.length || item.extras?.length) && (
                                  <div className="flex flex-wrap gap-1 mt-1 ml-9">
                                    {item.removedIngredients?.map(r => (
                                      <span key={r} className="text-[10px] bg-destructive/5 text-destructive border border-destructive/10 px-1.5 rounded">NO {r}</span>
                                    ))}
                                    {item.extras?.map(e => (
                                      <span key={e.name} className="text-[10px] bg-emerald-500/5 text-emerald-600 border border-emerald-500/10 px-1.5 rounded">+{e.name}</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="md:col-span-3 flex flex-col justify-between items-end border-l border-border pl-6">
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-1">Total Amount</p>
                            <p className="text-2xl font-serif font-bold text-primary">${Number(order.total || 0).toFixed(2)}</p>
                          </div>

                          <div className="w-full space-y-2 mt-4">
                            {isUpdating ? (
                              <div className="flex items-center justify-center py-2 text-sm text-muted-foreground bg-muted/50 rounded-lg">
                                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Updating…
                              </div>
                            ) : (
                              <>
                                {order.status === 'pending' && (
                                  <button
                                    onClick={() => handleStatusUpdate(order.id, 'accepted')}
                                    className="w-full py-2 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-lg font-bold text-xs hover:bg-emerald-500/20 transition-all uppercase"
                                  >
                                    Accept Order
                                  </button>
                                )}
                                {(order.status === 'pending' || order.status === 'accepted') && (
                                  <button
                                    onClick={() => handleStatusUpdate(order.id, 'preparing')}
                                    className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-bold text-xs hover:bg-primary/90 transition-all uppercase"
                                  >
                                    Start Preparing
                                  </button>
                                )}
                                {order.status === 'preparing' && (
                                  <button
                                    onClick={() => handleStatusUpdate(order.id, 'out-for-delivery')}
                                    className="w-full py-2 bg-blue-500 text-white rounded-lg font-bold text-xs hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 uppercase"
                                  >
                                    Ready for Delivery
                                  </button>
                                )}
                                {order.status === 'out-for-delivery' && (
                                  <button
                                    onClick={() => handleStatusUpdate(order.id, 'delivered')}
                                    className="w-full py-2 bg-emerald-600 text-white rounded-lg font-bold text-xs hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 uppercase"
                                  >
                                    Mark Delivered
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )
          ) : (
            /* Users Table */
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Customer</th>
                      <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Email</th>
                      <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Last Activity</th>
                      <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-right">Registered</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users.map((user, i) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs shrink-0">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-foreground">{user.name}</p>
                              <span className="text-[10px] font-bold uppercase text-muted-foreground bg-muted px-1.5 py-0.5 rounded leading-none">
                                {user.role}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="w-3.5 h-3.5" />
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                            <Calendar className="w-3.5 h-3.5" />
                            {user.lastLoginAt ? user.lastLoginAt.toLocaleString() : 'Never'}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-xs text-muted-foreground">
                          {user.createdAt ? user.createdAt.toLocaleDateString() : 'N/A'}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
