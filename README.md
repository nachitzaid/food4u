# Food4U

Modern fast-food ordering app built with Next.js + Firebase. Includes Google login, admin menu management, hot deals, favorites, cart with 3-minute TTL, checkout flow, and order tracking.

## Features
- Google Authentication (Firebase Auth)
- Role-based access (Admin vs Customer)
- Real menu data in Firestore
- Hot Deals management (discounted prices)
- Favorites per user
- Cart saved per user with 3-minute expiration (Firestore)
- Checkout -> orders flow

---

## Tech Stack
- Next.js (App Router)
- Firebase Auth + Firestore + Storage
- TailwindCSS + Framer Motion

---

## Getting Started

### 1) Install dependencies
```bash
npm install
```

### 2) Create `.env.local`
Create a file named `.env.local` in the project root:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Admin email to grant admin role automatically
NEXT_PUBLIC_ADMIN_EMAIL=your@email.com

# Restaurant id used for data filtering
NEXT_PUBLIC_RESTAURANT_ID=demo-restaurant
```

### 3) Enable Firebase Auth
In Firebase Console:
- Enable **Google** provider

### 4) Firestore Rules (required)
Update rules in Firebase Console:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isSignedIn() {
      return request.auth != null;
    }

    function isAdmin() {
      return isSignedIn()
        && exists(/databases/$(database)/documents/users/$(request.auth.uid))
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    match /users/{userId} {
      allow read, write: if isSignedIn() && (request.auth.uid == userId || isAdmin());
    }

    match /menuItems/{itemId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /deals/{dealId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /orders/{orderId} {
      allow create: if isSignedIn();
      allow read: if isSignedIn() && (
        request.auth.uid == resource.data.userId || isAdmin()
      );
      allow update, delete: if isAdmin();
    }

    match /carts/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5) Firestore Indexes
When prompted by Firestore, create indexes (e.g. for `deals` queries).

### 6) Run the app
```bash
npm run dev
```

---

## Admin Setup
Log in using the email set in `NEXT_PUBLIC_ADMIN_EMAIL`.
The app will automatically set your `role` to `admin` in Firestore.

---

## Seeding Data
Admin can seed menu/deals automatically:
- Visit **/admin/menu** -> use **Re-seed & Overwrite**
- Visit **/admin/deals** -> manage deals and discounts

---

## Firebase Data: What Can Be Pushed to GitHub?
You cannot push Firebase data (Firestore documents) directly to GitHub.

You can push:
- Firestore rules (paste into Firebase Console)
- Firebase config values (in `.env.local` - do not commit)
- Seed scripts (`/services/seed.ts`)

### Export Firestore data (optional)
To backup data, use Firebase CLI export:
```bash
firebase login
firebase init firestore
firebase emulators:start
firebase firestore:export ./firebase-export
```
Then store the export in a private backup (not in git).

---

## Deployment
Deploy on Vercel:
- Add environment variables from `.env.local`
- Build and deploy

---

## License
MIT
