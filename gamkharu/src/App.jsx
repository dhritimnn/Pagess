import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Product from './pages/Product';
import Search from './pages/Search';
import Wishlist from './pages/Wishlist';
import Order from './pages/Order';
import FAQ from './pages/FAQ';
import ThankYou from './pages/ThankYou';
import Category from './pages/Category';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* ThankYou has no nav */}
          <Route path="/thankyou" element={<ThankYou />} />

          {/* Category pages have their own nav inside */}
          <Route path="/categories/:cat" element={<Category />} />

          {/* All other pages share the Layout (sticky nav + searchbar) */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product" element={<Product />} />
            <Route path="/search" element={<Search />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/order" element={<Order />} />
            <Route path="/faq" element={<FAQ />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
