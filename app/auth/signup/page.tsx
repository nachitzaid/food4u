'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePassword = (pwd: string) => {
    return pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('Password must be at least 8 characters with uppercase and numbers');
      return;
    }

    if (!agreedToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      // Simulate registration - replace with Firebase/Auth.js
      localStorage.setItem('user', JSON.stringify({ name: formData.name, email: formData.email, isAdmin: false }));
      router.push('/menu');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = formData.password ? validatePassword(formData.password) ? 'strong' : 'weak' : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <motion.h1
            className="text-4xl font-serif font-bold text-primary mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Food4U
          </motion.h1>
          <p className="text-muted-foreground">Join us for premium dining experiences</p>
        </div>

        {/* Signup Form */}
        <motion.div
          className="bg-card rounded-lg shadow-lg p-8 border border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {error && (
            <motion.div
              className="mb-4 p-3 bg-destructive/10 border border-destructive text-destructive rounded-md text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`h-1 flex-1 rounded-full ${passwordStrength === 'strong' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className={passwordStrength === 'strong' ? 'text-green-600' : 'text-red-600'}>
                      {passwordStrength === 'strong' ? 'Strong' : 'Weak'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirm ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {formData.password && formData.confirmPassword && (
                <div className="mt-2 text-sm flex items-center gap-2">
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-green-600">Passwords match</span>
                    </>
                  ) : (
                    <span className="text-red-600">Passwords don't match</span>
                  )}
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 rounded border-border cursor-pointer"
              />
              <label htmlFor="terms" className="cursor-pointer text-muted-foreground">
                I agree to the{' '}
                <Link href="/terms" className="text-primary hover:underline">
                  terms and conditions
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </motion.button>
          </form>
        </motion.div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
