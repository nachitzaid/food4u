'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';

export function Header() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="text-primary"
            >
              <ChefHat className="w-8 h-8" />
            </motion.div>
            <span className="text-2xl font-serif font-bold text-foreground group-hover:text-primary transition-colors">
              Food4U
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/menu"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Menu
            </Link>
            <Link
              href="/orders"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Orders
            </Link>
            {user?.isAdmin && (
              <Link
                href="/admin"
                className="text-foreground hover:text-primary transition-colors font-medium flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                Admin
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <p className="font-medium text-foreground">{user.name || user.email}</p>
                  {user.isAdmin && <p className="text-xs text-accent">Admin</p>}
                </div>
                <motion.button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors font-medium"
                >
                  Sign In
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/auth/signup"
                    className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-md transition-colors"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{ height: isOpen ? 'auto' : 0 }}
          className="md:hidden overflow-hidden"
        >
          <div className="pt-4 pb-3 space-y-3 border-t border-border mt-4">
            <Link
              href="/menu"
              className="block px-4 py-2 rounded-md hover:bg-muted transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Menu
            </Link>
            <Link
              href="/orders"
              className="block px-4 py-2 rounded-md hover:bg-muted transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Orders
            </Link>
            {user?.isAdmin && (
              <Link
                href="/admin"
                className="block px-4 py-2 rounded-md hover:bg-muted transition-colors flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <LayoutDashboard className="w-4 h-4" />
                Admin
              </Link>
            )}

            {user ? (
              <motion.button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </motion.button>
            ) : (
              <div className="space-y-2 pt-2">
                <Link
                  href="/auth/login"
                  className="block px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="block px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </nav>
    </header>
  );
}
