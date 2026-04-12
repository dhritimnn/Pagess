import React, { useState } from 'react';
import Footer from '../components/Footer';

const FAQS = [
  { question: "What is your return policy?", answer: "We accept returns within 7 days of delivery. Items must be unused and in original packaging." },
  { question: "How long does shipping take?", answer: "Standard shipping takes 3–5 business days. Express options are available at checkout." },
  { question: "Do you offer custom orders?", answer: "Yes! Reach out to us via the contact page and we'll be happy to discuss custom pieces." },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <div>
      <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', fontSize: '1.2rem', color: '#FF5603' }}>
        <h2>FAQ</h2>
        <span style={{ height: 5, width: 100, background: '#B99F8F70', display: 'block', marginTop: '.5rem' }} />
      </div>
      <div style={{ maxWidth: 700, width: '100%', margin: '0 auto', padding: '1rem 1.5rem 2rem', boxSizing: 'border-box' }}>
        {FAQS.map((faq, i) => (
          <div key={i} style={{ borderBottom: '1px solid #B99F8F70', marginBottom: '.5rem', overflow: 'hidden' }}>
            <button onClick={() => setOpen(open === i ? null : i)} style={{
              width: '100%', background: 'none', border: 'none', textAlign: 'left',
              padding: '1rem 0', fontSize: '1rem', color: '#333', cursor: 'pointer',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box', fontFamily: 'inherit'
            }}>
              {faq.question}
              <span style={{ fontSize: '1.4rem', color: '#FF5603', flexShrink: 0, marginLeft: '1rem', display: 'inline-block', transform: open === i ? 'rotate(45deg)' : 'none', transition: 'transform .3s ease' }}>+</span>
            </button>
            <div style={{
              maxHeight: open === i ? 300 : 0, overflow: 'hidden',
              transition: 'max-height .4s ease, padding .3s ease',
              padding: open === i ? '0 0 1rem' : '0',
              color: '#555', fontSize: '.95rem', lineHeight: 1.6
            }}>{faq.answer}</div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
