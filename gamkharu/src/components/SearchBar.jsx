import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PRODUCTS = [
  "Red Floral Dress","Blue Cotton Kurti","Silk Saree","Gold Necklace",
  "Silver Ring","Cotton Kurta","Lehenga Set","Pearl Earrings",
  "Mekhela Sador","Red Dupatta","Masrise Cotton","Pure Toss"
];

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
  if (!query) return Infinity;
  const q = query.toLowerCase(), t = target.toLowerCase();
  if (t.includes(q)) return 0;
  let best = Infinity;
  for (let i = 0; i <= t.length - q.length; i++) {
    const d = lev(q, t.slice(i, i + q.length));
    if (d < best) best = d;
  }
  return Math.min(best, lev(q, t));
}

function getSuggestions(query, limit = 5) {
  if (!query.trim()) return [];
  return PRODUCTS
    .map(name => ({ name, score: bestScore(query, name) }))
    .filter(r => r.score <= 3)
    .sort((a, b) => a.score - b.score)
    .slice(0, limit);
}

export default function SearchBar() {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setSuggestions([]);
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const go = (q) => {
    if (q.trim()) { navigate(`/search?q=${encodeURIComponent(q)}`); setSuggestions([]); setValue(''); }
  };

  return (
    <div ref={ref} style={{ background: '#FF5400', padding: '0 1.5rem 1rem', position: 'relative', zIndex: 700 }}>
      <div style={{ display: 'flex' }}>
        <input
          value={value}
          onChange={e => { setValue(e.target.value); setSuggestions(getSuggestions(e.target.value)); }}
          onFocus={() => { setFocused(true); setSuggestions(getSuggestions(value)); }}
          onKeyDown={e => e.key === 'Enter' && go(value)}
          placeholder="Search product"
          style={{ width: '75%', padding: '.5rem', outline: 'none', border: 'none', fontFamily: 'inherit' }}
        />
        <button onClick={() => go(value)}
          style={{ width: '25%', padding: '.5rem', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
          Search
        </button>
      </div>
      {suggestions.length > 0 && (
        <div style={{
          position: 'absolute', left: '12.5%', right: 0, zIndex: 800,
          display: 'flex', flexDirection: 'column', alignItems: 'center'
        }}>
          {suggestions.map(r => (
            <div key={r.name} onClick={() => go(r.name)}
              style={{
                background: '#F2F3FF', width: '75%', padding: '.5rem 1.5rem',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                cursor: 'pointer', color: '#5A5E80'
              }}>
              <p style={{ margin: 0 }}>{r.name}</p>
              <svg width="25" height="25" viewBox="0 0 40 40">
                <path d="M 10 30 L 30 10 M 18 10 H 30 V 22" stroke="lightgrey" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
