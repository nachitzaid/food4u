'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Header } from '@/components/header'
import { ArrowRight, Flame, Bike, Timer, Star, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { getDeals } from '@/services/firestore'
import { useAuth } from '@/context/auth-context'

const heroTags = ['Hot & fresh', 'Crispy', 'Grill-ready', 'Family combos']
const featureCards = [
  { title: 'Speedy Delivery', desc: 'Hot food at your door in under 30 minutes.', icon: Bike },
  { title: 'Flame-Grilled Taste', desc: 'Smoky, juicy, and packed with flavor.', icon: Flame },
  { title: 'Always Fresh', desc: 'Cooked to order, never sitting around.', icon: Timer },
]

interface Deal {
  id?: string
  menuItemId?: string
  title: string
  price?: number | string
  originalPrice?: number
  discountedPrice?: number
  discountPercent?: number
  desc?: string
  description?: string
  image?: string
}

export default function Home() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loadingDeals, setLoadingDeals] = useState(true)
  const { profile } = useAuth()
  const isAdmin = profile?.role === 'admin'
  const restaurantId = process.env.NEXT_PUBLIC_RESTAURANT_ID ?? 'demo-restaurant'

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoadingDeals(true)
        const items = await getDeals(restaurantId)
        if (items.length === 0 && isAdmin) {
          const { seedDeals } = await import('@/services/seed')
          await seedDeals(restaurantId)
          const refreshed = await getDeals(restaurantId)
          setDeals(refreshed as Deal[])
        } else {
          setDeals(items as Deal[])
        }
      } catch (error) {
        console.error('Failed to load deals:', error)
      } finally {
        setLoadingDeals(false)
      }
    }
    fetchDeals()
  }, [restaurantId, isAdmin])

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      <Header />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06),transparent_55%)]" />
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary/30 blur-[120px]" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-[140px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em]"
              >
                Big Taste. Fast Bites.
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-6 text-5xl md:text-7xl font-black leading-[0.95] tracking-tight"
              >
                Food4U <span className="text-primary">Stacks</span> the flavor.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-lg text-white/75 max-w-xl"
              >
                Fast food, done right. Crispy chicken, juicy burgers, and fries that stay hot. Built
                for cravings, made for speed.
              </motion.p>

              <div className="mt-6 flex flex-wrap gap-2">
                {heroTags.map((tag) => (
                  <span key={tag} className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30"
                >
                  Order now <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold hover:bg-white/10 transition"
                >
                  View menu
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-3 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  4.8 rating
                </div>
                <div className="h-1 w-1 rounded-full bg-white/40" />
                120k+ happy customers
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/10 bg-white/5 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1550317138-10000687a72b?q=80&w=1400"
                  alt="Burger hero"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -left-6 bottom-6 rounded-2xl bg-white text-black px-4 py-3 text-sm font-bold shadow-lg">
                From $4.99
              </div>
              <div className="absolute -right-6 top-6 rounded-2xl bg-primary text-primary-foreground px-4 py-3 text-sm font-bold shadow-lg">
                New combo
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-[#121212] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {featureCards.map((card) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.title}
                whileHover={{ y: -6 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <div className="h-12 w-12 rounded-2xl bg-primary/15 grid place-items-center text-primary mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">{card.title}</h3>
                <p className="mt-3 text-white/70">{card.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      <section className="bg-[#0b0b0b] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Trending Deals</p>
              <h2 className="text-3xl md:text-4xl font-black">Big flavor. Small price.</h2>
            </div>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2 text-sm font-semibold hover:bg-white/10 transition"
            >
              See all deals <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loadingDeals ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="mb-5 h-40 rounded-2xl bg-white/10 animate-pulse" />
                  <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
                  <div className="mt-3 h-6 w-3/4 bg-white/10 rounded animate-pulse" />
                  <div className="mt-3 h-4 w-2/3 bg-white/10 rounded animate-pulse" />
                  <div className="mt-6 h-8 w-full bg-white/10 rounded-full animate-pulse" />
                </div>
              ))
            ) : deals.length === 0 ? (
              <div className="md:col-span-3 rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
                <p className="text-white/70">No deals yet. Check back soon.</p>
              </div>
            ) : (
              deals.map((deal) => {
                const original = deal.originalPrice ?? (typeof deal.price === 'number' ? deal.price : 0)
                const discounted = deal.discountedPrice ?? (typeof deal.price === 'number' ? deal.price : 0)
                const hasNumbers = original > 0 || discounted > 0
                return (
                  <motion.div
                    key={deal.id ?? deal.title}
                    whileHover={{ y: -6 }}
                    className="rounded-3xl border border-white/10 bg-white/5 p-6"
                  >
                    <div className="mb-5 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                      {deal.image ? (
                        <img
                          src={deal.image}
                          alt={deal.title}
                          className="h-40 w-full object-cover"
                        />
                      ) : (
                        <div className="h-40 w-full bg-white/10" />
                      )}
                    </div>
                    <div className="text-xs uppercase tracking-[0.3em] text-white/60">Combo</div>
                    <h3 className="mt-2 text-2xl font-black">{deal.title}</h3>
                    <p className="mt-2 text-white/70">{deal.desc ?? deal.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      {hasNumbers ? (
                        <div className="flex flex-col">
                          <span className="text-xs text-white/50 line-through">${Number(original).toFixed(2)}</span>
                          <span className="text-primary font-black text-xl">${Number(discounted).toFixed(2)}</span>
                        </div>
                      ) : (
                        <span className="text-primary font-black text-xl">{deal.price}</span>
                      )}
                      <Link
                        href="/menu"
                        className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                      >
                        Add
                      </Link>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        </div>
      </section>

      <section className="bg-[#121212] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rounded-[2.5rem] border border-white/10 bg-white/5 p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Ready to eat?</p>
              <h3 className="text-3xl md:text-4xl font-black mt-2">Grab a combo in minutes</h3>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/menu"
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30"
              >
                Order now
              </Link>
              <Link
                href="/menu"
                className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold hover:bg-white/10 transition"
              >
                Build your meal
              </Link>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-3 text-sm text-white/70">
            <ShoppingBag className="h-4 w-4 text-primary" />
            Free delivery on orders over $20
          </div>
        </div>
      </section>
    </div>
  )
}
