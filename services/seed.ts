import { collection, addDoc, serverTimestamp, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

const CATEGORY_CONFIG = [
    {
        category: "Pasta",
        basePrice: 8.5,
        baseCalories: 610,
        baseProtein: 18,
        image: "https://images.unsplash.com/photo-1521389508051-d7ffb5dc8f6f?q=80&w=900",
        items: [
            "Alfredo Pasta",
            "Spaghetti Bolognese",
            "Pesto Penne",
            "Arrabbiata",
            "Creamy Mushroom",
            "Macaroni",
            "Seafood Pasta",
            "Chicken Alfredo",
            "Beef Ragu",
            "Veggie Pasta",
            "Truffle Tagliatelle",
            "Penne Pomodoro",
            "Spicy Shrimp Linguine"
        ]
    },
    {
        category: "Salad",
        basePrice: 6.5,
        baseCalories: 320,
        baseProtein: 10,
        image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=900",
        items: [
            "Caprese Salad",
            "Caesar Salad",
            "Greek Salad",
            "Garden Salad",
            "Cobb Salad",
            "Avocado Salad",
            "Quinoa Salad",
            "Kale Crunch Salad",
            "Roasted Beet Salad",
            "Citrus Salad",
            "Mediterranean Salad",
            "Chicken Salad",
            "Tuna Salad"
        ]
    },
    {
        category: "Seafood",
        basePrice: 10.25,
        baseCalories: 520,
        baseProtein: 30,
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=900",
        items: [
            "Lemon Cod",
            "Grilled Salmon",
            "Fish & Chips",
            "Garlic Shrimp",
            "Cajun Shrimp",
            "Seafood Bowl",
            "Crispy Shrimp Wrap",
            "Seafood Paella",
            "Tuna Melt",
            "Lobster Roll",
            "Herb Butter Cod",
            "Spicy Calamari",
            "Citrus Salmon"
        ]
    },
    {
        category: "Soups",
        basePrice: 5.25,
        baseCalories: 260,
        baseProtein: 8,
        image: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=900",
        items: [
            "Tomato Basil Soup",
            "Chicken Noodle Soup",
            "Mushroom Soup",
            "Lentil Soup",
            "Minestrone",
            "Seafood Chowder",
            "Sweet Corn Soup",
            "Hot & Sour Soup",
            "Creamy Broccoli Soup",
            "Beef Barley Soup",
            "Roasted Pepper Soup",
            "Pumpkin Soup",
            "Vegetable Soup"
        ]
    },
    {
        category: "Roasted Meats",
        basePrice: 11.5,
        baseCalories: 680,
        baseProtein: 35,
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=900",
        items: [
            "Roasted Chicken",
            "Herb Roasted Turkey",
            "Garlic Beef Roast",
            "Rosemary Lamb",
            "Pepper Crusted Steak",
            "Smoked Brisket",
            "Honey Glazed Ham",
            "BBQ Ribs",
            "Citrus Pork Roast",
            "Maple Glazed Duck",
            "Cajun Roast Beef",
            "Chili Rubbed Chicken"
        ]
    },
    {
        category: "Oven-Baked",
        basePrice: 9.25,
        baseCalories: 540,
        baseProtein: 20,
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=900",
        items: [
            "Oven-Baked Lasagna",
            "Baked Ziti",
            "Baked Salmon",
            "Baked Chicken Parmesan",
            "Stuffed Peppers",
            "Baked Eggplant",
            "Baked Mac & Cheese",
            "Baked Meatballs",
            "Baked Falafel",
            "Baked Potato",
            "Oven-Baked Meatloaf",
            "Baked Ratatouille"
        ]
    },
    {
        category: "Plant-Based",
        basePrice: 7.75,
        baseCalories: 420,
        baseProtein: 16,
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=900",
        items: [
            "Vegan Bowl",
            "Tofu Stir Fry",
            "Chickpea Curry",
            "Veggie Skewers",
            "Plant Burger",
            "Lentil Stew",
            "Grilled Veggie Plate",
            "Vegan Tacos",
            "Mushroom Risotto",
            "Vegan Burrito",
            "Quinoa Power Bowl",
            "Cauliflower Steak"
        ]
    },
    {
        category: "Rice",
        basePrice: 6.75,
        baseCalories: 520,
        baseProtein: 12,
        image: "https://images.unsplash.com/photo-1543353071-873f17a7a088?q=80&w=900",
        items: [
            "Chicken Biryani",
            "Veggie Biryani",
            "Seafood Fried Rice",
            "Teriyaki Rice Bowl",
            "Beef Rice Bowl",
            "Coconut Rice",
            "Spicy Rice Bowl",
            "Mushroom Rice",
            "Lemon Rice",
            "Herb Rice Bowl",
            "BBQ Rice Bowl",
            "Mediterranean Rice"
        ]
    }
];

const INGREDIENTS_BY_CATEGORY: Record<string, { name: string; removable: boolean }[]> = {
    "Pasta": [
        { name: "Pasta", removable: false },
        { name: "Parmesan", removable: true },
        { name: "Garlic", removable: true },
        { name: "Olive Oil", removable: true },
        { name: "Herbs", removable: true }
    ],
    "Salad": [
        { name: "Mixed Greens", removable: false },
        { name: "Tomato", removable: true },
        { name: "Cucumber", removable: true },
        { name: "Onion", removable: true },
        { name: "Dressing", removable: true }
    ],
    "Seafood": [
        { name: "Seafood", removable: false },
        { name: "Butter", removable: true },
        { name: "Lemon", removable: true },
        { name: "Herbs", removable: true },
        { name: "Garlic", removable: true }
    ],
    "Soups": [
        { name: "Broth", removable: false },
        { name: "Vegetables", removable: true },
        { name: "Herbs", removable: true },
        { name: "Cream", removable: true }
    ],
    "Roasted Meats": [
        { name: "Roasted Meat", removable: false },
        { name: "Garlic", removable: true },
        { name: "Herbs", removable: true },
        { name: "Spice Rub", removable: true }
    ],
    "Oven-Baked": [
        { name: "Cheese", removable: true },
        { name: "Tomato Sauce", removable: true },
        { name: "Herbs", removable: true },
        { name: "Olive Oil", removable: true }
    ],
    "Plant-Based": [
        { name: "Vegetables", removable: false },
        { name: "Tofu", removable: true },
        { name: "Herbs", removable: true },
        { name: "Sauce", removable: true }
    ],
    "Rice": [
        { name: "Rice", removable: false },
        { name: "Herbs", removable: true },
        { name: "Spices", removable: true },
        { name: "Vegetables", removable: true }
    ]
};

const KEYWORD_INGREDIENTS: Array<{ keyword: string; ingredients: { name: string; removable: boolean }[] }> = [
    { keyword: "lemon", ingredients: [{ name: "Lemon", removable: true }] },
    { keyword: "garlic", ingredients: [{ name: "Garlic", removable: true }] },
    { keyword: "herb", ingredients: [{ name: "Herbs", removable: true }] },
    { keyword: "spicy", ingredients: [{ name: "Chili Flakes", removable: true }, { name: "Spices", removable: true }] },
    { keyword: "bbq", ingredients: [{ name: "BBQ Sauce", removable: true }] },
    { keyword: "alfredo", ingredients: [{ name: "Alfredo Sauce", removable: true }, { name: "Parmesan", removable: true }] },
    { keyword: "pesto", ingredients: [{ name: "Pesto Sauce", removable: true }] },
    { keyword: "tomato", ingredients: [{ name: "Tomato", removable: true }, { name: "Tomato Sauce", removable: true }] },
    { keyword: "mushroom", ingredients: [{ name: "Mushrooms", removable: true }] },
    { keyword: "cheese", ingredients: [{ name: "Cheese", removable: true }] },
    { keyword: "basil", ingredients: [{ name: "Basil", removable: true }] },
    { keyword: "cream", ingredients: [{ name: "Cream", removable: true }] },
    { keyword: "cajun", ingredients: [{ name: "Cajun Spice", removable: true }] },
    { keyword: "teriyaki", ingredients: [{ name: "Teriyaki Sauce", removable: true }] },
    { keyword: "citrus", ingredients: [{ name: "Citrus Zest", removable: true }] },
    { keyword: "grilled", ingredients: [{ name: "Olive Oil", removable: true }] }
];

const PROTEIN_KEYWORDS: Array<{ keyword: string; ingredient: { name: string; removable: boolean } }> = [
    { keyword: "chicken", ingredient: { name: "Chicken", removable: false } },
    { keyword: "beef", ingredient: { name: "Beef", removable: false } },
    { keyword: "salmon", ingredient: { name: "Salmon", removable: false } },
    { keyword: "shrimp", ingredient: { name: "Shrimp", removable: false } },
    { keyword: "cod", ingredient: { name: "Cod", removable: false } },
    { keyword: "tuna", ingredient: { name: "Tuna", removable: false } },
    { keyword: "lamb", ingredient: { name: "Lamb", removable: false } },
    { keyword: "pork", ingredient: { name: "Pork", removable: false } },
    { keyword: "turkey", ingredient: { name: "Turkey", removable: false } },
    { keyword: "tofu", ingredient: { name: "Tofu", removable: false } },
    { keyword: "veggie", ingredient: { name: "Vegetables", removable: false } },
    { keyword: "vegetable", ingredient: { name: "Vegetables", removable: false } },
    { keyword: "mushroom", ingredient: { name: "Mushrooms", removable: false } },
    { keyword: "seafood", ingredient: { name: "Seafood", removable: false } }
];

function generateIngredients(name: string, category: string) {
    const tokens = name.toLowerCase();
    const ingredients: { name: string; removable: boolean }[] = [];

    // Base ingredient by category
    const base = INGREDIENTS_BY_CATEGORY[category]?.[0];
    if (base) ingredients.push(base);

    // Protein by keyword
    for (const p of PROTEIN_KEYWORDS) {
        if (tokens.includes(p.keyword)) {
            ingredients.unshift(p.ingredient);
            break;
        }
    }

    // Category-specific fixed bases
    if (category === "Salad" && !ingredients.find(i => i.name === "Mixed Greens")) {
        ingredients.unshift({ name: "Mixed Greens", removable: false });
    }
    if (category === "Soups" && !ingredients.find(i => i.name === "Broth")) {
        ingredients.unshift({ name: "Broth", removable: false });
    }
    if (category === "Rice" && !ingredients.find(i => i.name === "Rice")) {
        ingredients.unshift({ name: "Rice", removable: false });
    }

    // Keyword-based additions
    for (const k of KEYWORD_INGREDIENTS) {
        if (tokens.includes(k.keyword)) {
            ingredients.push(...k.ingredients);
        }
    }

    // Category default additions
    const categoryDefaults = INGREDIENTS_BY_CATEGORY[category] ?? [];
    for (const d of categoryDefaults) {
        ingredients.push(d);
    }

    // Deduplicate by name, keep first occurrence (fixed preferred)
    const seen = new Set<string>();
    const unique = ingredients.filter((ing) => {
        const key = ing.name.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    // Keep 4-6 ingredients max
    return unique.slice(0, 6);
}

const MENU_ITEMS = CATEGORY_CONFIG.flatMap((cfg, categoryIndex) =>
    cfg.items.map((name, idx) => {
        const price = Number((cfg.basePrice + (idx % 3) * 0.75).toFixed(2));
        const calories = cfg.baseCalories + (idx % 5) * 40;
        const protein = cfg.baseProtein + (idx % 4) * 3;
        return {
            name,
            description: `Our ${name.toLowerCase()} is crafted fresh with premium ingredients and bold flavor.`,
            price,
            category: cfg.category,
            image: cfg.image,
            calories,
            protein,
            carbs: 30 + (idx % 6) * 8,
            fat: 8 + (idx % 5) * 4,
            isAvailable: true,
            sizes: [
                { label: "380g", priceDelta: 0 },
                { label: "480g", priceDelta: 2 },
                { label: "560g", priceDelta: 4 }
            ],
            ingredients: generateIngredients(name, cfg.category),
            extras: [
                { name: "Extra Cheese", price: 1.5 },
                { name: "Add Bacon", price: 2.0 }
            ],
            pairings: [
                { name: "Caprese Salad", price: 3.5 },
                { name: "Tomato Sauce", price: 0.75 },
                { name: "Iced Lemonade", price: 1.5 }
            ]
        };
    })
);

const RESTAURANT = {
    id: "demo-restaurant",
    name: "Food4U Downtown",
    description: "Fresh, fast, and flame-grilled favorites made to order.",
    phone: "+1 (555) 212-9001",
    email: "hello@food4u.example",
    address: "120 Market St, San Francisco, CA",
    hours: {
        mon: "10:00-22:00",
        tue: "10:00-22:00",
        wed: "10:00-22:00",
        thu: "10:00-22:00",
        fri: "10:00-23:00",
        sat: "11:00-23:00",
        sun: "11:00-21:00"
    },
    heroImage: "https://images.unsplash.com/photo-1550317138-10000687a72b?q=80&w=1400"
};

const DEALS = [
    {
        title: "Mega Burger Combo",
        description: "Burger + Fries + Drink",
        originalPrice: 9.99,
        discountPercent: 20,
        discountedPrice: 7.99,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=900"
    },
    {
        title: "Crispy Chicken Box",
        description: "6pc + Fries + Sauce",
        originalPrice: 11.49,
        discountPercent: 17,
        discountedPrice: 9.49,
        image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?q=80&w=900"
    },
    {
        title: "Family Feast",
        description: "4 Burgers + 2 Fries + 4 Drinks",
        originalPrice: 24.99,
        discountPercent: 20,
        discountedPrice: 19.99,
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=900"
    }
];

export const seedMenu = async (restaurantId: string = 'demo-restaurant') => {
    try {
        // Check if we already have items to avoid duplicates
        const q = query(collection(db, "menuItems"), where("restaurantId", "==", restaurantId));
        const snapshot = await getDocs(q);

        const existingNames = new Set(snapshot.docs.map(d => (d.data().name as string) || ""));
        const itemsToAdd = MENU_ITEMS.filter(item => !existingNames.has(item.name));

        if (itemsToAdd.length === 0) {
            console.log("Menu already seeded.");
            return;
        }

        const promises = itemsToAdd.map(item =>
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

export const reseedMenu = async (restaurantId: string = 'demo-restaurant') => {
    try {
        const q = query(collection(db, "menuItems"), where("restaurantId", "==", restaurantId));
        const snapshot = await getDocs(q);
        const normalizeName = (value: string) => value.trim().toLowerCase();
        const existingByName = new Map(
            snapshot.docs.map(d => [normalizeName(String(d.data().name || "")), { id: d.id }])
        );

        const updates = MENU_ITEMS.map(async (item) => {
            const existing = existingByName.get(normalizeName(item.name));
            if (existing) {
                const ref = doc(db, "menuItems", existing.id);
                await updateDoc(ref, { ...item, restaurantId, updatedAt: serverTimestamp() });
            } else {
                await addDoc(collection(db, "menuItems"), {
                    ...item,
                    restaurantId,
                    createdAt: serverTimestamp()
                });
            }
        });

        await Promise.all(updates);
        console.log("Menu successfully re-seeded!");
    } catch (error) {
        console.error("Error re-seeding menu:", error);
        throw error;
    }
};

export const seedRestaurant = async (restaurantId: string = 'demo-restaurant') => {
    try {
        const q = query(collection(db, "restaurants"), where("id", "==", restaurantId));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            console.log("Restaurant already seeded.");
            return;
        }

        await addDoc(collection(db, "restaurants"), {
            ...RESTAURANT,
            id: restaurantId,
            createdAt: serverTimestamp()
        });
        console.log("Restaurant successfully seeded!");
    } catch (error) {
        console.error("Error seeding restaurant:", error);
        throw error;
    }
};

export const seedDeals = async (restaurantId: string = 'demo-restaurant') => {
    try {
        const q = query(collection(db, "deals"), where("restaurantId", "==", restaurantId));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            console.log("Deals already seeded.");
            return;
        }

        const promises = DEALS.map(deal =>
            addDoc(collection(db, "deals"), {
                ...deal,
                restaurantId,
                createdAt: serverTimestamp()
            })
        );

        await Promise.all(promises);
        console.log("Deals successfully seeded!");
    } catch (error) {
        console.error("Error seeding deals:", error);
        throw error;
    }
};

export const seedAll = async (restaurantId: string = 'demo-restaurant') => {
    await seedRestaurant(restaurantId);
    await seedMenu(restaurantId);
    await seedDeals(restaurantId);
};
