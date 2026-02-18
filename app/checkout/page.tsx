"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import MapPicker from "@/components/MapPicker";
import { placeOrder } from "@/services/firestore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { MapPin, Phone, CreditCard, Clock, Truck, ChevronLeft, ShieldCheck, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const RESTAURANT = {
    id: "demo-restaurant",
    name: "Food4U HQ",
    location: { lat: 33.5731, lng: -7.5898 },
    deliveryRadiusKm: 10,
    pricePerKm: 2.5,
};

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export default function CheckoutPage() {
    const { items, subtotal, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();

    const [type, setType] = useState<"delivery" | "takeaway">("delivery");
    const [address, setAddress] = useState<{ lat: number; lng: number; formatted: string } | null>(null);
    const [distance, setDistance] = useState(0);
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [phone, setPhone] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (address && type === "delivery") {
            const d = calculateDistance(RESTAURANT.location.lat, RESTAURANT.location.lng, address.lat, address.lng);
            setDistance(d);
            setDeliveryFee(Number((d * RESTAURANT.pricePerKm).toFixed(2)));
        } else {
            setDeliveryFee(0);
        }
    }, [address, type]);

    const total = subtotal + deliveryFee;
    const isTooFar = type === "delivery" && distance > RESTAURANT.deliveryRadiusKm;

    const handlePlaceOrder = async () => {
        if (!user) { toast.error("Please sign in"); return; }
        if (type === "delivery" && !address) { toast.error("Select delivery address"); return; }
        if (isTooFar) { toast.error("Too far for delivery"); return; }
        if (!phone) { toast.error("Provide phone number"); return; }

        setIsLoading(true);
        try {
            const orderData = {
                restaurantId: RESTAURANT.id,
                userId: user.uid,
                userName: user.displayName,
                items,
                subtotal,
                deliveryFee,
                total,
                type,
                status: "pending",
                phone,
                deliveryAddress: address,
            };
            const orderId = await placeOrder(orderData);
            toast.success("Order confirmed!");
            clearCart();
            router.push(`/orders?id=${orderId}`);
        } catch (error) {
            toast.error("Failed to place order");
        } finally {
            setIsLoading(false);
        }
    };

    if (items.length === 0) return null; // Or redirect logic handled elsewhere

    return (
        <div className="min-h-screen bg-gray-50/50 pb-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <button onClick={() => router.back()} className="mb-8 flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">
                    <ChevronLeft size={16} /> Back to Menu
                </button>

                <div className="grid lg:grid-cols-3 gap-16 items-start">
                    <div className="lg:col-span-2 space-y-12">
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">Secure <span className="text-orange-500">Checkout</span></h1>
                            <p className="text-gray-400 font-bold">Complete your purchase details below.</p>
                        </div>

                        {/* Order Type */}
                        <div className="bg-white p-2 rounded-[28px] shadow-lg border border-gray-100 grid grid-cols-2 gap-2">
                            {['delivery', 'takeaway'].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setType(t as any)}
                                    className={`py-4 rounded-[20px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${type === t ? "bg-gray-900 text-white shadow-xl" : "text-gray-400 hover:bg-gray-50"}`}
                                >
                                    {t === 'delivery' ? <Truck size={18} /> : <Clock size={18} />} {t}
                                </button>
                            ))}
                        </div>

                        {/* Map Section */}
                        <AnimatePresence mode="wait">
                            {type === "delivery" && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden space-y-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500"><MapPin size={20} /></div>
                                        <h3 className="font-black text-lg text-gray-900">Delivery Location</h3>
                                    </div>
                                    <div className="h-[400px] rounded-[40px] overflow-hidden shadow-2xl shadow-gray-200/50 border-4 border-white relative z-0">
                                        <MapPicker
                                            restaurantLocation={RESTAURANT.location}
                                            onLocationSelect={(loc) => setAddress({ lat: loc.lat, lng: loc.lng, formatted: loc.address })}
                                        />
                                    </div>
                                    {isTooFar && (
                                        <div className="p-4 bg-red-50 text-red-600 rounded-xl font-bold text-sm text-center">
                                            Location is outside delivery zone ({distance.toFixed(1)}km)
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Contact Info */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500"><Phone size={20} /></div>
                                <h3 className="font-black text-lg text-gray-900">Contact Number</h3>
                            </div>
                            <input
                                type="tel"
                                placeholder="+1 (555) 000-0000"
                                className="w-full p-6 bg-white border border-gray-100 rounded-[28px] outline-none focus:ring-4 focus:ring-gray-100 font-bold text-xl transition-all shadow-sm focus:shadow-xl"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Order Summary "Receipt" */}
                    <div className="sticky top-28">
                        <motion.div
                            initial={{ y: 50, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gray-900 text-white p-8 rounded-[40px] shadow-2xl shadow-gray-900/40 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-red-500 to-purple-500" />

                            <h2 className="text-2xl font-black mb-8 flex items-center gap-2">
                                <CreditCard size={24} className="text-orange-500" /> Cart Summary
                            </h2>

                            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center group">
                                        <div className="flex items-center gap-3">
                                            <span className="text-gray-500 font-bold">{item.quantity}x</span>
                                            <span className="font-bold">{item.name}</span>
                                        </div>
                                        <span className="font-black">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/10 pt-6 space-y-3 mb-8">
                                <div className="flex justify-between text-sm text-gray-400 font-bold uppercase tracking-wider">
                                    Subtotal <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-400 font-bold uppercase tracking-wider">
                                    Delivery <span>${deliveryFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-3xl font-black text-white pt-4">
                                    Total <span>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={isLoading || isTooFar}
                                className="w-full py-5 bg-white text-gray-900 rounded-[24px] font-black text-lg uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl active:scale-95 flex items-center justify-center gap-2 group"
                            >
                                {isLoading ? (
                                    <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>Pay Order <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                                )}
                            </button>

                            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">
                                <ShieldCheck size={12} /> SSL Encrypted
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
