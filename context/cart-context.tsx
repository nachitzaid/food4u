'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'

export interface CartItem {
    id: string
    name: string
    price: number
    image: string
    quantity: number
    removedIngredients?: string[]
    extras?: { name: string; price: number }[]
}

function getCartItemId(item: CartItem) {
    const customId = [
        item.id,
        ...(item.removedIngredients ?? []).sort(),
        ...(item.extras ?? []).map(e => e.name).sort()
    ].join('|')
    return customId
}

interface CartState {
    items: CartItem[]
}

type CartAction =
    | { type: 'ADD_ITEM'; payload: CartItem }
    | { type: 'REMOVE_ITEM'; payload: string }
    | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
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
    addItem: (item: CartItem) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'food4u_cart'

export function CartProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, { items: [] })

    // Hydrate from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
                const parsed: CartItem[] = JSON.parse(stored)
                if (Array.isArray(parsed)) {
                    dispatch({ type: 'HYDRATE', payload: parsed })
                }
            }
        } catch {
            // ignore corrupt storage
        }
    }, [])

    // Persist to localStorage on every change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
    }, [state.items])

    const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0)
    const subtotal = parseFloat(
        state.items.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)
    )

    const addItem = (item: CartItem) => dispatch({ type: 'ADD_ITEM', payload: item })
    const removeItem = (id: string) => dispatch({ type: 'REMOVE_ITEM', payload: id })
    const updateQuantity = (id: string, quantity: number) =>
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
    const clearCart = () => dispatch({ type: 'CLEAR_CART' })

    return (
        <CartContext.Provider value={{ items: state.items, itemCount, subtotal, addItem, removeItem, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart(): CartContextValue {
    const ctx = useContext(CartContext)
    if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
    return ctx
}
