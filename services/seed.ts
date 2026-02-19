import { collection, addDoc, serverTimestamp, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";

const MENU_ITEMS = [
    {
        name: "Classic Margherita Pizza",
        description: "Fresh mozzarella, tomato sauce, basil, and extra virgin olive oil.",
        price: 12.99,
        category: "Pizza",
        image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=800",
        calories: 820,
        protein: 32,
        carbs: 95,
        fat: 28,
        available: true,
        ingredients: [
            { name: "Mozzarella", removable: true },
            { name: "Basil", removable: true },
            { name: "Tomato Sauce", removable: false }
        ],
        extras: [
            { name: "Extra Cheese", price: 2.00 },
            { name: "Pepperoni", price: 1.50 }
        ]
    },
    {
        name: "Truffle Mushroom Burger",
        description: "Wagyu beef patty, wild mushrooms, truffle aioli, and swiss cheese on a brioche bun.",
        price: 16.50,
        category: "Burgers",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800",
        calories: 980,
        protein: 52,
        carbs: 45,
        fat: 65,
        available: true,
        ingredients: [
            { name: "Wagyu Beef", removable: false },
            { name: "Swiss Cheese", removable: true },
            { name: "Truffle Aioli", removable: true }
        ],
        extras: [
            { name: "Bacon", price: 2.50 },
            { name: "Fried Egg", price: 1.50 }
        ]
    },
    {
        name: "Artisanal Berry Mocktail",
        description: "Fresh seasonal berries, hibiscus infusion, sparkling lime, and fresh mint. A refreshing masterpiece.",
        price: 8.50,
        category: "Drinks",
        image: "https://images.unsplash.com/photo-1513558161293-cdaf7659a19d?q=80&w=800",
        calories: 120,
        protein: 1,
        carbs: 28,
        fat: 0,
        available: true,
        ingredients: [
            { name: "Berries", removable: false },
            { name: "Mint", removable: true },
            { name: "Ice", removable: true }
        ],
        extras: [
            { name: "Extra Berries", price: 1.50 }
        ]
    },
    {
        name: "Blueberry Iced Tea",
        description: "Premium blue flower tea chilled with wild blueberry syrup and lemon slices.",
        price: 6.99,
        category: "Drinks",
        image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800",
        calories: 85,
        protein: 0,
        carbs: 20,
        fat: 0,
        available: true,
        ingredients: [
            { name: "Blueberry", removable: false },
            { name: "Tea", removable: false },
            { name: "Sugar", removable: true }
        ],
        extras: []
    }
];

export const seedMenu = async (restaurantId: string = 'demo-restaurant') => {
    try {
        // Check if we already have items to avoid duplicates
        const q = query(collection(db, "menuItems"), where("restaurantId", "==", restaurantId));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            console.log("Menu already seeded.");
            return;
        }

        const promises = MENU_ITEMS.map(item =>
            addDoc(collection(db, "menuItems"), {
                ...item,
                restaurantId,
                createdAt: serverTimestamp()
            })
        );

        await Promise.all(promises);
        console.log("Menu successfully seeded!");
    } catch (error) {
        console.error("Error seeding menu:", error);
        throw error;
    }
};
