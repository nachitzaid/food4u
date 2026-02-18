'use client'

import { motion } from 'framer-motion'
import { ChefHat, Clock, MapPin, TrendingUp, Zap, Shield, Lock } from 'lucide-react'
import Link from 'next/link'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <ChefHat className="w-8 h-8 text-primary" />
            <span className="font-serif text-2xl font-bold text-foreground">Food4U</span>
          </motion.div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">Features</Link>
            <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition">How It Works</Link>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-3"
          >
            <button className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition">Login</button>
            <button className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition">Get Started</button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="max-w-3xl mx-auto text-center"
          >
            <motion.h1
              variants={fadeInUp}
              className="font-serif text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight"
            >
              Premium Restaurant <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Ordering System
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              Deliver exceptional dining experiences with Food4U—the secure, real-time restaurant ordering platform built for modern restaurants.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button className="px-8 py-4 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition transform hover:scale-105 active:scale-95">
                Start Your Free Trial
              </button>
              <button className="px-8 py-4 bg-secondary/20 text-foreground font-medium rounded-lg hover:bg-secondary/30 transition border border-border">
                Watch Demo
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-3 gap-4 mt-16"
            >
              {[
                { number: '10K+', label: 'Happy Orders' },
                { number: '24/7', label: 'Live Support' },
                { number: '99.9%', label: 'Uptime' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ translateY: -5 }}
                  className="p-4 bg-card border border-border rounded-xl"
                >
                  <div className="font-serif text-2xl font-bold text-primary">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to run a modern restaurant ordering system
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Zap className="w-6 h-6" />,
                title: 'Real-Time Updates',
                description: 'Live order tracking and instant notifications for customers and staff'
              },
              {
                icon: <MapPin className="w-6 h-6" />,
                title: 'Smart Delivery',
                description: 'Dynamic delivery fees with distance calculation and live tracking'
              },
              {
                icon: <Lock className="w-6 h-6" />,
                title: 'Secure & Reliable',
                description: 'Enterprise-grade security with Firebase authentication'
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: 'Analytics Dashboard',
                description: 'Detailed insights into orders, revenue, and customer behavior'
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: 'Instant Setup',
                description: 'Get your restaurant online in minutes, not days'
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Payment Processing',
                description: 'Secure payment integration with multiple payment methods'
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ translateY: -8 }}
                className="p-6 bg-background border border-border rounded-2xl hover:border-primary/50 transition"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              How Food4U Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to start accepting orders
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create Your Menu',
                description: 'Upload your food items with images, descriptions, and prices'
              },
              {
                step: '02',
                title: 'Receive Orders',
                description: 'Get real-time notifications and manage orders from your dashboard'
              },
              {
                step: '03',
                title: 'Track Delivery',
                description: 'Real-time order tracking with customer notifications'
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-card border border-border p-8 rounded-2xl">
                  <div className="font-serif text-5xl font-bold text-primary/20 mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-8 border-t-2 border-r-2 border-primary/50 transform -translate-y-1/2 rotate-45" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5 border-y border-border">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ready to Transform Your Restaurant?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of restaurants already using Food4U to streamline their operations
            </p>
            <button className="px-8 py-4 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition transform hover:scale-105 active:scale-95">
              Get Started Today
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ChefHat className="w-6 h-6" />
                <span className="font-serif font-bold">Food4U</span>
              </div>
              <p className="text-sm opacity-75">Premium restaurant ordering system</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm opacity-75">
                <li><a href="#" className="hover:opacity-100 transition">Features</a></li>
                <li><a href="#" className="hover:opacity-100 transition">Pricing</a></li>
                <li><a href="#" className="hover:opacity-100 transition">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm opacity-75">
                <li><a href="#" className="hover:opacity-100 transition">About</a></li>
                <li><a href="#" className="hover:opacity-100 transition">Blog</a></li>
                <li><a href="#" className="hover:opacity-100 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm opacity-75">
                <li><a href="#" className="hover:opacity-100 transition">Privacy</a></li>
                <li><a href="#" className="hover:opacity-100 transition">Terms</a></li>
                <li><a href="#" className="hover:opacity-100 transition">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-secondary-foreground/20 pt-8 text-sm text-center opacity-75">
            <p>&copy; 2024 Food4U. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
