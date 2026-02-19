'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { CartProvider, useCart } from '@/context/cart-context'
import {
    Plus,
    Minus,
    Flame,
    Zap,
    Leaf,
    ArrowLeft,
    ShoppingCart,
    CheckCircle2,
    Info
} from 'lucide-react'
import Link from 'next/link'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/services/firebase'

interface MenuItem {
    id: string
    name: string
    description: string
    price: number
    category: string
    image: string
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
    ingredients?: { name: string; removable: boolean }[]
    extras?: { name: string; price: number }[]
}

function ItemDetailContent() {
    const { id } = useParams()
    const router = useRouter()
    const { addItem } = useCart()
    const [item, setItem] = useState<MenuItem | null>(null)
    const [loading, setLoading] = useState(true)
    const [quantity, setQuantity] = useState(1)
    const [removedIngredients, setRemovedIngredients] = useState<string[]>([])
    const [selectedExtras, setSelectedExtras] = useState<string[]>([])
    const [addedToCart, setAddedToCart] = useState(false)

    useEffect(() => {
        const fetchItem = async () => {
            if (!id) return
            try {
                const docRef = doc(db, 'menuItems', id as string)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    setItem({ id: docSnap.id, ...docSnap.data() } as MenuItem)
                }
            } catch (error) {
                console.error('Error fetching item:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchItem()
    }, [id])

    const totalPrice = item
        ? (item.price + (item.extras?.filter(e => selectedExtras.includes(e.name)).reduce((sum, e) => sum + e.price, 0) || 0)) * quantity
        : 0

    const handleAddToCart = () => {
        if (!item) return
        addItem({
            id: item.id,
            name: item.name,
            price: item.price + (item.extras?.filter(e => selectedExtras.includes(e.name)).reduce((sum, e) => sum + e.price, 0) || 0),
            image: item.image,
            quantity,
            removedIngredients,
            extras: item.extras?.filter(e => selectedExtras.includes(e.name)) || [],
        })
        setAddedToCart(true)
        setTimeout(() => setAddedToCart(false), 2000)
    }

    if (loading) return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="font-serif italic text-muted-foreground transition-all animate-pulse">Preparing your experience...</p>
        </div>
    )

    if (!item) return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <h1 className="font-serif text-3xl font-bold mb-4">Dish not found</h1>
            <Link href="/menu" className="text-primary hover:underline flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to menu
            </Link>
        </div>
    )

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
                <Link
                    href="/menu"
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition mb-8 group"
                >
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    Back to Menu
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                    {/* Image Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative"
                    >
                        <div className="relative aspect-square lg:aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        </div>

                        {/* Category Badge */}
                        <div className="absolute top-6 left-6 px-6 py-2 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold tracking-[0.2em] text-primary uppercase shadow-lg">
                            {item.category}
                        </div>
                    </motion.div>

                    {/* Details Section */}
                    <div className="flex flex-col">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h1 className="font-serif text-5xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
                                {item.name}
                            </h1>
                            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl">
                                {item.description}
                            </p>

                            {/* Nutrition Grid */}
                            <div className="grid grid-cols-4 gap-4 mb-12">
                                {[
                                    { icon: <Flame className="w-4 h-4" />, label: 'Energy', value: `${item.calories ?? '---'} kcal`, color: 'text-orange-500' },
                                    { icon: <Zap className="w-4 h-4" />, label: 'Protein', value: `${item.protein ?? '---'}g`, color: 'text-emerald-500' },
                                    { icon: <CheckCircle2 className="w-4 h-4" />, label: 'Carbs', value: `${item.carbs ?? '---'}g`, color: 'text-blue-500' },
                                    { icon: <Leaf className="w-4 h-4" />, label: 'Fat', value: `${item.fat ?? '---'}g`, color: 'text-amber-500' },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-card border border-border rounded-2xl p-4 text-center">
                                        <div className={`flex justify-center mb-2 ${stat.color}`}>{stat.icon}</div>
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</div>
                                        <div className="text-sm font-bold text-foreground">{stat.value}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Customization */}
                            <div className="space-y-10 mb-12">
                                {item.ingredients && item.ingredients.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2 mb-4">
                                            Ingredients <Info className="w-3 h-3 text-muted-foreground" />
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {item.ingredients.map((ing) => (
                                                <button
                                                    key={ing.name}
                                                    disabled={!ing.removable}
                                                    onClick={() => {
                                                        if (removedIngredients.includes(ing.name)) {
                                                            setRemovedIngredients(removedIngredients.filter(i => i !== ing.name))
                                                        } else {
                                                            setRemovedIngredients([...removedIngredients, ing.name])
                                                        }
                                                    }}
                                                    className={`
                            px-4 py-2 rounded-lg text-sm transition font-medium
                            ${!ing.removable
                                                            ? 'bg-muted/50 text-muted-foreground cursor-not-allowed border border-border'
                                                            : removedIngredients.includes(ing.name)
                                                                ? 'bg-destructive/10 text-destructive border border-destructive/20 line-through'
                                                                : 'bg-card border border-border text-foreground hover:border-primary/50'
                                                        }
                          `}
                                                >
                                                    {ing.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {item.extras && item.extras.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2 mb-4">
                                            Add Extras
                                        </h3>
                                        <div className="space-y-2">
                                            {item.extras.map((extra) => (
                                                <button
                                                    key={extra.name}
                                                    onClick={() => {
                                                        if (selectedExtras.includes(extra.name)) {
                                                            setSelectedExtras(selectedExtras.filter(e => e !== extra.name))
                                                        } else {
                                                            setSelectedExtras([...selectedExtras, extra.name])
                                                        }
                                                    }}
                                                    className={`
                            w-full flex items-center justify-between p-4 rounded-xl border transition
                            ${selectedExtras.includes(extra.name)
                                                            ? 'bg-primary/5 border-primary shadow-sm'
                                                            : 'bg-card border-border hover:border-primary/50'
                                                        }
                          `}
                                                >
                                                    <span className="font-medium text-foreground">{extra.name}</span>
                                                    <span className="text-sm font-bold text-primary">+${extra.price.toFixed(2)}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Bar */}
                            <div className="flex flex-col sm:flex-row items-center gap-4 pt-8 border-t border-border">
                                <div className="flex items-center gap-4 bg-muted/30 p-2 rounded-xl border border-border">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white hover:shadow-sm transition"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white hover:shadow-sm transition"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className={`
                    flex-1 w-full sm:w-auto h-14 rounded-xl flex items-center justify-center gap-3 font-bold text-lg transition shadow-xl
                    ${addedToCart
                                            ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                                            : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20'
                                        }
                  `}
                                >
                                    {addedToCart ? (
                                        <>
                                            <CheckCircle2 className="w-5 h-5" /> Added!
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="w-5 h-5" /> Add to Cart • ${totalPrice.toFixed(2)}
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default function ItemDetailPage() {
    return (
        <CartProvider>
            <ItemDetailContent />
        </CartProvider>
    )
}
