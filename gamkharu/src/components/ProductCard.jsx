import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ProductCard({ product }) {
  const { wishlist, toggleWishlist } = useApp();
  const navigate = useNavigate();
  const wished = wishlist.includes(product.id);

  return (
    <div style={{
      background: 'white', border: '1px solid #f0e8e8',
      overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer'
    }}>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', background: '#f5f0ee', overflow: 'hidden' }}>
        <img
          src={product.url || ''}
          alt={product.name}
          loading="lazy"
          onClick={() => navigate(`/product?id=${product.id}`)}
          onError={e => { e.target.style.display = 'none'; e.target.parentElement.style.background = '#e8dcd5'; }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <button
          onClick={e => { e.stopPropagation(); toggleWishlist(product.id); }}
          style={{
            position: 'absolute', top: '.5rem', right: '.5rem',
            background: 'rgba(255,255,255,.85)', border: 'none', borderRadius: '50%',
            width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', backdropFilter: 'blur(4px)'
          }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill={wished ? '#FF6435' : 'none'} stroke="#FF6435" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21C12 21 3 14.5 3 8.5A5 5 0 0 1 12 6.5 5 5 0 0 1 21 8.5C21 14.5 12 21 12 21Z"/>
          </svg>
        </button>
      </div>
      <div onClick={() => navigate(`/product?id=${product.id}`)}
        style={{ padding: '.6rem .7rem .8rem', display: 'flex', flexDirection: 'column', gap: '.2rem' }}>
        <div style={{ fontSize: '.85rem', fontWeight: 600, color: 'darkslategrey', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {product.name}
        </div>
        <div style={{ fontSize: '.9rem', fontWeight: 700, color: '#FF6435' }}>{product.price}</div>
      </div>
    </div>
  );
}
