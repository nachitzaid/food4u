"use client";

import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, subtotal } = useCart();

    return (
        <div className="min-h-screen bg-gray-50/50 pb-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-16">Your <span className="text-red-600">Selection</span></h1>

                <div className="grid lg:grid-cols-3 gap-16 items-start">
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="popLayout">
                            {items.length > 0 ? (
                                items.map((item, idx) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -50 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-white p-4 rounded-[32px] mb-6 flex items-center gap-6 shadow-xl shadow-gray-100/50 border border-white group hover:shadow-2xl hover:shadow-red-500/5 transition-all"
                                    >
                                        <div className="w-24 h-24 bg-gray-100 rounded-[24px] overflow-hidden">
                                            <img
                                                src={`https://source.unsplash.com/featured/?food,${item.name}&sig=${item.id}`}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>

                                        <div className="flex-grow">
                                            <h3 className="text-xl font-black text-gray-900 mb-1">{item.name}</h3>
                                            <p className="text-red-500 font-bold">${item.price.toFixed(2)}</p>
                                        </div>

                                        <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-1">
                                            <button
                                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                className="w-8 h-8 flex items-center justify-center bg-white rounded-xl shadow-sm hover:bg-gray-200 transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-4 text-center font-black text-sm">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center bg-white rounded-xl shadow-sm hover:bg-gray-200 transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-20 bg-white rounded-[40px] shadow-sm border border-gray-100"
                                >
                                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                        <ShoppingBag size={40} />
                                    </div>
                                    <h2 className="text-2xl font-black text-gray-900 mb-2">Cart is empty</h2>
                                    <p className="text-gray-400 font-medium mb-8">Looks like you haven't made your choice yet.</p>
                                    <Link
                                        href="/menu"
                                        className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl active:scale-95"
                                    >
                                        Explore Menu <ArrowRight size={16} />
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {items.length > 0 && (
                        <div className="lg:sticky lg:top-28">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gray-900 text-white p-8 rounded-[40px] shadow-2xl shadow-gray-900/40 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

                                <h2 className="text-2xl font-black mb-8 relative z-10">Order Summary</h2>

                                <div className="space-y-4 mb-8 relative z-10 border-t border-white/10 pt-6">
                                    <div className="flex justify-between text-sm text-gray-400 font-bold uppercase tracking-wider">
                                        Subtotal <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-4xl font-black text-white pt-4">
                                        Total <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <Link
                                    href="/checkout"
                                    className="relative z-10 w-full py-5 bg-white text-gray-900 rounded-[24px] font-black text-lg uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 group"
                                >
                                    Checkout <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
