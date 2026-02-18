"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, ArrowUpRight } from "lucide-react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";

function MagneticLink({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLAnchorElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

    function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
        const { clientX, clientY } = e;
        const rect = ref.current?.getBoundingClientRect();
        if (rect) {
            const { height, width, left, top } = rect;
            const middleX = clientX - (left + width / 2);
            const middleY = clientY - (top + height / 2);
            x.set(middleX * 0.5);
            y.set(middleY * 0.5);
        }
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    return (
        <motion.a
            ref={ref}
            href="#"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: mouseX, y: mouseY }}
            className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white hover:border-white transition-all duration-300"
        >
            {children}
        </motion.a>
    );
}

export default function Footer() {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start end", "end end"]
    });

    // Parallax for the large text
    const y = useTransform(scrollYProgress, [0, 1], [-50, 0]);

    return (
        <div ref={container} className="relative z-10 bg-gray-900 overflow-hidden rounded-t-[60px] md:rounded-t-[80px]">
            <footer className="text-white pt-32 pb-12 relative">
                {/* Background Text Effect */}
                <motion.div style={{ y }} className="absolute top-10 left-1/2 -translate-x-1/2 opacity-[0.03] pointer-events-none select-none w-full text-center">
                    <h2 className="text-[20vw] font-black leading-none uppercase tracking-tighter">Food4U</h2>
                </motion.div>

                <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24 text-center md:text-left">
                        <div className="md:col-span-1">
                            <Link href="/" className="text-5xl font-black mb-8 block group">
                                <span className="text-red-600 italic inline-block transition-transform duration-500 group-hover:-rotate-6 origin-bottom-left">Food</span>
                                <span className="tracking-tighter inline-block text-white">4U</span>
                            </Link>
                            <p className="text-gray-400 font-medium leading-relaxed mb-8 text-sm">
                                Crafting culinary excellence since 2024. Flavors that define moments, delivered with speed and precision.
                            </p>
                            <div className="flex justify-center md:justify-start gap-3">
                                <MagneticLink><Facebook size={20} /></MagneticLink>
                                <MagneticLink><Instagram size={20} /></MagneticLink>
                                <MagneticLink><Twitter size={20} /></MagneticLink>
                                <MagneticLink><Youtube size={20} /></MagneticLink>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-black uppercase tracking-[0.2em] text-[10px] text-red-600 mb-8">Explore</h4>
                            <ul className="space-y-4">
                                {["Our Menu", "Famous Pizza", "Gourmet Burgers", "Healthy Salads", "Offers"].map((link) => (
                                    <li key={link}>
                                        <Link href="#" className="text-gray-400 hover:text-white transition-colors flex items-center justify-center md:justify-start gap-2 group text-sm font-bold">
                                            {link} <ArrowUpRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-red-600" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-black uppercase tracking-[0.2em] text-[10px] text-red-600 mb-8">Company</h4>
                            <ul className="space-y-4">
                                {["About Us", "Our Chefs", "Sustainability", "Careers", "Contact"].map((link) => (
                                    <li key={link}>
                                        <Link href="#" className="text-gray-400 hover:text-white transition-colors flex items-center justify-center md:justify-start gap-2 group text-sm font-bold">
                                            {link} <ArrowUpRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-red-600" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-black uppercase tracking-[0.2em] text-[10px] text-white mb-8">Join the Club</h4>
                            <p className="text-gray-400 text-sm mb-6 font-medium">Get exclusive offers and limited-time releases.</p>
                            <div className="relative group">
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-red-600 transition-all font-bold text-white placeholder:text-gray-600"
                                />
                                <button className="absolute right-2 top-2 bottom-2 bg-red-600 text-white px-6 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-red-600 transition-all shadow-lg shadow-red-900/20">
                                    Join
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
                            © 2026 Food4U Professional. All Rights Reserved.
                        </p>
                        <div className="flex gap-8">
                            {["Privacy Policy", "Terms of Service", "Cookie Settings"].map((item) => (
                                <Link key={item} href="#" className="text-gray-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest hover:underline underline-offset-4 decoration-red-600">
                                    {item}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
