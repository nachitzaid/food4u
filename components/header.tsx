'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Menu, X, LogOut, LayoutDashboard, Search, ShoppingBag, UserCircle } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Menu', href: '/menu' },
    ...(user ? [{ label: 'Favorites', href: '/favorites' }, { label: 'Orders', href: '/orders' }, { label: 'Checkout', href: '/checkout' }] : []),
  ];

  const handleLogout = () => {
    signOut();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
      <div className="bg-primary text-primary-foreground text-xs font-semibold tracking-[0.3em] uppercase">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
          <span>Free delivery on orders over $20</span>
          <span className="hidden sm:inline">New combos dropped</span>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div whileHover={{ scale: 1.08, rotate: 6 }} className="text-primary">
              <ChefHat className="w-8 h-8" />
            </motion.div>
            <div className="leading-none">
              <span className="text-2xl font-serif font-bold text-foreground group-hover:text-primary transition-colors">
                Food4U
              </span>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">
                fresh · fast
              </p>
            </div>
          </Link>

          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-2 py-1 shadow-sm">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow'
                        : 'text-foreground/70 hover:text-foreground hover:bg-muted/70'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="px-4 py-2 rounded-full text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted/70 flex items-center gap-2 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="h-10 w-10 rounded-full border border-border/60 bg-card/70 text-foreground/70 hover:text-foreground hover:bg-muted/80 transition-colors grid place-items-center"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </motion.button>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden lg:block text-right">
                  <p className="text-sm font-medium text-foreground">{profile?.name || user.email}</p>
                  {isAdmin && <p className="text-xs text-accent">Admin</p>}
                </div>
                <motion.button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-2 py-1">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 rounded-full text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted/70 transition-colors"
                >
                  Sign In
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                  <Link
                    href="/auth/signup"
                    className="px-4 py-2 rounded-full text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </div>
            )}

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link
                href="/checkout"
                className="flex items-center gap-2 rounded-full bg-foreground text-background px-4 py-2 text-sm font-semibold shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                Cart
              </Link>
            </motion.div>
          </div>

          <div className="md:hidden ml-auto flex items-center gap-2">
            <Link
              href="/checkout"
              className="h-10 w-10 rounded-full bg-foreground text-background grid place-items-center"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full border border-border/60 bg-card/70 hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <motion.div
          initial={false}
          animate={{ height: isOpen ? 'auto' : 0 }}
          className="md:hidden overflow-hidden"
        >
          <div className="pt-4 pb-5 space-y-3 border-t border-border/60 mt-4">
            <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 rounded-full bg-card/80 border border-border/60 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted/80 transition-colors text-center"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="px-4 py-2 rounded-full bg-card/80 border border-border/60 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted/80 transition-colors text-center flex items-center justify-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin
                </Link>
              )}
            </div>

            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-2">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search dishes..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>

            {user ? (
              <motion.button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </motion.button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 rounded-full border border-border/60 bg-card/80 hover:bg-muted transition-colors text-center text-sm font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-center text-sm font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}

            {user && (
              <div className="flex items-center justify-between rounded-full border border-border/60 bg-card/70 px-4 py-2 text-sm text-foreground/80">
                <div className="flex items-center gap-2">
                  <UserCircle className="w-5 h-5" />
                  {profile?.name || user.email}
                </div>
                {isAdmin && <span className="text-xs text-accent">Admin</span>}
              </div>
            )}
          </div>
        </motion.div>
      </nav>
    </header>
  );
}
