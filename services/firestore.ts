import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    onSnapshot,
    getDocs,
    serverTimestamp,
    Unsubscribe,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";

// ─── Menu Items ────────────────────────────────────────────────────────────────

export const getMenuItems = async (restaurantId: string) => {
    const q = query(
        collection(db, "menuItems"),
        where("restaurantId", "==", restaurantId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// ─── Image Upload ──────────────────────────────────────────────────────────────

export const uploadImage = async (file: File, path: string) => {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
};

// ─── Orders ────────────────────────────────────────────────────────────────────

export const placeOrder = async (orderData: Record<string, unknown>) => {
    try {
        const docRef = await addDoc(collection(db, "orders"), {
            ...orderData,
            status: "pending",
            createdAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error("Error placing order:", error);
        throw error;
    }
};

export const updateOrderStatus = async (orderId: string, status: string) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status, updatedAt: serverTimestamp() });
};

/**
 * Real-time listener for a specific user's orders.
 * Returns an unsubscribe function.
 */
export const subscribeToUserOrders = (
    userId: string,
    callback: (orders: Record<string, unknown>[]) => void
): Unsubscribe => {
    const q = query(
        collection(db, "orders"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
    );
    return onSnapshot(q, snapshot => {
        const orders = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Convert Firestore Timestamp to JS Date
            createdAt: doc.data().createdAt?.toDate?.() ?? new Date(),
        }));
        callback(orders);
    });
};

/**
 * Real-time listener for ALL orders (admin use).
 * Returns an unsubscribe function.
 */
export const subscribeToAllOrders = (
    callback: (orders: Record<string, unknown>[]) => void
): Unsubscribe => {
    const q = query(
        collection(db, "orders"),
        orderBy("createdAt", "desc")
    );
    return onSnapshot(q, snapshot => {
        const orders = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.() ?? new Date(),
        }));
        callback(orders);
    });
};

// ─── Admin: Menu Management ────────────────────────────────────────────────────

export const addMenuItem = async (
    restaurantId: string,
    item: Record<string, unknown>
) => {
    const docRef = await addDoc(collection(db, "menuItems"), {
        ...item,
        restaurantId,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
};

export const updateMenuItem = async (
    restaurantId: string,
    itemId: string,
    updates: Record<string, unknown>
) => {
    const itemRef = doc(db, "menuItems", itemId);
    const { id, ...data } = updates as any;
    await updateDoc(itemRef, { ...data, restaurantId, updatedAt: serverTimestamp() });
};

export const deleteMenuItem = async (restaurantId: string, itemId: string) => {
    await deleteDoc(doc(db, "menuItems", itemId));
};
