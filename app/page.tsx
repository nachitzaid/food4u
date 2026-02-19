'use client'

import { motion } from 'framer-motion'
import { ChefHat, Clock, MapPin, TrendingUp, Zap, Shield, Lock, ArrowRight, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
      {/* Premium Navbar */}
      <nav className="fixed top-0 w-full z-50 transition-all duration-500 bg-background/20 backdrop-blur-xl border-b border-white/10 hover:bg-background/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 group px-4 py-2 rounded-2xl bg-white/5 border border-white/10"
          >
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/40 group-hover:scale-110 transition duration-300">
              <ChefHat className="w-6 h-6" />
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-white">Food4U</span>
          </motion.div>

          <div className="hidden lg:flex items-center gap-10">
            {['The Menu', 'Our Story', 'Culinary Team', 'Location'].map((item) => (
              <Link
                key={item}
                href={item === 'The Menu' ? '/menu' : '#'}
                className="text-sm font-bold uppercase tracking-[0.2em] text-white/70 hover:text-primary transition"
              >
                {item}
              </Link>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Link href="/auth/login" className="px-6 py-2.5 text-sm font-bold uppercase tracking-widest text-white hover:text-primary transition">
              Login
            </Link>
            <Link href="/menu" className="px-8 py-3 bg-primary text-white text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition shadow-xl shadow-primary/20 hover:scale-105 active:scale-95">
              Experience Menu
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section - The Grand Entrance */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <img
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2000"
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
            alt="Hero background"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-20 text-center max-w-4xl px-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-block px-4 py-2 border border-primary/40 bg-primary/10 backdrop-blur-md rounded-full text-primary text-xs font-bold uppercase tracking-[0.3em] mb-8"
          >
            Since 1994 • Culinary Excellence
          </motion.div>
          <h1 className="font-serif text-6xl md:text-9xl font-bold text-white mb-8 leading-[0.9]">
            Taste the <br />
            <span className="italic text-primary">Masterpiece</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/70 font-light max-w-2xl mx-auto leading-relaxed mb-12">
            A symphony of flavors, where every dish tells a story of heritage and innovation. Welcome to the pinnacle of dining.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/menu" className="px-12 py-5 bg-primary text-white font-bold uppercase tracking-widest rounded-2xl hover:bg-primary/90 transition-all shadow-2xl shadow-primary/40 text-lg group">
              View Our Menu <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-2 transition" />
            </Link>
            <button className="px-12 py-5 bg-white/5 backdrop-blur-md border border-white/20 text-white font-bold uppercase tracking-widest rounded-2xl hover:bg-white/10 transition text-lg">
              Our Story
            </button>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.4em]">Discover</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>
      </section>

      {/* About Section - The Story */}
      <section className="py-32 px-6 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -40 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="text-primary font-bold uppercase tracking-[0.4em] text-sm">Our Heritage</div>
            <h2 className="font-serif text-5xl md:text-7xl font-bold leading-tight">
              Crafted with <br /> Passion, Served <br /> with <span className="italic">Soul</span>.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              Our journey started with a single goal: to redefine what a meal can be. Every ingredient is sourced from artisanal farms, and every recipe is a result of years of culinary exploration.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-6">
              <div>
                <div className="text-4xl font-serif font-bold mb-2">29+</div>
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Years of Experience</div>
              </div>
              <div>
                <div className="text-4xl font-serif font-bold mb-2">12k+</div>
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Five Star Reviews</div>
              </div>
            </div>
            <button className="text-primary font-bold uppercase tracking-widest flex items-center gap-2 pt-4 hover:gap-4 transition-all">
              Learn More About Us <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>

          <motion.div
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.9 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden rotate-2 hover:rotate-0 transition duration-700 shadow-2xl shadow-primary/10">
              <img
                src="https://images.unsplash.com/photo-1550966842-285dc8032742?q=80&w=1200"
                className="w-full h-full object-cover"
                alt="Chef at work"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary rounded-[2rem] p-8 text-white hidden md:flex flex-col justify-center -rotate-6">
              <ChefHat className="w-10 h-10 mb-4" />
              <div className="font-serif text-xl font-bold leading-tight">Elite Culinary Excellence</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Section - The Experience */}
      <section className="py-32 px-6 bg-card relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="font-serif text-5xl md:text-7xl font-bold mb-4">Why Dine with Us?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Experience the intersection of luxury and comfort.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Live Preparation",
                desc: "Watch our master chefs craft your dish in our signature open kitchen.",
                num: "01"
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Seasonal Menu",
                desc: "Our menu evolves with the seasons to ensure the freshest flavors imaginable.",
                num: "02"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Artisanal Sourcing",
                desc: "We partner exclusively with local farms committed to ethical and organic practices.",
                num: "03"
              }
            ].map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ translateY: -12 }}
                className="p-10 bg-background border border-border rounded-[2.5rem] relative group overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 font-serif text-4xl text-primary/10 group-hover:text-primary/20 transition">{f.num}</div>
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition duration-500">
                  {f.icon}
                </div>
                <h3 className="font-serif text-2xl font-bold mb-4">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed italic">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map & Location Section */}
      <section className="py-32 px-6 bg-background">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="text-center mb-16">
            <div className="text-primary font-bold uppercase tracking-[0.4em] text-sm mb-4">Visit Us</div>
            <h2 className="font-serif text-5xl md:text-7xl font-bold mb-6">Our Location</h2>
            <p className="text-muted-foreground max-w-md mx-auto flex items-center justify-center gap-2">
              <MapPin className="w-5 h-5 text-primary" /> 123 Gastronomy Avenue, Culinary District, NY
            </p>
          </div>

          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 40 }}
            viewport={{ once: true }}
            className="w-full h-[500px] rounded-[3rem] overflow-hidden border border-border shadow-2xl relative bg-muted/20"
          >
            {/* Real Map Placeholder - Using Iframe for reliability as requested */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.2528082187!2d-74.1197637392!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
              className="w-full h-full border-none grayscale hover:grayscale-0 transition-all duration-1000"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

            {/* Custom Overlay */}
            <div className="absolute top-10 right-10 bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl max-w-sm hidden lg:block">
              <h4 className="font-serif text-2xl font-bold mb-2 text-foreground">Opening Hours</h4>
              <div className="space-y-4 text-sm mt-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Mon - Fri</span>
                  <span className="font-bold text-foreground">11:00 AM - 11:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sat - Sun</span>
                  <span className="font-bold text-primary">10:00 AM - 12:00 PM</span>
                </div>
              </div>
              <button className="w-full mt-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20">
                Get Directions
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 px-6 bg-primary overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-white rounded-full blur-[100px]" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-accent rounded-full blur-[100px]" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2
            whileInView={{ scale: [0.9, 1] }}
            viewport={{ once: true }}
            className="font-serif text-6xl md:text-8xl font-bold text-white mb-8"
          >
            Ready for an <br /> <span className="italic opacity-80">Unforgettable</span> <br /> Experience?
          </motion.h2>
          <p className="text-white/80 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Reserve your table or order online for the finest culinary experience of your life. Our doors are open.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/menu" className="px-12 py-5 bg-white text-primary font-bold uppercase tracking-widest rounded-2xl hover:scale-105 transition shadow-2xl shadow-primary/20">
              Start Your Order
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:col-span-1 lg:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                <ChefHat className="w-6 h-6" />
              </div>
              <span className="font-serif text-3xl font-bold tracking-tight">Food4U</span>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-sm italic">
              "Cooking is not just about making food, it's about making memories."
            </p>
          </div>
          <div>
            <h4 className="font-serif text-xl font-bold mb-6">Explore</h4>
            <ul className="space-y-4 text-muted-foreground font-medium">
              <li><Link href="/menu" className="hover:text-primary transition">The Menu</Link></li>
              <li><Link href="#" className="hover:text-primary transition">Our Specialities</Link></li>
              <li><Link href="#" className="hover:text-primary transition">The Kitchen</Link></li>
              <li><Link href="#" className="hover:text-primary transition">Reservations</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-xl font-bold mb-6">Contact</h4>
            <ul className="space-y-4 text-muted-foreground font-medium">
              <li>info@food4u.com</li>
              <li>+1 (234) 567-890</li>
              <li>123 Gastronomy Ave, NY</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-20 mt-20 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
          <p>© 2024 Food4U • Crafted for Excellence</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary transition">Privacy</a>
            <a href="#" className="hover:text-primary transition">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
