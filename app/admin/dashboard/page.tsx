"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { db } from "@/services/firebase";
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import {
    Clock, CheckCircle2, TrendingUp, Package, Truck,
    XCircle, ChefHat, ShoppingBag, Activity
} from "lucide-react";
import toast from "react-hot-toast";

const STATUS_ACTIONS = {
    pending: { label: "Accept Order", next: "accepted", icon: CheckCircle2, color: "bg-indigo-500" },
    accepted: { label: "Start Cooking", next: "preparing", icon: ChefHat, color: "bg-orange-500" },
    preparing: { label: "Send for Delivery", next: "out_for_delivery", icon: Truck, color: "bg-purple-500" },
    out_for_delivery: { label: "Mark Delivered", next: "delivered", icon: CheckCircle2, color: "bg-green-500" },
};

export default function AdminDashboard() {
    const { user, userData, loading } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => {
        if (!loading && (!user || userData?.role !== "admin")) {
            router.push("/");
        }
    }, [user, userData, loading, router]);

    useEffect(() => {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setOrders(ordersData);
        });
        return () => unsubscribe();
    }, []);

    const updateStatus = async (orderId: string, newStatus: string) => {
        try {
            await updateDoc(doc(db, "orders", orderId), { status: newStatus });
            toast.success(`Order updated to ${newStatus.replace(/_/g, " ")}`);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    if (loading || !userData) return null;

    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        active: orders.filter(o => ['accepted', 'preparing', 'out_for_delivery'].includes(o.status)).length,
        revenue: orders.reduce((acc, o) => acc + (o.total || 0), 0)
    };

    return (
        <div className="min-h-screen bg-gray-900 pb-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-red-500 font-bold uppercase tracking-widest text-xs">Live Command Center</span>
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tighter">Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Dashboard</span></h1>
                    </div>
                </div>

                {/* Live Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="bg-white/5 border border-white/10 p-6 rounded-[32px] backdrop-blur-md relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                            <Activity className="text-red-500" size={32} />
                        </div>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">Live Orders</p>
                        <h3 className="text-4xl font-black text-white">{stats.active}</h3>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="bg-white/5 border border-white/10 p-6 rounded-[32px] backdrop-blur-md"
                    >
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">Pending</p>
                        <h3 className="text-4xl font-black text-white">{stats.pending}</h3>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="bg-white/5 border border-white/10 p-6 rounded-[32px] backdrop-blur-md"
                    >
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">Total Orders</p>
                        <h3 className="text-4xl font-black text-white">{stats.total}</h3>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                        className="bg-gradient-to-br from-red-600 to-orange-600 p-6 rounded-[32px] shadow-2xl shadow-red-900/50"
                    >
                        <p className="text-white/80 font-bold text-xs uppercase tracking-widest mb-1">Total Revenue</p>
                        <h3 className="text-4xl font-black text-white">${stats.revenue.toFixed(2)}</h3>
                    </motion.div>
                </div>

                {/* Active Orders Channel */}
                <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                    <TrendingUp className="text-green-500" /> Active Stream
                </h2>

                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {orders.map((order) => (
                            <motion.div
                                key={order.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={`p-6 rounded-[32px] border transition-all ${order.status === 'pending' ? 'bg-indigo-900/20 border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.1)]' :
                                        order.status === 'delivered' ? 'bg-white/5 border-white/5 opacity-60' :
                                            order.status === 'rejected' ? 'bg-red-900/10 border-red-500/20 opacity-50' :
                                                'bg-gray-800/50 border-gray-700'
                                    }`}
                            >
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'pending' ? 'bg-blue-500/20 text-blue-400' :
                                                    order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                                                        'bg-gray-700 text-gray-300'
                                                }`}>
                                                {order.status.replace(/_/g, " ")}
                                            </span>
                                            <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">#{order.id.slice(0, 8)}</span>
                                            <span className="text-gray-500 text-[10px] font-bold">{new Date(order.createdAt?.seconds * 1000).toLocaleTimeString()}</span>
                                        </div>
                                        <h3 className="text-xl font-black text-white mb-1">{order.userName || 'Guest'}</h3>
                                        <p className="text-gray-400 text-sm font-medium">
                                            {order.items.map((i: any) => `${i.quantity}x ${i.name}`).join(', ')}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-white">${order.total?.toFixed(2)}</p>
                                        </div>

                                        <div className="flex gap-2">
                                            {STATUS_ACTIONS[order.status as keyof typeof STATUS_ACTIONS] && (
                                                <button
                                                    onClick={() => updateStatus(order.id, STATUS_ACTIONS[order.status as keyof typeof STATUS_ACTIONS].next)}
                                                    className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-white hover:scale-105 transition-all shadow-lg active:scale-95 flex items-center gap-2 ${STATUS_ACTIONS[order.status as keyof typeof STATUS_ACTIONS].color}`}
                                                >
                                                    <STATUS_ACTIONS.pending.icon size={14} />
                                                    {STATUS_ACTIONS[order.status as keyof typeof STATUS_ACTIONS].label}
                                                </button>
                                            )}

                                            {order.status !== 'delivered' && order.status !== 'rejected' && (
                                                <button
                                                    onClick={() => updateStatus(order.id, 'rejected')}
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                                    title="Reject Order"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
