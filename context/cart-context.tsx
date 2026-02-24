'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode, useState } from 'react'
import { useAuth } from '@/context/auth-context'
import { deleteUserCart, getUserCart, saveUserCart } from '@/services/firestore'

export interface CartItem {
    id: string
    name: string
    price: number
    image: string
    quantity: number
    size?: string
    removedIngredients?: string[]
    extras?: { name: string; price: number }[]
}

function getCartItemId(item: CartItem) {
    const customId = [
        item.id,
        item.size ?? '',
        ...(item.removedIngredients ?? []).sort(),
        ...(item.extras ?? []).map(e => e.name).sort()
    ].join('|')
    return customId
}

export function getCartItemKey(item: CartItem) {
    return getCartItemId(item)
}

interface CartState {
    items: CartItem[]
}

type CartAction =
    | { type: 'ADD_ITEM'; payload: CartItem }
    | { type: 'REMOVE_ITEM'; payload: string }
    | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
    | { type: 'REPLACE_ITEM'; payload: { oldKey: string; item: CartItem } }
    | { type: 'CLEAR_CART' }
    | { type: 'HYDRATE'; payload: CartItem[] }

function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case 'HYDRATE':
            return { items: action.payload }

        case 'ADD_ITEM': {
            const newItemId = getCartItemId(action.payload)
            const existingIndex = state.items.findIndex(i => getCartItemId(i) === newItemId)

            if (existingIndex > -1) {
                return {
                    items: state.items.map((i, idx) =>
                        idx === existingIndex
                            ? { ...i, quantity: i.quantity + action.payload.quantity }
                            : i
                    ),
                }
            }
            return { items: [...state.items, action.payload] }
        }

        case 'REMOVE_ITEM': {
            // If payload is a composite ID (contains |), filter by that
            if (action.payload.includes('|')) {
                return { items: state.items.filter(i => getCartItemId(i) !== action.payload) }
            }
            // Otherwise, filter by base item ID
            return { items: state.items.filter(i => i.id !== action.payload) }
        }

        case 'UPDATE_QUANTITY': {
            if (action.payload.quantity <= 0) {
                return { items: state.items.filter(i => (i.id === action.payload.id || getCartItemId(i) === action.payload.id) ? false : true) }
            }
            return {
                items: state.items.map(i => {
                    const isMatch = i.id === action.payload.id || getCartItemId(i) === action.payload.id
                    return isMatch ? { ...i, quantity: action.payload.quantity } : i
                }),
            }
        }

        case 'REPLACE_ITEM': {
            const { oldKey, item } = action.payload
            const filtered = state.items.filter(i => getCartItemId(i) !== oldKey)
            const newKey = getCartItemId(item)
            const existingIndex = filtered.findIndex(i => getCartItemId(i) === newKey)

            if (existingIndex > -1) {
                return {
                    items: filtered.map((i, idx) =>
                        idx === existingIndex
                            ? { ...i, quantity: i.quantity + item.quantity }
                            : i
                    ),
                }
            }
            return { items: [...filtered, item] }
        }

        case 'CLEAR_CART':
            return { items: [] }

        default:
            return state
    }
}

interface CartContextValue {
    items: CartItem[]
    itemCount: number
    subtotal: number
    expiresAt: Date | null
    remainingMs: number
    addItem: (item: CartItem) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    replaceItem: (oldKey: string, item: CartItem) => void
    clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, { items: [] })
    const { user } = useAuth()
    const [expiresAt, setExpiresAt] = useState<Date | null>(null)
    const [remainingMs, setRemainingMs] = useState(0)

    // Hydrate from Firestore when logged in
    useEffect(() => {
        const load = async () => {
            if (!user) {
                dispatch({ type: 'HYDRATE', payload: [] })
                setExpiresAt(null)
                return
            }
            const cart = await getUserCart(user.uid)
            if (cart?.expiresAt) {
                const expiry = cart.expiresAt.toDate?.() ?? new Date(cart.expiresAt)
                if (expiry.getTime() <= Date.now()) {
                    await deleteUserCart(user.uid)
                    dispatch({ type: 'HYDRATE', payload: [] })
                    setExpiresAt(null)
                    return
                }
                setExpiresAt(expiry)
                if (Array.isArray(cart.items)) {
                    dispatch({ type: 'HYDRATE', payload: cart.items as CartItem[] })
                }
            } else {
                dispatch({ type: 'HYDRATE', payload: [] })
                setExpiresAt(null)
            }
        }
        load().catch(() => undefined)
    }, [user])

    // Sync cart to Firestore with 3-minute TTL
    useEffect(() => {
        if (!user) return
        if (state.items.length === 0) {
            deleteUserCart(user.uid).catch(() => undefined)
            setExpiresAt(null)
            return
        }
        const expiryToUse = expiresAt ?? new Date(Date.now() + 3 * 60 * 1000)
        if (!expiresAt) {
            setExpiresAt(expiryToUse)
        }
        saveUserCart(user.uid, state.items as unknown as Record<string, unknown>[], expiryToUse).catch(
            () => undefined
        )
    }, [state.items, user, expiresAt])

    // Countdown timer
    useEffect(() => {
        if (!expiresAt) {
            setRemainingMs(0)
            return
        }
        const tick = () => {
            const ms = expiresAt.getTime() - Date.now()
            if (ms <= 0) {
                setRemainingMs(0)
                if (user) {
                    deleteUserCart(user.uid).catch(() => undefined)
                }
                dispatch({ type: 'CLEAR_CART' })
                setExpiresAt(null)
                return
            }
            setRemainingMs(ms)
        }
        tick()
        const id = setInterval(tick, 1000)
        return () => clearInterval(id)
    }, [expiresAt, user])

    const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0)
    const subtotal = parseFloat(
        state.items.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)
    )

    const addItem = (item: CartItem) => dispatch({ type: 'ADD_ITEM', payload: item })
    const removeItem = (id: string) => dispatch({ type: 'REMOVE_ITEM', payload: id })
    const updateQuantity = (id: string, quantity: number) =>
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
    const replaceItem = (oldKey: string, item: CartItem) =>
        dispatch({ type: 'REPLACE_ITEM', payload: { oldKey, item } })
    const clearCart = () => dispatch({ type: 'CLEAR_CART' })

    return (
        <CartContext.Provider value={{ items: state.items, itemCount, subtotal, expiresAt, remainingMs, addItem, removeItem, updateQuantity, replaceItem, clearCart }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart(): CartContextValue {
    const ctx = useContext(CartContext)
    if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
    return ctx
}
