import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';

const BATCH = 6;

function lev(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({length: m+1}, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}

function bestScore(query, target) {
  if (!query) return 0;
  const q = query.toLowerCase(), t = target.toLowerCase();
  if (t.includes(q)) return 0;
  let best = Infinity;
  for (let i = 0; i <= t.length - q.length; i++) {
    const d = lev(q, t.slice(i, i + q.length));
    if (d < best) best = d;
  }
  return Math.min(best, lev(q, t));
}

function shuffle(arr) {
  const top = arr.slice(0, 4);
  const rest = [...arr.slice(4)];
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  return [...top, ...rest];
}

const SORT_OPTIONS = [
  { key: 'relevance', label: 'Relevance' },
  { key: 'lat-slc', label: 'Latest Selections' },
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
  { key: 'az', label: 'A to Z' },
  { key: 'za', label: 'Z to A' },
];

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { db } = useApp();

  const [allProducts, setAllProducts] = useState([]);
  const [originalOrder, setOriginalOrder] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [loaded, setLoaded] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [sortKey, setSortKey] = useState('relevance');
  const [sortOpen, setSortOpen] = useState(false);
  const loaderRef = useRef(null);

  const parsePrice = (p) => parseFloat((p.price || '').replace(/[₹$€,]/g, '')) || 0;

  useEffect(() => {
    if (!db.length) return;
    const reversed = [...db].reverse();
    let ranked;
    if (!query.trim()) {
      ranked = reversed;
    } else {
      ranked = reversed
        .map(p => ({ ...p, _score: bestScore(query, p.name + ' ' + p.cat) }))
        .filter(p => p._score <= 4)
        .sort((a, b) => a._score - b._score);
    }
    setOriginalOrder(ranked);
    setAllProducts(shuffle(ranked));
    setDisplayed([]);
    setLoaded(0);
    setHasMore(true);
  }, [db, query]);

  const applySort = useCallback((key) => {
    setSortKey(key);
    let sorted;
    switch (key) {
      case 'relevance': sorted = shuffle(originalOrder); break;
      case 'lat-slc': sorted = [...originalOrder]; break;
      case 'price-asc': sorted = [...originalOrder].sort((a, b) => parsePrice(a) - parsePrice(b)); break;
      case 'price-desc': sorted = [...originalOrder].sort((a, b) => parsePrice(b) - parsePrice(a)); break;
      case 'az': sorted = [...originalOrder].sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'za': sorted = [...originalOrder].sort((a, b) => b.name.localeCompare(a.name)); break;
      default: sorted = [...originalOrder];
    }
    setAllProducts(sorted);
    setDisplayed([]);
    setLoaded(0);
    setHasMore(true);
  }, [originalOrder]);

  useEffect(() => {
    if (!allProducts.length || !hasMore) return;
    const batch = allProducts.slice(loaded, loaded + BATCH);
    if (!batch.length) { setHasMore(false); return; }
    setDisplayed(prev => [...prev, ...batch]);
    setLoaded(prev => prev + batch.length);
    if (loaded + batch.length >= allProducts.length) setHasMore(false);
  }, [allProducts]);

  // Infinite scroll
  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        const batch = allProducts.slice(loaded, loaded + BATCH);
        if (!batch.length) { setHasMore(false); return; }
        setDisplayed(prev => [...prev, ...batch]);
        setLoaded(prev => {
          const nl = prev + batch.length;
          if (nl >= allProducts.length) setHasMore(false);
          return nl;
        });
      }
    }, { rootMargin: '200px' });
    obs.observe(loaderRef.current);
    return () => obs.disconnect();
  }, [allProducts, loaded, hasMore]);

  return (
    <div style={{ padding: '1rem', paddingBottom: '5rem' }}>
      <p style={{ fontSize: '1rem', fontWeight: 600, color: 'darkslategrey', marginBottom: '1rem', padding: '0 .25rem' }}>
        Results for "<span style={{ color: '#FF6435' }}>{query}</span>"
      </p>

      {allProducts.length === 0 && db.length > 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#aaa', fontSize: '1rem' }}>No results found.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
          {displayed.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

      {hasMore && <div ref={loaderRef} style={{ textAlign: 'center', padding: '1.5rem', color: '#aaa', fontSize: '.9rem' }}>Loading...</div>}

      <Footer />

      {/* Sort Bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 900,
        background: 'white', borderTop: '1px solid #f0e8e8', padding: '.75rem 1.25rem',
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end'
      }}>
        <button onClick={() => setSortOpen(o => !o)} style={{
          display: 'flex', alignItems: 'center', gap: '.4rem', background: 'none',
          border: '1.5px solid #FF6435', borderRadius: '2rem', padding: '.4rem 1rem',
          color: '#FF6435', fontSize: '.9rem', fontWeight: 600, cursor: 'pointer'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF6435" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M7 12h10M11 18h2"/>
          </svg>
          Sort
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF6435" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform .3s' }}>
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>
      </div>

      {/* Sort Sheet */}
      {sortOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 901, background: 'rgba(0,0,0,.25)' }} onClick={() => setSortOpen(false)} />
      )}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 902,
        background: 'white', borderRadius: '1.25rem 1.25rem 0 0', padding: '1.25rem 1.25rem 2rem',
        transform: sortOpen ? 'translateY(0)' : 'translateY(100%)', transition: 'transform .35s ease'
      }}>
        <div style={{ fontSize: '.8rem', fontWeight: 700, color: '#aaa', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>Sort by</div>
        {SORT_OPTIONS.map(opt => (
          <button key={opt.key} onClick={() => { applySort(opt.key); setSortOpen(false); }} style={{
            display: 'flex', alignItems: 'center', gap: '.75rem', padding: '.75rem .5rem',
            border: 'none', background: 'none', width: '100%', textAlign: 'left',
            fontSize: '.95rem', fontWeight: sortKey === opt.key ? 700 : 500,
            color: sortKey === opt.key ? '#FF6435' : 'darkslategrey', cursor: 'pointer', borderRadius: '.5rem'
          }}>{opt.label}</button>
        ))}
      </div>
    </div>
  );
}
