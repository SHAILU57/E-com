import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand: string;
  images: { url: string; alt?: string }[];
  stock: number;
  specifications: Map<string, string>;
  tags: string[];
  rating: { average: number; count: number };
  reviews: any[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  loading: boolean;
  error: string | null;
}

interface CartItem {
  product: Product;
  quantity: number;
  price: number;
}

interface CartContextType extends CartState {
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  loadCart: () => Promise<void>;
  clearError: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | { type: 'CART_START' }
  | { type: 'CART_SUCCESS'; payload: { items: CartItem[]; totalAmount: number } }
  | { type: 'CART_FAIL'; payload: string }
  | { type: 'CLEAR_CART' | 'CLEAR_ERROR' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'CART_START':
      return { ...state, loading: true, error: null };
    case 'CART_SUCCESS':
      return {
        ...state,
        loading: false,
        items: action.payload.items,
        totalAmount: action.payload.totalAmount,
        error: null
      };
    case 'CART_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'CLEAR_CART':
      return { ...state, items: [], totalAmount: 0 };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalAmount: 0,
    loading: false,
    error: null
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const loadCart = async () => {
    try {
      dispatch({ type: 'CART_START' });
      const res = await axios.get(`${API_URL}/cart`, {
        headers: getAuthHeaders()
      });
      
      const cart = res.data.data.cart;
      dispatch({
        type: 'CART_SUCCESS',
        payload: {
          items: cart.items,
          totalAmount: cart.totalAmount
        }
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to load cart';
      dispatch({ type: 'CART_FAIL', payload: message });
    }
  };

  const addToCart = async (productId: string, quantity = 1) => {
    try {
      dispatch({ type: 'CART_START' });
      await axios.post(`${API_URL}/cart/add`, { productId, quantity }, {
        headers: getAuthHeaders()
      });
      
      await loadCart();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to add to cart';
      dispatch({ type: 'CART_FAIL', payload: message });
      throw error;
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      dispatch({ type: 'CART_START' });
      await axios.put(`${API_URL}/cart/update`, { productId, quantity }, {
        headers: getAuthHeaders()
      });
      
      await loadCart();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update cart';
      dispatch({ type: 'CART_FAIL', payload: message });
      throw error;
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      dispatch({ type: 'CART_START' });
      await axios.delete(`${API_URL}/cart/remove/${productId}`, {
        headers: getAuthHeaders()
      });
      
      await loadCart();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to remove from cart';
      dispatch({ type: 'CART_FAIL', payload: message });
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: 'CART_START' });
      await axios.delete(`${API_URL}/cart/clear`, {
        headers: getAuthHeaders()
      });
      
      dispatch({ type: 'CLEAR_CART' });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to clear cart';
      dispatch({ type: 'CART_FAIL', payload: message });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <CartContext.Provider value={{
      ...state,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      loadCart,
      clearError
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};