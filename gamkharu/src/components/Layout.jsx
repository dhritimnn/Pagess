import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import SearchBar from './SearchBar';

export default function Layout() {
  return (
    <>
      <div style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
        <Navbar />
        <SearchBar />
      </div>
      <Outlet />
    </>
  );
}
