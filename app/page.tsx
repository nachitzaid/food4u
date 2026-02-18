"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { loginWithGoogle } from "@/services/auth";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { ChevronRight, Star, Clock, ShieldCheck, Play, ArrowRight, Utensils, MapPin, Heart } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // Parallax for features
  const featureY1 = useTransform(scrollYProgress, [0.7, 0.9], [50, 0]);
  const featureY2 = useTransform(scrollYProgress, [0.7, 0.9], [100, 0]);
  const featureY3 = useTransform(scrollYProgress, [0.7, 0.9], [150, 0]);

  // 3D Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 500, damping: 50 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 50 });
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = event.clientX - rect.left;
    const mouseYPos = event.clientY - rect.top;
    const xPct = mouseXPos / width - 0.5;
    const yPct = mouseYPos / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  useEffect(() => {
    if (user && !loading) {
      if (userData?.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/menu");
      }
    }
  }, [user, userData, loading, router]);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const categories = [
    { name: "Pizza", emoji: "🍕", color: "bg-red-50", text: "text-red-600" },
    { name: "Burgers", emoji: "🍔", color: "bg-orange-50", text: "text-orange-600" },
    { name: "Salads", emoji: "🥗", color: "bg-green-50", text: "text-green-600" },
    { name: "Sides", emoji: "🍟", color: "bg-yellow-50", text: "text-yellow-600" },
    { name: "Desserts", emoji: "🍰", color: "bg-purple-50", text: "text-purple-600" },
  ];

  return (
    <div ref={containerRef} className="relative min-h-screen bg-white">
      {/* Noise Texture */}
      <div className="noise-bg" />

      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] bg-red-100/20 blur-[120px] rounded-full -mr-40 -mt-20 overflow-hidden" />
      <div className="absolute top-[20%] left-0 -z-10 w-[400px] h-[400px] bg-orange-50/40 blur-[100px] rounded-full -ml-20 overflow-hidden" />

      {/* Hero Section */}
      <section className="relative pt-10 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-16">
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="flex-1 text-center md:text-left z-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-6 py-2.5 mb-8 bg-red-50 border border-red-100 rounded-full text-red-600 font-black text-[10px] uppercase tracking-[0.3em] shadow-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-red-600 animate-ping" /> The Artisanal Era
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl md:text-8xl font-black text-gray-900 leading-[1.05] tracking-tight mb-8"
            >
              Crave the <br /> Manifesto of <br />
              <span className="text-red-600">Pure Taste.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-500 mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed font-medium"
            >
              Bridging the gap between fine dining and fast delivery. Experience meticulous craftsmanship in every bite.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-5"
            >
              <button
                onClick={handleLogin}
                className="w-full sm:w-auto px-10 py-5 bg-red-600 text-white rounded-3xl font-black text-xl hover:bg-gray-900 transition-all shadow-2xl shadow-red-200 flex items-center justify-center gap-3 group active:scale-95 premium-glow"
              >
                Start Journey <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
              <button
                onClick={() => router.push("/menu")}
                className="w-full sm:w-auto px-10 py-5 bg-white text-gray-900 border-2 border-gray-100 rounded-3xl font-black text-xl hover:border-red-600 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-sm"
              >
                <Utensils size={24} className="text-red-600" /> Manifest
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex-1 relative perspective-1000"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              perspective: 1000
            }}
          >
            {/* Main Hero Image */}
            <motion.div
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="relative group transition-transform duration-100 ease-out"
            >
              <div className="absolute inset-0 bg-red-600/10 blur-[100px] rounded-full group-hover:bg-red-600/20 transition-all duration-700" />
              <div
                className="relative w-full aspect-[4/5] md:aspect-square bg-white rounded-[60px] md:rounded-[100px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden border-[16px] border-white ring-1 ring-gray-100"
                style={{ transform: "translateZ(20px)" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000"
                  alt="Delicious premium food"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </div>

              {/* Floating UI Elements */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                style={{ transform: "translateZ(60px)" }}
                className="absolute -top-10 -right-10 bg-white p-6 rounded-[32px] shadow-2xl border border-gray-50 flex items-center gap-4 z-20 backdrop-blur-md bg-white/90"
              >
                <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Efficiency</p>
                  <p className="font-black text-gray-900">12 MIN AVG</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                style={{ transform: "translateZ(50px)" }}
                className="absolute bottom-20 -left-12 bg-white p-6 rounded-[32px] shadow-2xl border border-gray-50 flex items-center gap-4 z-20 backdrop-blur-md bg-white/90"
              >
                <div className="w-12 h-12 bg-gold-400 rounded-2xl flex items-center justify-center text-white">
                  <Star size={24} fill="white" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Accolades</p>
                  <p className="font-black text-gray-900">Michelin Prep</p>
                </div>
              </motion.div>

              {/* Notification Card */}
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                style={{ transform: "translateZ(80px)" }}
                className="absolute top-[20%] -right-16 bg-black/80 text-white p-4 rounded-2xl shadow-2xl z-20 backdrop-blur-xl border border-white/10 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-xs">
                  <Heart size={14} fill="white" />
                </div>
                <span className="text-sm font-bold">New order from Sarah!</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Category Quick Links */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Cuisines for every <span className="text-red-600 italic">Mood</span></h2>
              <p className="text-gray-500 font-medium">Explore our diverse menu and find your next favorite dish.</p>
            </div>
            <Link href="/menu" className="flex items-center gap-2 text-red-600 font-black hover:gap-4 transition-all uppercase text-xs tracking-widest">
              View All <ChevronRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className={`${cat.color} p-10 rounded-[48px] flex flex-col items-center justify-center gap-4 cursor-pointer transition-all border border-transparent hover:border-white hover:shadow-2xl shadow-gray-200/50`}
              >
                <span className="text-6xl mb-2">{cat.emoji}</span>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${cat.text}`}>{cat.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">Why <span className="text-red-600">Food4U</span>?</h2>
            <p className="text-xl text-gray-500 font-medium">We're not just a delivery service, we're a premium culinary manifesto.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">
            {[
              {
                icon: <MapPin className="text-red-600" size={32} />,
                title: "Live Manifest Sync",
                desc: "Follow your meal from the kitchen to your doorstep with GPS precision.",
                y: featureY1
              },
              {
                icon: <ShieldCheck className="text-red-600" size={32} />,
                title: "Encrypted Trust",
                desc: "Your payments and data are protected by top-tier encryption technology.",
                y: featureY2
              },
              {
                icon: <Utensils className="text-red-600" size={32} />,
                title: "Artisanal Integrity",
                desc: "Supporting local master chefs by providing a professional, fair framework.",
                y: featureY3
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.2 }}
                style={{ y: feature.y }}
                className="group"
              >
                <div className="w-20 h-20 bg-red-50 rounded-[32px] flex items-center justify-center mb-8 mx-auto md:mx-0 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
