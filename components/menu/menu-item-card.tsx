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
      whileHover={{ y: -8 }}
      className={`bg-white border-2 border-border rounded-3xl overflow-hidden transition shadow-md hover:shadow-lg ${
        !isAvailable ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      <div className="relative w-full h-48 overflow-hidden bg-muted">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover hover:scale-105 transition duration-300"
        />
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Sold Out</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-1">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            ${price.toFixed(2)}
          </span>

          {quantity === 0 ? (
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAdd}
              disabled={!isAvailable}
              className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center hover:opacity-90 transition disabled:opacity-50 font-bold shadow-lg"
            >
              <Plus className="w-6 h-6" />
            </motion.button>
          ) : (
            <div className="flex items-center gap-2 bg-primary text-white rounded-full px-2 py-2 shadow-lg">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleRemove}
                className="w-8 h-8 flex items-center justify-center hover:bg-primary/80 rounded-full transition font-bold"
              >
                <Minus className="w-5 h-5" />
              </motion.button>
              <span className="w-8 text-center font-bold text-base">
                {quantity}
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAdd}
                className="w-8 h-8 flex items-center justify-center hover:bg-primary/80 rounded-full transition font-bold"
              >
                <Plus className="w-5 h-5" />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
