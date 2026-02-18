"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/services/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import {
    Clock, CheckCircle2, Package, Truck, Utensils, AlertCircle, MapPin, ChevronRight, ShoppingBag
} from "lucide-react";
import Link from "next/link";

const STATUS_CONFIG = {
    pending: { icon: Clock, color: "text-blue-500", bg: "bg-blue-50", label: "Order Received", step: 1, desc: "We've received your order." },
    accepted: { icon: CheckCircle2, color: "text-indigo-500", bg: "bg-indigo-50", label: "Accepted", step: 2, desc: "Restaurant accepted your order." },
    preparing: { icon: Utensils, color: "text-orange-500", bg: "bg-orange-50", label: "Cooking", step: 3, desc: "Chefs are working their magic." },
    out_for_delivery: { icon: Truck, color: "text-purple-500", bg: "bg-purple-50", label: "On the way", step: 4, desc: "Your food is traveling to you." },
    delivered: { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50", label: "Delivered", step: 5, desc: "Enjoy your meal!" },
    rejected: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-50", label: "Cancelled", step: 0, desc: "Order could not be fulfilled." },
};

export default function OrdersPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, "orders"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setOrders(ordersData);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [user]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <div className="w-12 h-12 border-4 border-gray-100 border-t-red-600 rounded-full animate-spin mb-4" />
            <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">Syncing</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50/50 pb-32">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="mb-16">
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-2">Order <span className="text-red-600">History</span></h1>
                    <p className="text-gray-400 font-bold">Track your culinary journeys.</p>
                </div>

                <div className="space-y-8">
                    {orders.length > 0 ? (
                        orders.map((order, orderIdx) => {
                            const statusInfo = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
                            const StatusIcon = statusInfo.icon;
                            const currentStep = statusInfo.step;

                            return (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: orderIdx * 0.1 }}
                                    className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 overflow-hidden border border-white group"
                                >
                                    <div className="p-8">
                                        <div className="flex justify-between items-start mb-8">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusInfo.bg} ${statusInfo.color}`}>
                                                        {statusInfo.label}
                                                    </span>
                                                    <span className="text-gray-300 text-[10px] font-black uppercase tracking-widest">#{order.id.slice(0, 6)}</span>
                                                </div>
                                                <h3 className="font-black text-2xl text-gray-900">
                                                    {order.type === "delivery" ? "Delivery Order" : "Pickup Order"}
                                                </h3>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-3xl font-black text-gray-900 tracking-tighter">${order.total.toFixed(2)}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Paid</p>
                                            </div>
                                        </div>

                                        {/* Timeline */}
                                        <div className="relative mb-12 px-2">
                                            <div className="absolute top-1/2 left-0 w-full h-1.5 bg-gray-100 rounded-full -translate-y-1/2 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(currentStep / 5) * 100}%` }}
                                                    transition={{ duration: 1, ease: "circOut" }}
                                                    className={`h-full ${statusInfo.color.replace('text', 'bg')} rounded-full`}
                                                />
                                            </div>
                                            <div className="relative flex justify-between z-10 w-full">
                                                {Object.entries(STATUS_CONFIG).filter(([k]) => k !== 'rejected').map(([key, config], i) => {
                                                    const isActive = currentStep >= config.step;
                                                    const isCurrent = currentStep === config.step;

                                                    return (
                                                        <div key={key} className="flex flex-col items-center gap-3 group/step">
                                                            <motion.div
                                                                animate={{ scale: isCurrent ? 1.2 : 1 }}
                                                                className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all duration-500 bg-white ${isActive ? `border-${config.color.split('-')[1]}-500 shadow-lg` : 'border-gray-100'}`}
                                                            >
                                                                {isActive && <div className={`w-2 h-2 rounded-full ${config.color.replace('text', 'bg')}`} />}
                                                            </motion.div>
                                                            <span className={`absolute -bottom-8 text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-colors ${isCurrent ? "text-gray-900" : "text-gray-300 opacity-0 group-hover/step:opacity-100"}`}>
                                                                {config.label}
                                                            </span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-[32px] p-6 flex flex-col gap-4">
                                            {order.items.map((item: any, idx: number) => (
                                                <div key={idx} className="flex justify-between items-center text-sm">
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-black text-gray-400">{item.quantity}x</span>
                                                        <span className="font-bold text-gray-700">{item.name}</span>
                                                    </div>
                                                    <span className="font-black text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                            ))}
                                            <div className="border-t border-gray-200/50 pt-4 mt-2 flex justify-between items-center text-xs">
                                                <span className="font-bold text-gray-400 uppercase tracking-wider">Date</span>
                                                <span className="font-black text-gray-900">{new Date(order.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="text-center py-20">
                            <ShoppingBag className="mx-auto text-gray-200 mb-4" size={48} />
                            <h3 className="text-xl font-black text-gray-900 mb-2">No orders yet</h3>
                            <Link href="/menu" className="text-red-600 font-bold hover:underline">Start ordering</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
