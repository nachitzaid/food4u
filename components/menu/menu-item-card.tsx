'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useCart, CartItem } from '@/context/cart-context'
import Image from 'next/image'
import { Flame, Zap, Plus } from 'lucide-react'
import { CustomizeModal } from './customize-modal'

interface Ingredient {
  name: string
  removable: boolean
}

interface Extra {
  name: string
  price: number
}

interface MenuItemCardProps {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  isAvailable?: boolean
  calories?: number
  protein?: number
  ingredients?: Ingredient[]
  extras?: Extra[]
}

export function MenuItemCard({
  id,
  name,
  description,
  price,
  image,
  category,
  isAvailable = true,
  calories,
  protein,
  ingredients = [],
  extras = [],
}: MenuItemCardProps) {
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false)
  const { addItem, items } = useCart()

  // Track quantity based on items in cart with THIS base ID
  const quantity = items
    .filter((i: CartItem) => i.id === id)
    .reduce((sum: number, i: CartItem) => sum + i.quantity, 0)

  const handleAddToCart = (customizedItem: any) => {
    addItem({
      id: id,
      name: customizedItem.name,
      price: customizedItem.priceAtAdd,
      image: customizedItem.image,
      quantity: customizedItem.quantity,
      removedIngredients: customizedItem.removedIngredients,
      extras: customizedItem.extras,
    })
  }

  const handleAddDefault = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsCustomizeOpen(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      whileHover={{ translateY: -4 }}
      className={`bg-card border border-border rounded-2xl overflow-hidden transition ${!isAvailable ? 'opacity-50 pointer-events-none' : ''
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
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-serif font-semibold text-foreground line-clamp-1">
            {name}
          </h3>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
            {calories && (
              <span className="flex items-center gap-0.5 text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded">
                <Flame className="w-3 h-3" />
                {calories}
              </span>
            )}
            {protein && (
              <span className="flex items-center gap-0.5 text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                <Zap className="w-3 h-3" />
                {protein}G
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
          {description}
        </p>

        {ingredients.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {ingredients.slice(0, 3).map(ing => (
              <span key={ing.name} className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-sm">
                {ing.name}
              </span>
            ))}
            {ingredients.length > 3 && (
              <span className="text-[10px] text-muted-foreground">+{ingredients.length - 3}</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="font-serif text-lg font-bold text-primary">
            ${price.toFixed(2)}
          </span>

          <div className="flex items-center gap-2">
            {quantity > 0 && (
              <span className="text-xs font-bold text-primary bg-primary/10 w-6 h-6 rounded-full flex items-center justify-center">
                {quantity}
              </span>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCustomizeOpen(true)}
              disabled={!isAvailable}
              className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg flex items-center gap-1.5 text-xs font-bold hover:bg-primary/90 transition disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              {quantity > 0 ? 'Add More' : 'Add'}
            </motion.button>
          </div>
        </div>
      </div>

      <CustomizeModal
        item={{ id, name, description, price, image, calories, protein, ingredients, extras }}
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </motion.div>
  )
}
