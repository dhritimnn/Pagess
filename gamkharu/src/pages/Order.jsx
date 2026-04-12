import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Footer from '../components/Footer';

export default function Order() {
  const { cart, cartTotal, parsePrice } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '',
    address1: '', address2: '', city: '', region: '', zip: ''
  });

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('gk_user_info') || '{}');
      setForm(prev => ({ ...prev, ...saved }));
    } catch {}
  }, []);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const buildOrderDetails = () => {
    const lines = cart.map(item => {
      const qty = item.qty || 1;
      const itemTotal = parsePrice(item.price) * qty;
      return `[ID: ${item.id}] ${item.name} | Qty: ${qty} | Price: ${item.price} | Subtotal: ₹${itemTotal.toLocaleString('en-IN')}`;
    });
    lines.push('', 'Total: ₹' + cartTotal.toLocaleString('en-IN'));
    return lines.join('\n');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem('gk_user_info', JSON.stringify({
      firstName: form.firstName, lastName: form.lastName, phone: form.phone,
      address1: form.address1, address2: form.address2, city: form.city, region: form.region, zip: form.zip
    }));
    const formData = new FormData();
    formData.append('Name_First', form.firstName);
    formData.append('Name_Last', form.lastName);
    formData.append('PhoneNumber_countrycode', form.phone);
    formData.append('Address_AddressLine1', form.address1);
    formData.append('Address_AddressLine2', form.address2);
    formData.append('Address_City', form.city);
    formData.append('Address_Region', form.region);
    formData.append('Address_ZipCode', form.zip);
    formData.append('MultiLine', buildOrderDetails());
    formData.append('zf_referrer_name', '');
    formData.append('zf_redirect_url', '');
    formData.append('zc_gad', '');
    try {
      await fetch('https://forms.zohopublic.in/myac4636gm1/form/MakeOrder/formperma/8gXguZIljhqAij-CpnNGa85zSC0q9p6j6XdeuF28NN4/htmlRecords/submit', {
        method: 'POST', body: formData, mode: 'no-cors'
      });
    } catch {}
    navigate('/thankyou');
  };

  const inp = (name, label, placeholder, required = false, type = 'text') => (
    <div style={{ marginBottom: '.9rem' }}>
      <label style={{ fontSize: '.8rem', color: '#888', marginBottom: '.3rem', display: 'block' }}>
        {label} {required && <span style={{ color: '#FF6435' }}>*</span>}
      </label>
      <input name={name} type={type} value={form[name]} onChange={handleChange} placeholder={placeholder}
        required={required} maxLength={255}
        style={{ width: '100%', border: '1.5px solid #e8dcd5', borderRadius: '.75rem', padding: '.7rem .9rem', fontSize: '.9rem', color: 'darkslategrey', outline: 'none', boxSizing: 'border-box', background: 'white', fontFamily: 'inherit' }} />
    </div>
  );

  return (
    <div style={{ padding: '1rem 1.25rem 5rem', color: 'darkslategrey' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '1.25rem' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="darkslategrey" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'darkslategrey', margin: 0 }}>Order Summary</h4>
      </div>

      {/* Cart Summary */}
      <div style={{ background: '#fff8f6', border: '1px solid #ffd5c8', borderRadius: '1rem', padding: '1rem', marginBottom: '1.5rem' }}>
        {cart.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#aaa', fontSize: '.9rem' }}>No items in cart.</p>
        ) : (
          cart.map(item => {
            const qty = item.qty || 1;
            const itemTotal = parsePrice(item.price) * qty;
            return (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '.75rem', padding: '.65rem 0', borderBottom: '1px solid #f0e8e8' }}>
                <img src={item.url || ''} alt={item.name} onError={e => e.target.style.display = 'none'}
                  style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: '.6rem', flexShrink: 0, background: '#f5f0ee' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '.88rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                  <div style={{ fontSize: '.75rem', color: '#aaa', marginTop: '.1rem' }}>Qty: {qty}</div>
                </div>
                <div style={{ fontSize: '.88rem', fontWeight: 700, color: '#FF6435', flexShrink: 0 }}>₹{itemTotal.toLocaleString('en-IN')}</div>
              </div>
            );
          })
        )}
        <hr style={{ border: 'none', borderTop: '1px solid #ffd5c8', margin: '.75rem 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1rem' }}>
          <span>Total</span>
          <span style={{ color: '#FF6435' }}>₹{cartTotal.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <p style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'darkslategrey' }}>Delivery Details</p>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
          {inp('firstName', 'First Name', 'First name', true)}
          {inp('lastName', 'Last Name', 'Last name')}
        </div>
        {inp('phone', 'Phone Number', 'e.g. 9876543210', true, 'tel')}
        {inp('address1', 'Street Address', 'House no, Street', true)}
        {inp('address2', 'Address Line 2', 'Landmark, Area (optional)')}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
          {inp('city', 'City', 'City', true)}
          {inp('region', 'State', 'State')}
        </div>
        {inp('zip', 'Pin Code', 'Pin code', true)}
        <button type="submit" style={{
          width: '100%', background: '#FF6435', color: 'white', border: 'none',
          borderRadius: '1rem', padding: '.9rem', fontSize: '1rem', fontWeight: 700,
          cursor: 'pointer', marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem', fontFamily: 'inherit'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          Place Order
        </button>
      </form>

      <Footer />
    </div>
  );
}
