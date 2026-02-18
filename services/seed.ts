"use client";

import { db } from "./firebase";
import { collection, setDoc, doc, addDoc } from "firebase/firestore";

const DEMO_RESTAURANT = {
    name: "Food4U Gourmet HQ",
    location: { lat: 33.5731, lng: -7.5898 },
    deliveryRadiusKm: 15,
    pricePerKm: 2.5,
    isOpen: true,
};

const DEMO_MENU = [
    { name: "Signature Mediterranean Pizza", price: 18.50, category: "Pizza", available: true },
    { name: "Black Angus Truffle Burger", price: 21.00, category: "Burgers", available: true },
    { name: "Crispy Halloumi Salad", price: 14.50, category: "Salads", available: true },
    { name: "Thick-Cut Parmesan Fries", price: 7.99, category: "Sides", available: true },
    { name: "Dark Chocolate Fondant", price: 9.99, category: "Desserts", available: true },
];

export const seedDatabase = async () => {
    try {
        // Create demo restaurant
        const restaurantRef = doc(db, "restaurants", "demo-restaurant");
        await setDoc(restaurantRef, DEMO_RESTAURANT);

        // Create menu items
        const menuItemsCol = collection(db, "menuItems");
        for (const item of DEMO_MENU) {
            await addDoc(menuItemsCol, {
                ...item,
                restaurantId: "demo-restaurant",
            });
        }

        console.log("Database seeded successfully!");
        alert("Database seeded! You can now browse the menu.");
    } catch (error) {
        console.error("Error seeding database:", error);
        alert("Seeding failed. Check console.");
    }
};
