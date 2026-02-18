'use client'

import { motion } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/context/cart-context'
import Image from 'next/image'

interface MenuItemCardProps {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  isAvailable?: boolean
}

export function MenuItemCard({
  id,
  name,
  description,
  price,
  image,
  category,
  isAvailable = true,
}: MenuItemCardProps) {
  const [quantity, setQuantity] = useState(0)
  const { addItem, removeItem } = useCart()

  const handleAdd = () => {
    setQuantity(q => q + 1)
    addItem({
      id,
      name,
      price,
      image,
      quantity: 1,
    })
  }

  const handleRemove = () => {
    if (quantity > 0) {
      setQuantity(q => q - 1)
      removeItem(id)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      whileHover={{ translateY: -4 }}
      className={`bg-card border border-border rounded-2xl overflow-hidden transition ${
        !isAvailable ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      <div className="relative w-full h-40 overflow-hidden bg-muted">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover hover:scale-110 transition duration-300"
        />
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-semibold">Sold Out</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-serif font-semibold text-foreground mb-1 line-clamp-1">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <span className="font-serif text-lg font-bold text-primary">
            ${price.toFixed(2)}
          </span>

          {quantity === 0 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAdd}
              disabled={!isAvailable}
              className="w-10 h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center hover:bg-primary/90 transition disabled:opacity-50"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          ) : (
            <div className="flex items-center gap-2 bg-primary/10 rounded-lg p-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRemove}
                className="w-8 h-8 flex items-center justify-center hover:bg-primary/20 rounded transition"
              >
                <Minus className="w-4 h-4 text-primary" />
              </motion.button>
              <span className="w-6 text-center font-semibold text-sm text-primary">
                {quantity}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAdd}
                className="w-8 h-8 flex items-center justify-center hover:bg-primary/20 rounded transition"
              >
                <Plus className="w-4 h-4 text-primary" />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
