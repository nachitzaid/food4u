'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, MapPin, Clock, Heart, Flame } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface MenuItem {
  id: string
  name: string
  price: number
  image: string
  description: string
  rating: number
  reviews: number
  deliveryTime: string
  distance: string
  tags: string[]
  ingredients: string[]
  nutritionalInfo?: {
    calories: number
    protein: number
    fat: number
    carbs: number
  }
  sizes?: Array<{ size: string; label: string }>
  restaurant?: {
    name: string
    distance: string
  }
}

interface MenuItemModalProps {
  item: MenuItem | null
  isOpen: boolean
  onClose: () => void
  onAddToCart?: (item: MenuItem, quantity: number, size?: string) => void
}

export function MenuItemModal({ item, isOpen, onClose, onAddToCart }: MenuItemModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('M')
  const [isFavorite, setIsFavorite] = useState(false)

  if (!item) return null

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(item, quantity, selectedSize)
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                {/* Left Side - Image */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-col items-center justify-center"
                >
                  <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 mb-6">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Nutritional Info */}
                  {item.nutritionalInfo && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="w-full bg-muted/30 rounded-2xl p-4 border-2 border-border"
                    >
                      <p className="text-sm font-bold text-foreground mb-3">Nutritional Value per 100g</p>
                      <div className="grid grid-cols-4 gap-3 text-center">
                        <div>
                          <p className="text-xl font-bold text-primary">{item.nutritionalInfo.calories}</p>
                          <p className="text-xs text-muted-foreground">kcal</p>
                        </div>
                        <div>
                          <p className="text-xl font-bold text-primary">{item.nutritionalInfo.protein}g</p>
                          <p className="text-xs text-muted-foreground">protein</p>
                        </div>
                        <div>
                          <p className="text-xl font-bold text-primary">{item.nutritionalInfo.fat}g</p>
                          <p className="text-xs text-muted-foreground">fat</p>
                        </div>
                        <div>
                          <p className="text-xl font-bold text-primary">{item.nutritionalInfo.carbs}g</p>
                          <p className="text-xs text-muted-foreground">carbs</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* Right Side - Details */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-col"
                >
                  {/* Header with Close Button */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h1 className="text-4xl font-bold text-foreground mb-2">{item.name}</h1>
                      <p className="text-muted-foreground text-base leading-relaxed">{item.description}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onClose}
                      className="p-2 hover:bg-muted rounded-full transition flex-shrink-0 ml-4"
                    >
                      <X className="w-6 h-6 text-foreground" />
                    </motion.button>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {item.tags.map((tag) => (
                      <span key={tag} className="px-4 py-2 bg-primary text-white font-semibold text-sm rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Rating and Info */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="p-4 bg-muted/20 rounded-2xl border-2 border-border"
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="w-5 h-5 fill-primary text-primary" />
                        <p className="font-bold text-lg text-foreground">{item.rating}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.reviews} reviews</p>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -4 }}
                      className="p-4 bg-muted/20 rounded-2xl border-2 border-border"
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <Clock className="w-5 h-5 text-primary" />
                        <p className="font-bold text-lg text-foreground">{item.deliveryTime}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">delivery</p>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -4 }}
                      className="p-4 bg-muted/20 rounded-2xl border-2 border-border"
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <MapPin className="w-5 h-5 text-primary" />
                        <p className="font-bold text-lg text-foreground">{item.distance}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">from store</p>
                    </motion.div>
                  </div>

                  {/* Size Selection */}
                  {item.sizes && (
                    <div className="mb-6">
                      <p className="text-sm font-bold text-foreground mb-3">SIZE</p>
                      <div className="grid grid-cols-3 gap-3">
                        {item.sizes.map((size) => (
                          <motion.button
                            key={size.size}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedSize(size.size)}
                            className={`py-3 px-4 rounded-2xl font-bold transition border-2 ${
                              selectedSize === size.size
                                ? 'bg-primary text-white border-primary'
                                : 'bg-muted/20 text-foreground border-border hover:border-primary'
                            }`}
                          >
                            {size.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ingredients */}
                  <div className="mb-6">
                    <p className="text-sm font-bold text-foreground mb-3">Ingredients</p>
                    <div className="bg-muted/10 rounded-2xl p-4 border-2 border-border">
                      <p className="text-sm text-foreground leading-relaxed">
                        {item.ingredients.join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Price and Quantity */}
                  <div className="flex items-center gap-4 mb-6 mt-auto">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Price</p>
                      <p className="text-4xl font-bold text-primary">${item.price.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center gap-2 bg-primary/10 rounded-full p-2 border-2 border-primary ml-auto">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center font-bold text-primary hover:bg-primary/20 rounded-full transition"
                      >
                        -
                      </motion.button>
                      <p className="w-8 text-center font-bold text-primary text-lg">{quantity}</p>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center font-bold text-primary hover:bg-primary/20 rounded-full transition"
                      >
                        +
                      </motion.button>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition border-2 ${
                        isFavorite
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'bg-muted/20 border-border text-foreground hover:border-primary'
                      }`}
                    >
                      <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToCart}
                      className="flex-1 bg-primary text-white font-bold py-4 rounded-2xl hover:opacity-90 transition text-lg"
                    >
                      Add to Cart
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
