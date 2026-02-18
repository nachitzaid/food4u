"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Plus, ShoppingCart, Star, Clock, Heart, ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import toast from "react-hot-toast";

interface MenuItemProps {
    item: {
        id: string;
        name: string;
        price: number;
        category: string;
        available: boolean;
        description?: string;
    };
}

export default function MenuItemCard({ item }: MenuItemProps) {
    const { addToCart } = useCart();

    // 3D Tilt Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 50 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 50 });

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-10deg", "10deg"]);


    const handleAdd = () => {
        addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1
        });
        toast.success(`${item.name} added to cart!`, {
            style: {
                borderRadius: '16px',
                background: '#18181b', // gray-900
                color: '#fff',
                fontWeight: '900',
                border: '1px solid #333'
            },
            icon: '🔥'
        });
    };

    return (
        <motion.div
            style={{ perspective: 1000 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="h-full"
        >
            <motion.div
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="bg-white rounded-[40px] shadow-[0_20px_40px_rgba(0,0,0,0.04)] p-3 group flex flex-col h-full hover:shadow-[0_30px_60px_rgba(220,38,38,0.1)] transition-all duration-500 relative border border-white/50"
            >
                <div
                    className="w-full aspect-[1.1] bg-gray-50 rounded-[34px] relative overflow-hidden"
                    style={{ transform: "translateZ(20px)" }}
                >
                    <img
                        src={`https://source.unsplash.com/featured/?${item.category},food,gourmet&sig=${item.id}`}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Floating Meta tags */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                        <div className="bg-white/90 backdrop-blur-xl px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-white/40">
                            <Star size={10} fill="currentColor" className="text-orange-500" />
                            <span className="text-[9px] font-black text-gray-900 uppercase tracking-wide">4.9</span>
                        </div>
                        <button className="w-9 h-9 bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-all shadow-lg border border-white/40 active:scale-90">
                            <Heart size={14} className="group-active:fill-current" />
                        </button>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-10">
                        <motion.div
                            initial={{ width: "auto" }}
                            whileHover={{ width: "auto", paddingRight: 20 }}
                            className="bg-gray-900/90 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-[12px] font-black uppercase tracking-wider border border-white/10 shadow-xl"
                        >
                            ${item.price.toFixed(2)}
                        </motion.div>
                    </div>

                    {!item.available && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center z-20">
                            <span className="bg-gray-900 text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-xl">Sold Out</span>
                        </div>
                    )}
                </div>

                <div className="p-6 pt-8 flex-grow flex flex-col" style={{ transform: "translateZ(10px)" }}>
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-[9px] font-black text-red-600 uppercase tracking-[0.2em] px-2 py-1 bg-red-50 rounded-lg">{item.category}</span>
                        <div className="flex items-center gap-1 text-[9px] font-bold text-gray-300">
                            <Clock size={10} /> 15m
                        </div>
                    </div>

                    <h3 className="text-2xl font-black text-gray-900 mb-3 leading-[1.1] group-hover:text-red-600 transition-colors tracking-tight">{item.name}</h3>
                    <p className="text-xs text-gray-400 line-clamp-2 font-medium leading-relaxed mb-6">
                        {item.description || `Exquisite ${item.name} crafted with the finest seasonal ingredients and expert technique for a memorable taste.`}
                    </p>

                    <div className="mt-auto pt-4 border-t border-gray-50">
                        <button
                            onClick={handleAdd}
                            disabled={!item.available}
                            className="w-full flex items-center justify-between bg-black text-white p-2 pl-6 rounded-[24px] font-black text-[10px] uppercase tracking-widest hover:bg-neutral-800 transition-all active:scale-95 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed shadow-xl shadow-gray-200 group/btn overflow-hidden relative"
                        >
                            <span className="relative z-10 group-hover/btn:text-white transition-colors">{item.available ? "Add to Order" : "Unavailable"}</span>
                            <div className="w-10 h-10 bg-white/20 rounded-[18px] flex items-center justify-center group-hover/btn:bg-white group-hover/btn:text-black transition-all">
                                {item.available ? <Plus size={16} /> : "X"}
                            </div>

                            {/* Hover Fill Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
