import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';

const WA_NUMBER = '';

export default function Product() {
  const [searchParams] = useSearchParams();
  const id = parseInt(searchParams.get('id'));
  const { db, cart, addToCart, wishlist, toggleWishlist } = useApp();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [imgs, setImgs] = useState([]);
  const [cur, setCur] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [lbScale, setLbScale] = useState(1);
  const [lbOffset, setLbOffset] = useState({ x: 0, y: 0 });
  const touchStart = useRef(0);
  const lastTap = useRef(0);
  const pinchRef = useRef({ dist: 0, scale: 1, ox: 0, oy: 0 });

  useEffect(() => {
    if (!db.length) return;
    const p = db.find(x => x.id === id);
    if (!p) return;
    setProduct(p);
    const images = [];
    for (let i = 1; ; i++) {
      const key = i === 1 ? 'url' : `url${i}`;
      if (p[key]) images.push(p[key]); else break;
    }
    setImgs(images.length ? images : ['']);
    setCur(0);
  }, [db, id]);

  if (!product) return <div style={{ padding: '2rem', textAlign: 'center', color: '#aaa' }}>Loading...</div>;

  const inCart = cart.some(x => x.id === product.id);
  const wished = wishlist.includes(product.id);
  const cats = (product.cat || '').split(' ').filter(c => c !== 'featured');
  const isFeatured = (product.cat || '').includes('featured');

  const suggestions = db
    .filter(x => x.id !== product.id)
    .map(x => {
      const tags = (product.cat || '').split(' ');
      const xt = (x.cat || '').split(' ');
      return { ...x, _score: tags.filter(t => xt.includes(t)).length };
    })
    .filter(x => x._score > 0)
    .sort((a, b) => b._score - a._score)
    .slice(0, 8);

  const handleCartBtn = () => {
    if (inCart) navigate('/cart');
    else { addToCart({ id: product.id, name: product.name, price: product.price, url: imgs[0], qty: 1 }); }
  };

  const handleWA = () => {
    const msg = encodeURIComponent(`Hi! I'm interested in *${product.name}* (ID: ${product.id}) priced at ${product.price}. Can you tell me more?`);
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
  };

  const goTo = (n) => setCur(Math.max(0, Math.min(n, imgs.length - 1)));

  return (
    <div style={{ fontFamily: 'inherit', color: 'darkslategrey' }}>
      {/* Slider */}
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden', background: '#f0ebe8', aspectRatio: '3/4' }}
        onTouchStart={e => { touchStart.current = e.touches[0].clientX; }}
        onTouchEnd={e => {
          const dx = e.changedTouches[0].clientX - touchStart.current;
          if (Math.abs(dx) > 40) goTo(cur + (dx < 0 ? 1 : -1));
        }}>
        <div style={{ display: 'flex', height: '100%', transform: `translateX(-${cur * 100}%)`, transition: 'transform .35s cubic-bezier(.4,0,.2,1)' }}>
          {imgs.map((src, i) => (
            <div key={i} style={{ minWidth: '100%', height: '100%', overflow: 'hidden', cursor: 'zoom-in' }} onClick={() => setLightbox(true)}>
              <img src={src} alt={product.name} loading={i === 0 ? 'eager' : 'lazy'}
                onError={e => { e.target.style.display = 'none'; e.target.parentElement.style.background = '#e8dcd5'; }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', userSelect: 'none' }} />
            </div>
          ))}
        </div>
        {imgs.length > 1 && (
          <div style={{ position: 'absolute', bottom: '.75rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '.4rem' }}>
            {imgs.map((_, i) => (
              <div key={i} onClick={() => goTo(i)} style={{
                width: 7, height: 7, borderRadius: '50%', cursor: 'pointer',
                background: i === cur ? 'white' : 'rgba(255,255,255,.5)',
                transform: i === cur ? 'scale(1.3)' : 'scale(1)', transition: 'all .2s'
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div style={{ display: 'flex', position: 'fixed', inset: 0, background: 'rgba(0,0,0,.92)', zIndex: 9999, alignItems: 'center', justifyContent: 'center', touchAction: 'none' }}
          onTouchEnd={e => {
            if (e.touches.length !== 0) return;
            const now = Date.now();
            if (now - lastTap.current < 300) { setLbScale(1); setLbOffset({ x: 0, y: 0 }); }
            lastTap.current = now;
          }}>
          <button onClick={() => { setLightbox(false); setLbScale(1); setLbOffset({ x: 0, y: 0 }); }}
            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,.15)', border: 'none', borderRadius: '50%', width: 36, height: 36, color: 'white', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>✕</button>
          <img src={imgs[cur]} alt={product.name}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transform: `translate(${lbOffset.x}px,${lbOffset.y}px) scale(${lbScale})`, transformOrigin: 'center', transition: 'transform .1s linear', userSelect: 'none', pointerEvents: 'none' }} />
        </div>
      )}

      {/* Info */}
      <div style={{ padding: '1.25rem 1.1rem .5rem' }}>
        {isFeatured && <div style={{ display: 'inline-block', background: '#FF5400', color: 'white', fontSize: '.7rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', padding: '.2rem .6rem', borderRadius: '2rem', marginBottom: '.6rem' }}>Featured</div>}
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 .3rem', lineHeight: 1.2 }}>{product.name}</h1>
        <div style={{ fontSize: '.82rem', color: '#aaa', marginBottom: '.75rem', textTransform: 'capitalize' }}>{cats.join(' · ')}</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FF5400' }}>{product.price}</div>
      </div>

      {/* Buttons */}
      <div style={{ padding: '0 1.1rem 1.2rem', display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
        <button onClick={() => toggleWishlist(product.id)} style={{
          width: '100%', padding: '.85rem', borderRadius: '.6rem', border: 'none',
          fontSize: '1rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem',
          background: wished ? '#c0392b' : '#ff8a6a', color: 'white'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill={wished ? 'white' : 'none'} stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21C12 21 3 14.5 3 8.5A5 5 0 0 1 12 6.5 5 5 0 0 1 21 8.5C21 14.5 12 21 12 21Z"/>
          </svg>
          {wished ? 'Wishlisted ♥' : 'Wishlist'}
        </button>
        <button onClick={handleCartBtn} style={{
          width: '100%', padding: '.85rem', borderRadius: '.6rem', border: 'none',
          fontSize: '1rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem',
          background: inCart ? '#2e7d32' : '#FF5400', color: 'white'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1,1 4,1 4,16"/><polyline points="4,5 21,5 19,13 6,13"/>
            <circle cx="9" cy="19" r="1.8" fill="white" stroke="none"/><circle cx="17" cy="19" r="1.8" fill="white" stroke="none"/>
          </svg>
          {inCart ? 'In Cart ✓' : 'Add to Cart'}
        </button>
        <button onClick={handleWA} style={{
          width: '100%', padding: '.85rem', borderRadius: '.6rem', border: 'none',
          fontSize: '1rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem',
          background: '#25D366', color: 'white'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.121 1.535 5.856L.057 23.571a.75.75 0 0 0 .92.92l5.715-1.478A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.698-.502-5.25-1.383l-.374-.217-3.892 1.005 1.005-3.892-.217-.374A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
          Ask on WhatsApp
        </button>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div style={{ padding: '0 1.1rem 2rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '.85rem', color: 'darkslategrey' }}>You may also like</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
            {suggestions.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <a href={`/search?q=${encodeURIComponent(product.name)}`}
            style={{ display: 'block', margin: '1rem 0 0', padding: '.8rem', textAlign: 'center', background: '#fff3ee', color: '#FF5400', fontWeight: 700, fontSize: '.95rem', borderRadius: '.6rem', textDecoration: 'none', border: '1.5px solid #FF5400' }}>
            View more of this kind →
          </a>
        </div>
      )}

      <Footer />
    </div>
  );
}
