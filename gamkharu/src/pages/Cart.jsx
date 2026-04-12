import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

function formatPrice(n) { return '₹' + n.toLocaleString('en-IN'); }

export default function Cart() {
  const { cart, removeFromCart, updateQty, clearCart, cartTotal, cartCount, parsePrice } = useApp();
  const navigate = useNavigate();

  const handleNext = () => {
    if (!cart.length) return;
    localStorage.setItem('gk_checkout', JSON.stringify({ items: cart, savedAt: Date.now() }));
    navigate('/order');
  };

  return (
    <div style={{ fontFamily: 'inherit', color: 'darkslategrey', padding: '1rem 1rem 7rem', minHeight: '60vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>My Cart</h2>
        <span style={{ fontSize: '.82rem', color: '#aaa', fontWeight: 500 }}>
          {cart.length > 0 ? `${cart.length} product${cart.length > 1 ? 's' : ''}` : ''}
        </span>
        {cart.length > 0 && (
          <button onClick={clearCart} style={{
            background: 'none', border: '1.5px solid #ffb3a0', color: '#FF5400',
            fontSize: '.8rem', fontWeight: 600, padding: '.35rem .75rem', borderRadius: '2rem', cursor: 'pointer'
          }}>Clear all</button>
        )}
      </div>

      {cart.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem', gap: '.75rem', color: '#bbb' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#FF5400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: .35 }}>
            <polyline points="1,1 4,1 4,16"/><polyline points="4,5 21,5 19,13 6,13"/>
            <circle cx="9" cy="19" r="1.8" fill="#FF5400" stroke="none"/><circle cx="17" cy="19" r="1.8" fill="#FF5400" stroke="none"/>
          </svg>
          <p style={{ margin: 0, fontSize: '.95rem' }}>Your cart is empty.</p>
          <button onClick={() => navigate('/')} style={{
            marginTop: '.5rem', background: '#fff3ee', border: '1.5px solid #FF5400', color: '#FF5400',
            fontSize: '.9rem', fontWeight: 700, padding: '.65rem 1.5rem', borderRadius: '2rem', cursor: 'pointer'
          }}>Continue Shopping</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          {cart.map((item, idx) => {
            const unit = parsePrice(item.price);
            const subtotal = unit * (item.qty || 1);
            return (
              <div key={item.id} style={{
                display: 'flex', gap: '.75rem', background: 'white',
                border: '1px solid #f0e8e8', borderRadius: '.6rem', overflow: 'hidden', alignItems: 'stretch'
              }}>
                <img src={item.url || ''} alt={item.name} loading="lazy"
                  onError={e => { e.target.style.display = 'none'; e.target.parentElement.style.background = '#e8dcd5'; }}
                  style={{ width: 90, minWidth: 90, aspectRatio: '3/4', objectFit: 'cover', display: 'block', background: '#f5f0ee' }} />
                <div style={{ flex: 1, padding: '.7rem .6rem .7rem 0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '.4rem' }}>
                  <div>
                    <div style={{ fontSize: '.9rem', fontWeight: 600, lineHeight: 1.3 }}>{item.name}</div>
                    <div style={{ fontSize: '.78rem', color: '#aaa' }}>Unit: {item.price}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #f0e8e8', borderRadius: '.4rem', overflow: 'hidden' }}>
                      <button onClick={() => updateQty(item.id, -1)} disabled={item.qty <= 1}
                        style={{ background: '#fff3ee', border: 'none', width: 30, height: 30, fontSize: '1.1rem', fontWeight: 700, color: '#FF5400', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                      <span style={{ width: 28, textAlign: 'center', fontSize: '.9rem', fontWeight: 700 }}>{item.qty || 1}</span>
                      <button onClick={() => updateQty(item.id, 1)}
                        style={{ background: '#fff3ee', border: 'none', width: 30, height: 30, fontSize: '1.1rem', fontWeight: 700, color: '#FF5400', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#FF5400' }}>{formatPrice(subtotal)}</div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)}
                    style={{ background: 'none', border: 'none', color: '#BB0000', fontSize: '.75rem', cursor: 'pointer', padding: 0, alignSelf: 'flex-start', textDecoration: 'underline' }}>
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {cart.length > 0 && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white',
          borderTop: '1px solid #f0e8e8', padding: '.9rem 1.25rem 1.25rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', zIndex: 100
        }}>
          <div>
            <div style={{ fontSize: '.75rem', color: '#aaa', fontWeight: 500 }}>{cartCount} item{cartCount !== 1 ? 's' : ''}</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'darkslategrey' }}>{formatPrice(cartTotal)}</div>
          </div>
          <button onClick={handleNext} style={{
            background: '#FF5400', color: 'white', border: 'none', borderRadius: '.6rem',
            padding: '.85rem 1.75rem', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap'
          }}>Next →</button>
        </div>
      )}
    </div>
  );
}
