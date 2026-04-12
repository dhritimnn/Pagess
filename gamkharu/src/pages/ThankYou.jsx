import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ThankYou() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%', background: '#fff3f0', border: '3px solid #FF6435',
        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
        animation: 'pop .4s ease'
      }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FF6435" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <style>{`@keyframes pop { 0%{transform:scale(.5);opacity:0} 80%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }`}</style>
      <h3 style={{ fontWeight: 700, marginBottom: '.5rem' }}>Order Placed!</h3>
      <p style={{ color: '#888', marginBottom: '.25rem' }}>Thank you for shopping with <span style={{ color: '#FF6435' }}>Gamkharu</span>.</p>
      <p style={{ color: '#888', marginBottom: '1.5rem', fontSize: '.9rem' }}>We'll get in touch with you shortly.</p>
      <button onClick={() => navigate('/')} style={{
        background: '#e53935', color: 'white', border: 'none', borderRadius: 12,
        padding: '.65rem 1.5rem', fontSize: '1rem', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600
      }}>Back to Home</button>
    </div>
  );
}
