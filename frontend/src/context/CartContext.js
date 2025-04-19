import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    setCartCount(cart.length);
  }, [cart]);

  const addToCart = (items) => {
    setCart(prevCart => [...prevCart, ...items]);
  };

  const removeFromCart = (index) => {
    setCart(prevCart => prevCart.filter((_, idx) => idx !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};