import {
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
} from 'firebase/auth'
import { auth, db } from './firebase'
import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp,
    collection,
    onSnapshot,
    query,
    orderBy,
    Unsubscribe,
} from 'firebase/firestore'

const googleProvider = new GoogleAuthProvider()

// ─── Google Login & Sign Up ───────────────────────────────────────────────────
// Note: signInWithPopup automatically creates a new account if one doesn't exist
export const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user
    const userRef = doc(db, 'users', user.uid)
    const snap = await getDoc(userRef)
    const isAdmin = user.email === 'admin@gmail.com'
    if (!snap.exists()) {
        await setDoc(userRef, {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            role: isAdmin ? 'admin' : 'customer',
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
        })
    } else {
        await setDoc(userRef, {
            lastLoginAt: serverTimestamp(),
            role: isAdmin ? 'admin' : snap.data().role || 'customer'
        }, { merge: true })
    }
    return user
}

// ─── Email Sign Up ─────────────────────────────────────────────────────────────

export const signUpWithEmail = async (name: string, email: string, password: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    const user = result.user
    await updateProfile(user, { displayName: name })
    const isAdmin = email === 'admin@gmail.com'
    await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name,
        email,
        role: isAdmin ? 'admin' : 'customer',
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
    })
    return user
}

// ─── Email Sign In ─────────────────────────────────────────────────────────────

export const signInWithEmail = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    const user = result.user
    await setDoc(doc(db, 'users', user.uid), { lastLoginAt: serverTimestamp() }, { merge: true })
    return user
}

// ─── Sign Out ──────────────────────────────────────────────────────────────────

export const logout = async () => {
    await signOut(auth)
}

// ─── Admin: Real-time users list ───────────────────────────────────────────────

export const subscribeToUsers = (
    callback: (users: Record<string, unknown>[]) => void
): Unsubscribe => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snap) => {
        const users = snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
            createdAt: d.data().createdAt?.toDate?.() ?? null,
            lastLoginAt: d.data().lastLoginAt?.toDate?.() ?? null,
        }))
        callback(users)
    })
}
