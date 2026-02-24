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
    getDoc,
    serverTimestamp,
    Unsubscribe,
    Timestamp,
    setDoc,
    arrayUnion,
    arrayRemove,
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

export const getAllMenuItems = async () => {
    const q = query(collection(db, "menuItems"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getMenuItemsByIds = async (ids: string[]) => {
    if (!ids.length) return [];
    const q = query(collection(db, "menuItems"), where("__name__", "in", ids.slice(0, 10)));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// ─── User Favorites ──────────────────────────────────────────────────────────

export const getUserFavorites = async (userId: string): Promise<string[]> => {
    const snap = await getDoc(doc(db, "users", userId));
    const data = snap.data() as any;
    return Array.isArray(data?.favorites) ? data.favorites : [];
};

export const toggleUserFavorite = async (userId: string, itemId: string, isFav: boolean) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
        favorites: isFav ? arrayRemove(itemId) : arrayUnion(itemId),
        updatedAt: serverTimestamp(),
    });
};

// ─── Cart (3-minute TTL) ──────────────────────────────────────────────────────

export const getUserCart = async (userId: string) => {
    const snap = await getDoc(doc(db, "carts", userId));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const saveUserCart = async (
    userId: string,
    items: Record<string, unknown>[],
    expiresAt: Date
) => {
    const cartRef = doc(db, "carts", userId);
    await setDoc(
        cartRef,
        {
            items,
            expiresAt: Timestamp.fromDate(expiresAt),
            updatedAt: serverTimestamp(),
        },
        { merge: true }
    );
};

export const deleteUserCart = async (userId: string) => {
    await deleteDoc(doc(db, "carts", userId));
};

// ─── Deals ───────────────────────────────────────────────────────────────────

export const getDeals = async (restaurantId: string) => {
    try {
        const q = query(
            collection(db, "deals"),
            where("restaurantId", "==", restaurantId),
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        // Fallback without index: fetch then sort client-side
        const q = query(
            collection(db, "deals"),
            where("restaurantId", "==", restaurantId)
        );
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
        items.sort((a, b) => {
            const aTime = a.createdAt?.toDate?.() ?? a.createdAt ?? 0;
            const bTime = b.createdAt?.toDate?.() ?? b.createdAt ?? 0;
            return new Date(bTime).getTime() - new Date(aTime).getTime();
        });
        return items;
    }
};

export const addDeal = async (restaurantId: string, deal: Record<string, unknown>) => {
    const docRef = await addDoc(collection(db, "deals"), {
        ...deal,
        restaurantId,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
};

export const updateDeal = async (restaurantId: string, dealId: string, updates: Record<string, unknown>) => {
    const dealRef = doc(db, "deals", dealId);
    const { id, ...data } = updates as any;
    await updateDoc(dealRef, { ...data, restaurantId, updatedAt: serverTimestamp() });
};

export const deleteDeal = async (dealId: string) => {
    await deleteDoc(doc(db, "deals", dealId));
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
