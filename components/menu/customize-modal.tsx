'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Info, Flame, Zap } from 'lucide-react'

interface Ingredient {
    name: string
    removable: boolean
}

interface Extra {
    name: string
    price: number
}

interface MenuItem {
    id: string
    name: string
    price: number
    image: string
    description?: string
    calories?: number
    protein?: number
    ingredients?: Ingredient[]
    extras?: Extra[]
}

interface CustomizeModalProps {
    item: MenuItem
    isOpen: boolean
    onClose: () => void
    onAddToCart: (customizedItem: any) => void
}

export function CustomizeModal({ item, isOpen, onClose, onAddToCart }: CustomizeModalProps) {
    const [removedIngredients, setRemovedIngredients] = useState<string[]>([])
    const [selectedExtras, setSelectedExtras] = useState<Extra[]>([])
    const [quantity, setQuantity] = useState(1)

    const totalPrice = useMemo(() => {
        const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0)
        return (item.price + extrasTotal) * quantity
    }, [item.price, selectedExtras, quantity])

    if (!isOpen) return null

    const toggleIngredient = (name: string) => {
        setRemovedIngredients(prev =>
            prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
        )
    }

    const toggleExtra = (extra: Extra) => {
        setSelectedExtras(prev =>
            prev.find(e => e.name === extra.name)
                ? prev.filter(e => e.name !== extra.name)
                : [...prev, extra]
        )
    }

    const handleAdd = () => {
        onAddToCart({
            ...item,
            quantity,
            removedIngredients,
            extras: selectedExtras,
            priceAtAdd: (item.price + selectedExtras.reduce((sum, e) => sum + e.price, 0))
        })
        onClose()
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-card border border-border w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
                >
                    {/* Header */}
                    <div className="relative h-48 sm:h-56">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-4 left-6 right-6">
                            <h2 className="text-2xl font-serif font-bold text-white mb-1">{item.name}</h2>
                            <div className="flex items-center gap-4 text-white/90 text-sm">
                                {item.calories && (
                                    <span className="flex items-center gap-1">
                                        <Flame className="w-4 h-4 text-orange-400" />
                                        {item.calories} kcal
                                    </span>
                                )}
                                {item.protein && (
                                    <span className="flex items-center gap-1">
                                        <Zap className="w-4 h-4 text-emerald-400" />
                                        {item.protein}g protein
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 max-h-[60vh] overflow-y-auto space-y-8">
                        {/* Ingredients */}
                        {item.ingredients && item.ingredients.length > 0 && (
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-foreground">Remove Ingredients</h3>
                                    <span className="text-xs text-muted-foreground italic">Tap to remove</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {item.ingredients.map(ing => (
                                        <button
                                            key={ing.name}
                                            disabled={!ing.removable}
                                            onClick={() => toggleIngredient(ing.name)}
                                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${removedIngredients.includes(ing.name)
                                                    ? 'bg-muted text-muted-foreground border-border line-through opacity-60'
                                                    : 'bg-primary/10 text-primary border-primary/20 hover:border-primary/40'
                                                } ${!ing.removable && 'cursor-not-allowed opacity-50'}`}
                                        >
                                            {ing.name}
                                            {!ing.removable && <Info className="w-3 h-3 inline ml-1 opacity-50" />}
                                        </button>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Extras */}
                        {item.extras && item.extras.length > 0 && (
                            <section>
                                <h3 className="font-semibold text-foreground mb-4">Add Extras</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {item.extras.map(extra => {
                                        const isSelected = selectedExtras.find(e => e.name === extra.name)
                                        return (
                                            <button
                                                key={extra.name}
                                                onClick={() => toggleExtra(extra)}
                                                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${isSelected
                                                        ? 'bg-primary/5 border-primary text-primary'
                                                        : 'bg-card border-border text-foreground hover:border-primary/40'
                                                    }`}
                                            >
                                                <span className="text-sm font-medium">{extra.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs opacity-70">+${extra.price.toFixed(2)}</span>
                                                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${isSelected ? 'bg-primary border-primary text-white' : 'border-border'
                                                        }`}>
                                                        {isSelected && <Plus className="w-3 h-3" />}
                                                    </div>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-border bg-muted/30 flex items-center justify-between">
                        <div className="flex items-center gap-4 bg-background border border-border rounded-xl p-1">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-bold text-lg">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAdd}
                            className="flex-1 ml-4 bg-primary text-primary-foreground py-3 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                        >
                            Add to Cart • ${totalPrice.toFixed(2)}
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
