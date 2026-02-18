"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart, LogOut, Menu as MenuIcon, Search } from "lucide-react";
import { logout } from "@/services/auth";
import { motion, useScroll, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

// Magnetic Button Component
function Magnetic({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const { clientX, clientY } = e;
        const rect = ref.current?.getBoundingClientRect();
        if (rect) {
            const { height, width, left, top } = rect;
            const middleX = clientX - (left + width / 2);
            const middleY = clientY - (top + height / 2);
            x.set(middleX * 0.3); // Sensitivity
            y.set(middleY * 0.3);
        }
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: mouseX, y: mouseY }}
        >
            {children}
        </motion.div>
    );
}

export default function Header() {
    const { user, userData } = useAuth();
    const { items } = useCart();
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        return scrollY.onChange((latest) => {
            setIsScrolled(latest > 20);
        });
    }, [scrollY]);

    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 h-24 flex items-center px-6 md:px-12 
            ${isScrolled ? "bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]" : "bg-transparent"}`}
        >
            <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
                <Link href="/" className="text-4xl font-black text-gray-900 flex items-center gap-1 group relative">
                    <motion.span whileHover={{ scale: 1.1, rotate: -5 }} className="text-red-600 italic drop-shadow-sm inline-block origin-bottom-left">Food</motion.span>
                    <span className="tracking-tighter group-hover:tracking-normal transition-all duration-500 text-gray-900">4U</span>
                </Link>

                <nav className="hidden md:flex items-center gap-12">
                    {[
                        { name: "Menu", href: "/menu" },
                        { name: "Track Order", href: "/orders" }
                    ].map((link) => (
                        <Magnetic key={link.name}>
                            <Link href={link.href} className="text-sm font-bold text-gray-500 hover:text-red-600 transition-colors relative group py-4">
                                {link.name}
                                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300" />
                            </Link>
                        </Magnetic>
                    ))}
                    {userData?.role === "admin" && (
                        <Magnetic>
                            <Link href="/admin/dashboard" className="px-5 py-2.5 bg-red-50 text-red-600 rounded-2xl text-xs font-black hover:bg-red-600 hover:text-white transition-all border border-red-100 shadow-lg shadow-red-100/50">
                                Admin Portal
                            </Link>
                        </Magnetic>
                    )}
                </nav>

                <div className="flex items-center gap-4 md:gap-8">
                    <Magnetic>
                        <button className="p-3 text-gray-400 hover:text-red-600 transition-colors hidden sm:flex items-center justify-center rounded-full hover:bg-gray-50">
                            <Search size={22} />
                        </button>
                    </Magnetic>

                    <Magnetic>
                        <Link href="/cart" className="relative p-3 bg-gray-50 text-gray-600 hover:text-white hover:bg-red-600 transition-all rounded-full group shadow-lg shadow-gray-200/50 hover:shadow-red-600/30">
                            <ShoppingCart size={22} className="group-active:scale-90 transition-transform" />
                            <AnimatePresence>
                                {cartCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        key={cartCount} // Re-animate on count change
                                        className="absolute -top-1 -right-1 bg-gray-900 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black shadow-lg border-2 border-white"
                                    >
                                        {cartCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    </Magnetic>

                    {user ? (
                        <div className="flex items-center gap-4 pl-4 md:pl-8 border-l border-gray-200/50">
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Welcome</span>
                                <span className="text-sm font-black text-gray-900 leading-none">{user.displayName?.split(' ')[0]}</span>
                            </div>
                            <Magnetic>
                                <button
                                    onClick={() => logout()}
                                    className="w-11 h-11 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all shadow-xl shadow-gray-900/20 active:scale-95 group"
                                    title="Logout"
                                >
                                    <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </Magnetic>
                        </div>
                    ) : (
                        <Magnetic>
                            <Link
                                href="/"
                                className="bg-red-600 text-white px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-gray-900 transition-all active:scale-95 shadow-xl shadow-red-500/30 hover:shadow-gray-900/50"
                            >
                                Get Started
                            </Link>
                        </Magnetic>
                    )}

                    <button className="md:hidden p-2 text-gray-600">
                        <MenuIcon size={24} />
                    </button>
                </div>
            </div>
        </motion.header>
    );
}
