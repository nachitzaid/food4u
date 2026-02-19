'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, X, Plus, Minus } from 'lucide-react'
import { useCart } from '@/context/cart-context'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export function CartSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const { items, subtotal, itemCount, removeItem, updateQuantity } = useCart()

  return (
    <>
      {/* Cart Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition flex items-center justify-center"
      >
        <div className="relative">
          <ShoppingCart className="w-6 h-6" />
          {itemCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-5 h-5 bg-accent text-foreground text-xs font-bold rounded-full flex items-center justify-center"
            >
              {itemCount}
            </motion.div>
          )}
        </div>
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed right-0 top-0 h-screen w-full max-w-sm bg-background z-50 shadow-lg flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-serif text-2xl font-bold text-foreground">Your Cart</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-muted rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingCart className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map(item => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex gap-4 p-3 bg-card border border-border rounded-xl"
                    >
                      <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground text-sm mb-1 leading-tight">
                          {item.name}
                        </h4>

                        {/* Customizations */}
                        {(item.removedIngredients?.length || item.extras?.length) ? (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {item.removedIngredients?.map(ing => (
                              <span key={ing} className="text-[10px] text-destructive bg-destructive/10 px-1 rounded">
                                No {ing}
                              </span>
                            ))}
                            {item.extras?.map(extra => (
                              <span key={extra.name} className="text-[10px] text-emerald-600 bg-emerald-600/10 px-1 rounded">
                                + {extra.name}
                              </span>
                            ))}
                          </div>
                        ) : null}

                        <p className="font-serif text-primary font-bold text-sm mb-2">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>

                        <div className="flex items-center gap-1 bg-primary/10 rounded-lg w-fit">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-primary/20 rounded transition"
                          >
                            <Minus className="w-3 h-3 text-primary" />
                          </button>
                          <span className="w-6 text-center text-xs font-semibold text-primary">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-primary/20 rounded transition"
                          >
                            <Plus className="w-3 h-3 text-primary" />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-destructive hover:bg-destructive/10 rounded transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-serif font-bold text-foreground">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition text-center"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
