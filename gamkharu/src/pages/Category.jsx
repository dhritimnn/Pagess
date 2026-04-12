import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import Footer from '../components/Footer';

const CATEGORY_DATA = {
  clothing: {
    title: 'Clothing Categories',
    items: [
      { label: 'Masrise Cotton', sub: 'Mekhela Sador', q: 'masrise cotton' },
      { label: 'Pure Toss', sub: 'Mekhela Sador', q: 'pure toss' },
    ]
  },
  jewelry: {
    title: 'Jewelry Categories',
    items: []
  },
  accessories: {
    title: 'Accessories Categories',
    items: []
  }
};

export default function Category() {
  const { cat } = useParams();
  const navigate = useNavigate();
  const data = CATEGORY_DATA[cat] || { title: 'Category', items: [] };

  return (
    <div>
      <div style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
        <Navbar />
        <SearchBar />
      </div>

      <div style={{ padding: '4rem 2rem 2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', fontSize: '1.2rem', color: '#42445A' }}>
        <h2>{data.title}</h2>
        <span style={{ height: 5, width: 100, background: '#B99F8F70', display: 'block', marginTop: '.5rem' }} />
      </div>

      <section style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {data.items.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#aaa' }}>Coming soon...</p>
        ) : data.items.map((item, i) => (
          <div key={i} onClick={() => navigate(`/search?q=${encodeURIComponent(item.q)}`)} style={{
            background: '#fff', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'row',
            alignItems: 'center', boxShadow: '0 2px 12px rgba(0,0,0,.08)', cursor: 'pointer', textDecoration: 'none'
          }}>
            <div style={{ width: 110, minWidth: 110, height: 110, overflow: 'hidden' }}>
              <img src="/rootimg/01.webp" alt={item.label} onError={e => e.target.style.display = 'none'}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ padding: '1rem 1.5rem', flex: 1 }}>
              <p style={{ fontSize: '1.25rem', fontWeight: 570, color: '#1a1a1a', margin: '0 0 .2rem', lineHeight: 1.2 }}>{item.label}</p>
              <p style={{ fontSize: '.78rem', color: '#888', letterSpacing: '.04em', textTransform: 'uppercase', margin: 0 }}>{item.sub}</p>
            </div>
            <span style={{ marginRight: '1.2rem', color: '#bbb', fontSize: '1.2rem' }}>›</span>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  );
}
