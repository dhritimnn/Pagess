import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

export default function Home() {
  const navigate = useNavigate();
  return (
    <div>
      {/* Hero Header */}
      <div style={{
        width: '100%', height: 400,
        background: 'url(/rootimg/01.webp) center/cover no-repeat',
        backgroundColor: '#f5e8e0'
      }} />

      {/* Categories */}
      <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', fontSize: '1.2rem', color: '#FF5603' }}>
        <h2>Explore Categories</h2>
        <span style={{ height: 5, width: 100, background: '#B99F8F70', display: 'block', marginTop: '.5rem' }} />
      </div>

      <div style={{ padding: '0 2.5rem 2.5rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
        <div style={{ background: 'white', cursor: 'pointer' }} onClick={() => navigate('/categories/clothing')}>
          <img src="/rootimg/01.webp" alt="Clothing" style={{ width: '100%' }} onError={e => e.target.style.display='none'} />
          <div style={{ textAlign: 'center', padding: '.5rem 0 1rem' }}>Clothings</div>
        </div>
        <div style={{ background: 'white', cursor: 'pointer' }} onClick={() => navigate('/categories/jewelry')}>
          <img src="/rootimg/01.webp" alt="Jewelry" style={{ width: '100%' }} onError={e => e.target.style.display='none'} />
          <div style={{ textAlign: 'center', padding: '.5rem 0 1rem' }}>Jewelry</div>
        </div>
        <div style={{ background: 'white', cursor: 'pointer', gridColumn: '1 / -1', justifySelf: 'center', width: '50%' }} onClick={() => navigate('/categories/accessories')}>
          <img src="/rootimg/01.webp" alt="Accessories" style={{ width: '100%' }} onError={e => e.target.style.display='none'} />
          <div style={{ textAlign: 'center', padding: '.5rem 0 1rem' }}>Accessories</div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
