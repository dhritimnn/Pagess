import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Wishlist() {
  const { wishlist, toggleWishlist, clearWishlist, db } = useApp();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();

  const items = wishlist.map(id => db.find(x => x.id === id)).filter(Boolean);

  return (
    <div style={{ padding: '1rem', minHeight: '60vh', fontFamily: 'inherit', color: 'darkslategrey' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>My Wishlist</h2>
        {items.length > 0 && (
          <button onClick={() => setConfirmOpen(true)} style={{
            background: 'none', border: '1.5px solid #ffb3a0', color: '#FF5400',
            fontSize: '.8rem', fontWeight: 600, padding: '.35rem .75rem', borderRadius: '2rem', cursor: 'pointer'
          }}>Clear all</button>
        )}
      </div>

      {items.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem', gap: '.75rem', color: '#bbb' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#FF5400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: .35 }}>
            <path d="M12 21C12 21 3 14.5 3 8.5A5 5 0 0 1 12 6.5 5 5 0 0 1 21 8.5C21 14.5 12 21 12 21Z"/>
          </svg>
          <p style={{ margin: 0, fontSize: '.95rem' }}>Your wishlist is empty.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
          {items.map(p => (
            <div key={p.id} style={{ background: 'white', border: '1px solid #f0e8e8', overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer', position: 'relative' }}
              onClick={() => navigate(`/product?id=${p.id}`)}>
              <div style={{ width: '100%', aspectRatio: '3/4', background: '#f5f0ee', overflow: 'hidden' }}>
                <img src={p.url || ''} alt={p.name} loading="lazy"
                  onError={e => { e.target.style.display = 'none'; e.target.parentElement.style.background = '#e8dcd5'; }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <button onClick={e => { e.stopPropagation(); toggleWishlist(p.id); }} style={{
                position: 'absolute', top: '.45rem', right: '.45rem', width: 28, height: 28,
                borderRadius: '50%', background: 'rgba(0,0,0,.45)', border: 'none', color: 'white',
                fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', backdropFilter: 'blur(4px)'
              }}>✕</button>
              <div style={{ padding: '.55rem .65rem .7rem', display: 'flex', flexDirection: 'column', gap: '.15rem' }}>
                <div style={{ fontSize: '.82rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                <div style={{ fontSize: '.88rem', fontWeight: 700, color: '#FF5400' }}>{p.price}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Sheet */}
      {confirmOpen && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 9999 }} onClick={() => setConfirmOpen(false)} />
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10000,
            background: 'white', borderRadius: '1.25rem 1.25rem 0 0', padding: '1.75rem 1.5rem 2.5rem',
            display: 'flex', flexDirection: 'column', gap: '1rem',
            animation: 'slideUp .25s ease-out'
          }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'darkslategrey' }}>Clear wishlist?</h3>
            <p style={{ margin: 0, fontSize: '.9rem', color: '#888' }}>All saved items will be removed. This can't be undone.</p>
            <button onClick={() => { clearWishlist(); setConfirmOpen(false); }} style={{ background: '#FF5400', color: 'white', border: 'none', borderRadius: '.6rem', padding: '.85rem', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}>Yes, clear it</button>
            <button onClick={() => setConfirmOpen(false)} style={{ background: '#f5f0ee', color: 'darkslategrey', border: 'none', borderRadius: '.6rem', padding: '.85rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          </div>
        </>
      )}
    </div>
  );
}
