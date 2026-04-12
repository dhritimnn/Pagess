import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount } = useApp();
  const navigate = useNavigate();

  const close = () => setMenuOpen(false);

  return (
    <>
      <nav style={{
        background: '#FF5400', color: 'white',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1rem 1.75rem', position: 'relative', zIndex: 1000
      }}>
        <h2 style={{ cursor: 'pointer', fontSize: '1.3rem', fontWeight: 800 }}
          onClick={() => { navigate('/'); close(); }}>Gamkharu</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 8px 0 0', position: 'relative' }}
            onClick={() => navigate('/cart')}>
            <svg width="25" height="23" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1,1 4,1 4,16" />
              <polyline points="4,5 21,5 19,13 6,13" />
              <circle cx="9" cy="19" r="1.8" />
              <circle cx="17" cy="19" r="1.8" />
            </svg>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: '-5px', right: '2px',
                background: 'white', color: '#FF5400', fontSize: '.6rem',
                fontWeight: 700, borderRadius: '50%', width: 16, height: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>{cartCount}</span>
            )}
          </button>
          <button onClick={() => setMenuOpen(o => !o)}
            style={{ background: 'none', border: 'none', outline: 'none', cursor: 'pointer' }}>
            <svg width="40" height="30" viewBox="0 0 40 40">
              <g stroke="white" strokeWidth="4" strokeLinecap="round">
                {menuOpen ? (
                  <>
                    <line x1="8" y1="8" x2="32" y2="32" />
                    <line x1="32" y1="8" x2="8" y2="32" />
                  </>
                ) : (
                  <>
                    <line x1="2" y1="10" x2="38" y2="10" />
                    <line x1="2" y1="20" x2="38" y2="20" />
                    <line x1="2" y1="30" x2="38" y2="30" />
                  </>
                )}
              </g>
            </svg>
          </button>
        </div>
      </nav>

      {/* Dropdown */}
      <div style={{
        background: 'linear-gradient(#FFE9E8 50%, #FFD9D8)',
        color: 'darkslategrey',
        display: 'flex', justifyContent: 'space-evenly',
        padding: menuOpen ? '2rem 1rem' : '0',
        maxHeight: menuOpen ? '400px' : '0',
        overflow: 'hidden',
        transition: 'max-height .35s ease-out, padding .35s ease-out',
        zIndex: 600, position: 'relative'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '.3rem' }}>
          {[['/', 'Home'], ['/about', 'About'], ['/faq', 'FAQ'], ['/wishlist', 'Your Wishlist']].map(([path, label]) => (
            <span key={path} onClick={() => { navigate(path); close(); }}
              style={{ cursor: 'pointer', padding: '.3rem 0', fontSize: '1.1rem', fontWeight: 500 }}>{label}</span>
          ))}
        </div>
        <hr style={{ border: 'none', borderLeft: '1px solid #ccc' }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '.3rem' }}>
          {[['clothing', 'Clothing'], ['jewelry', 'Jewelry'], ['accessories', 'Accessories']].map(([cat, label]) => (
            <span key={cat} onClick={() => { navigate(`/categories/${cat}`); close(); }}
              style={{ cursor: 'pointer', padding: '.3rem 0', fontSize: '1.1rem', fontWeight: 500, color: 'orangered' }}>{label}</span>
          ))}
        </div>
      </div>
    </>
  );
}
