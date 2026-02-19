'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Zap, Users, Clock, MapPin, ShoppingCart } from 'lucide-react'
import Link from 'next/link'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
}

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-bold text-primary-foreground text-lg">F</div>
            <span className="text-2xl font-bold text-foreground">Food4U</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-3"
          >
            <Link href="/auth/login" className="px-6 py-2 text-sm font-semibold text-foreground hover:bg-muted rounded-lg transition">Login</Link>
            <Link href="/auth/signup" className="px-6 py-2 text-sm font-semibold text-primary-foreground bg-primary hover:opacity-90 rounded-lg transition">Sign Up</Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-white via-white to-muted/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/15 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="text-center"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight"
            >
              Food Delivery <br />
              <span className="text-primary">Made Simple</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto"
            >
              Order your favorite meals with real-time tracking and fast delivery. Everything you need in one beautiful app.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Link href="/menu" className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition transform hover:scale-105 flex items-center justify-center gap-2">
                Start Ordering <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/auth/signup" className="px-8 py-4 bg-muted text-foreground font-bold rounded-xl hover:bg-muted/80 transition border-2 border-foreground/10">
                Create Account
              </Link>
            </motion.div>

            {/* Feature Badges */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap gap-3 justify-center mb-12"
            >
              {['Fast Delivery', 'Live Tracking', 'Quality Food', 'Easy Payment'].map((badge, i) => (
                <span key={i} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
                  {badge}
                </span>
              ))}
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-3 gap-4"
            >
              {[
                { number: '50K+', label: 'Happy Customers' },
                { number: '500+', label: 'Restaurants' },
                { number: '100K+', label: 'Orders Daily' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -8 }}
                  className="p-4 bg-white border-2 border-border rounded-2xl shadow-sm"
                >
                  <div className="text-3xl md:text-4xl font-bold text-primary">{stat.number}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Why Choose Food4U?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need for seamless food ordering
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Lightning Fast',
                description: 'Instant order processing'
              },
              {
                icon: <MapPin className="w-8 h-8" />,
                title: 'Live Tracking',
                description: 'Real-time delivery updates'
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Easy to Use',
                description: 'Intuitive for everyone'
              },
              {
                icon: <ShoppingCart className="w-8 h-8" />,
                title: 'Smart Cart',
                description: 'Save & manage orders'
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="p-6 bg-primary/5 border-2 border-primary/20 rounded-2xl hover:border-primary/40 transition text-center"
              >
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              3 Simple Steps
            </h2>
            <p className="text-lg text-muted-foreground">Get started in minutes</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                num: '1',
                title: 'Browse Menu',
                description: 'Explore delicious food options from top restaurants'
              },
              {
                num: '2',
                title: 'Add to Cart',
                description: 'Select your favorite items and customize them'
              },
              {
                num: '3',
                title: 'Order & Track',
                description: 'Complete payment and track delivery in real-time'
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                viewport={{ once: true }}
              >
                <div className="bg-white p-8 rounded-2xl border-2 border-border">
                  <div className="w-12 h-12 bg-primary text-white font-bold text-lg rounded-full flex items-center justify-center mb-4">
                    {item.num}
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-primary/80">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Order Your Favorite Food Now
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8">
              Join thousands of customers enjoying fast, reliable delivery
            </p>
            <Link href="/menu" className="inline-block px-8 py-4 bg-primary-foreground text-primary font-bold rounded-xl hover:opacity-90 transition transform hover:scale-105">
              Start Ordering Today
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-bold">F</div>
                <span className="text-2xl font-bold">Food4U</span>
              </div>
              <p className="text-gray-300">Fast delivery, great food</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-primary">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/menu" className="hover:text-white transition">Order Food</Link></li>
                <li><Link href="/auth/signup" className="hover:text-white transition">Sign Up</Link></li>
                <li><Link href="/auth/login" className="hover:text-white transition">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-primary">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-primary">Legal</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-sm text-gray-400 text-center">
            <p>&copy; 2024 Food4U. All rights reserved. | Building the future of food delivery</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
