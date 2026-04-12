import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('gk_cart') || '[]'); } catch { return []; }
  });
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('gk_wishlist') || '[]'); } catch { return []; }
  });
  const [db, setDb] = useState([]);

  useEffect(() => {
    fetch('/database.json').then(r => r.json()).then(setDb).catch(() => {});
  }, []);

  useEffect(() => { localStorage.setItem('gk_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('gk_wishlist', JSON.stringify(wishlist)); }, [wishlist]);

  const addToCart = useCallback((item) => {
    setCart(prev => {
      if (prev.some(x => x.id === item.id)) return prev;
      return [...prev, { ...item, qty: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart(prev => prev.filter(x => x.id !== id));
  }, []);

  const updateQty = useCallback((id, delta) => {
    setCart(prev => prev.map(x => x.id === id ? { ...x, qty: Math.max(1, (x.qty || 1) + delta) } : x));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((id) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const clearWishlist = useCallback(() => setWishlist([]), []);

  const parsePrice = (str) => {
    const n = parseFloat((str || '').replace(/[^\d.]/g, ''));
    return isNaN(n) ? 0 : n;
  };

  const cartTotal = cart.reduce((s, i) => s + parsePrice(i.price) * (i.qty || 1), 0);
  const cartCount = cart.reduce((s, i) => s + (i.qty || 1), 0);

  return (
    <AppContext.Provider value={{
      cart, wishlist, db,
      addToCart, removeFromCart, updateQty, clearCart,
      toggleWishlist, clearWishlist,
      cartTotal, cartCount, parsePrice
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() { return useContext(AppContext); }
