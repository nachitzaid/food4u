"use client";

import { useState } from "react";
import MenuItemCard from "@/components/MenuItemCard";
import { Search, Filter, UtensilsCrossed, Pizza, Beef, Leaf, Coffee, Apple } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Initial static data
const INITIAL_MENU = [
    { id: "1", name: "Margherita Pizza", price: 12.99, category: "Pizza", available: true, description: "San Marzano tomatoes, fresh mozzarella, basil, and extra virgin olive oil." },
    { id: "2", name: "Spicy Pepperoni", price: 14.99, category: "Pizza", available: true, description: "Spicy pepperoni, mozzarella, and chili flakes on our signature crust." },
    { id: "3", name: "Classic Cheeseburger", price: 9.99, category: "Burgers", available: true, description: "Angus beef, cheddar, lettuce, tomato, and our secret sauce on a brioche bun." },
    { id: "4", name: "Grilled Chicken Salad", price: 11.50, category: "Salads", available: true, description: "Organic greens, grilled chicken breast, avocado, and balsamic vinaigrette." },
    { id: "5", name: "Truffle Fries", price: 6.50, category: "Sides", available: true, description: "Crispy fries tossed in white truffle oil and topped with parmesan." },
    { id: "6", name: "Chocolate Lava Cake", price: 7.99, category: "Desserts", available: true, description: "Warm chocolate cake with a molten center, served with vanilla bean ice cream." },
];

const CATEGORIES = [
    { name: "All", icon: UtensilsCrossed, color: "bg-gray-900" },
    { name: "Pizza", icon: Pizza, color: "bg-red-600" },
    { name: "Burgers", icon: Beef, color: "bg-orange-500" },
    { name: "Salads", icon: Leaf, color: "bg-green-500" },
    { name: "Sides", icon: Apple, color: "bg-yellow-500" },
    { name: "Desserts", icon: Coffee, color: "bg-purple-500" },
];

export default function MenuPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredItems = INITIAL_MENU.filter(item => {
        const matchesCategory = activeCategory === "All" || item.category === activeCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Menu Hero Section */}
            <section className="relative pt-40 pb-32 bg-black overflow-hidden">
                {/* Abstract Background */}
                <div className="absolute top-0 left-0 w-full h-full opacity-50">
                    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-red-600/30 rounded-full blur-[150px] animate-pulse" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '3s' }} />
                </div>

                <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-5 py-2 mb-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-red-400 font-bold text-[10px] uppercase tracking-[0.3em]"
                    >
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" /> Curated Collection
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-9xl font-black text-white mb-6 tracking-tighter"
                    >
                        Taste <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 italic pr-2">Lab</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed"
                    >
                        Experience gastronomy reimagined. Every dish is a chapter in our culinary manifesto.
                    </motion.p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 -mt-20 relative z-20">
                {/* Search Bar */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/80 backdrop-blur-xl p-3 md:p-4 rounded-[40px] shadow-2xl shadow-black/5 border border-white flex flex-col md:flex-row gap-4 items-center mb-16"
                >
                    <div className="relative flex-grow w-full">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-red-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Find your craving..."
                            className="w-full pl-16 pr-6 py-4 bg-gray-50 border-none rounded-[32px] focus:ring-0 transition-all outline-none text-gray-900 font-bold text-lg placeholder:text-gray-300"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="w-full md:w-auto h-16 px-10 bg-gray-900 text-white rounded-[32px] font-black hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-gray-900/20 group uppercase tracking-widest text-xs flex items-center justify-center gap-3">
                        <Filter size={16} /> Filter
                    </button>
                </motion.div>

                {/* Categories */}
                <div className="flex gap-4 mb-20 overflow-x-auto pb-8 no-scrollbar snap-x">
                    {CATEGORIES.map((cat, i) => {
                        const Icon = cat.icon;
                        const isActive = activeCategory === cat.name;
                        return (
                            <motion.button
                                key={cat.name}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + i * 0.05 }}
                                onClick={() => setActiveCategory(cat.name)}
                                className={`snap-center flex-shrink-0 flex items-center gap-3 px-6 py-4 rounded-[24px] transition-all relative border ${isActive
                                    ? "bg-white shadow-xl shadow-gray-200/50 border-red-500/20 scale-105 z-10"
                                    : "bg-white/40 hover:bg-white border-transparent hover:shadow-lg"
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isActive ? cat.color + " text-white" : "bg-gray-100 text-gray-400"}`}>
                                    <Icon size={18} />
                                </div>
                                <span className={`text-xs font-black uppercase tracking-widest ${isActive ? "text-gray-900" : "text-gray-400"}`}>
                                    {cat.name}
                                </span>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Menu Grid */}
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-40">
                    <AnimatePresence mode="popLayout">
                        {filteredItems.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                <MenuItemCard item={item} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredItems.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-400 font-bold">No items found matching your criteria.</p>
                        <button
                            onClick={() => { setSearchQuery(""); setActiveCategory("All") }}
                            className="mt-4 text-red-600 font-black uppercase text-xs tracking-widest hover:underline"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
