# Food4U - Professional Restaurant Ordering System

**Food4U** is a real, secure, and live restaurant ordering system built with Next.js, Firebase, and Mapbox. It's designed to be a sellable MVP for restaurants who want to bypass high-commission platforms.

## ✨ Features

### 🛒 Customer Side
- **Google Authentication:** Secure login for all users.
- **Interactive Menu:** Browse items by category with a premium, animated UI.
- **Smart Cart:** Persists locally, handles quantities, and calculates subtotals.
- **Mapbox Integration:** Visual address selection with real-time distance calculation.
- **Dynamic Delivery Fees:** Automatically calculated based on distance from the restaurant.
- **Live Order Tracking:** Real-time Firestore listeners to track status from "Pending" to "Delivered".

### 👨‍🍳 Admin Side
- **Real-Time Dashboard:** Incoming orders appear instantly with sound notifications.
- **Order Management:** Update order status (Accepted, Preparing, Out for Delivery, Delivered).
- **Menu CRUD:** Add, edit, delete menu items and toggle availability (Sold Out) instantly.
- **Open/Close Toggle:** Control restaurant status in real-time.

## 🚀 Tech Stack

- **Frontend:** Next.js (App Router), Tailwind CSS, Framer Motion, Lucide React, Mapbox GL JS.
- **Backend:** Firebase Auth, Firestore.
- **Maps:** Mapbox GL JS.

## 🛠️ Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
   ```

3. **Run Locally:**
   ```bash
   npm run dev
   ```

4. **Seed Demo Data:**
   Open the browser console while on the landing page and run `seedDatabase()` (ensure you have configured Firebase first).

## 🔒 Security Rules

Apply the provided Firestore rules in the Firebase Console:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /restaurants/{id} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
    match /menuItems/{id} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
    match /orders/{id} {
      allow create: if request.auth != null;
      allow read: if request.auth.uid == resource.data.userId || (request.auth != null && request.auth.token.role == 'admin');
      allow update: if request.auth != null && request.auth.token.role == 'admin';
      allow delete: if false;
    }
  }
}
```

## 📈 Roadmap
- [ ] Stripe Payment Integration
- [ ] Custom Map Styles (MapTiler/Mapbox)
- [ ] WhatsApp Order Notifications
- [ ] Multi-Restaurant SaaS Support
- [ ] PWA for Mobile App experience
