"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/services/firebase";
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, X, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminMenuPage() {
    const { userData } = useAuth();
    const [items, setItems] = useState<any[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState({ name: "", price: 0, category: "Pizza", available: true });

    useEffect(() => {
        if (!userData?.restaurantId) return;

        const q = query(collection(db, "menuItems"), where("restaurantId", "==", userData.restaurantId));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsubscribe();
    }, [userData]);

    const handleAdd = async () => {
        if (!newItem.name || newItem.price <= 0) {
            toast.error("Please provide valid name and price");
            return;
        }

        try {
            await addDoc(collection(db, "menuItems"), {
                ...newItem,
                restaurantId: userData.restaurantId || "demo-restaurant",
            });
            toast.success("Item added successfully");
            setIsAdding(false);
            setNewItem({ name: "", price: 0, category: "Pizza", available: true });
        } catch (error) {
            toast.error("Failed to add item");
        }
    };

    const toggleAvailability = async (itemId: string, current: boolean) => {
        try {
            await updateDoc(doc(db, "menuItems", itemId), { available: !current });
            toast.success("Status updated");
        } catch (error) {
            toast.error("Update failed");
        }
    };

    const handleDelete = async (itemId: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await deleteDoc(doc(db, "menuItems", itemId));
            toast.success("Item deleted");
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    if (userData?.role !== "admin") return <div className="p-12 text-center font-bold">Access Denied</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-black text-gray-900">Manage Your Menu</h1>
                <button
                    onClick={() => setIsAdding(true)}
                    className="bg-orange-500 text-white px-8 py-4 rounded-2xl font-black hover:bg-orange-600 transition-all flex items-center gap-2"
                >
                    <Plus size={20} /> Add New Item
                </button>
            </div>

            <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Name</th>
                            <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Category</th>
                            <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Price</th>
                            <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        <AnimatePresence>
                            {isAdding && (
                                <motion.tr initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-orange-50/50">
                                    <td className="px-8 py-6"><input className="p-2 border rounded-lg w-full" placeholder="Name" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} /></td>
                                    <td className="px-8 py-6">
                                        <select className="p-2 border rounded-lg w-full" value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })}>
                                            <option>Pizza</option>
                                            <option>Burgers</option>
                                            <option>Salads</option>
                                            <option>Sides</option>
                                            <option>Desserts</option>
                                        </select>
                                    </td>
                                    <td className="px-8 py-6"><input type="number" className="p-2 border rounded-lg w-full" placeholder="Price" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: Number(e.target.value) })} /></td>
                                    <td className="px-8 py-6" />
                                    <td className="px-8 py-6 text-right flex justify-end gap-2">
                                        <button onClick={handleAdd} className="p-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600"><Check size={20} /></button>
                                        <button onClick={() => setIsAdding(false)} className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600"><X size={20} /></button>
                                    </td>
                                </motion.tr>
                            )}
                        </AnimatePresence>

                        {items.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-8 py-6 font-bold text-gray-900">{item.name}</td>
                                <td className="px-8 py-6 text-gray-500 font-medium">{item.category}</td>
                                <td className="px-8 py-6 font-black text-gray-900">${item.price.toFixed(2)}</td>
                                <td className="px-8 py-6">
                                    <button
                                        onClick={() => toggleAvailability(item.id, item.available)}
                                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${item.available ? 'bg-teal-50 text-teal-600' : 'bg-gray-100 text-gray-400'}`}
                                    >
                                        {item.available ? 'Available' : 'Sold Out'}
                                    </button>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-orange-50 hover:text-orange-500 transition-all"><Edit2 size={18} /></button>
                                        <button onClick={() => handleDelete(item.id)} className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
