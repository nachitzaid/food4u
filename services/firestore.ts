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
    serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";

// Menu Items CRUD
export const getMenuItems = async (restaurantId: string) => {
    const q = query(
        collection(db, "menuItems"),
        where("restaurantId", "==", restaurantId),
        where("available", "==", true)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Orders CRUD
export const placeOrder = async (orderData: any) => {
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
    await updateDoc(orderRef, { status });
};
