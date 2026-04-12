# Gamkharu Boutique — React App

## Project Structure

```
gamkharu/
├── public/
│   ├── index.html
│   ├── database.json        ← Your product data (update this)
│   ├── rootimg/             ← Put your hero/category images here
│   │   └── 01.webp
│   └── p/                   ← Put your product images here
│       ├── 1.webp
│       ├── 1a.webp
│       └── ...
├── src/
│   ├── context/
│   │   └── AppContext.jsx   ← Global cart, wishlist, DB state
│   ├── components/
│   │   ├── Layout.jsx       ← Sticky nav + searchbar wrapper
│   │   ├── Navbar.jsx
│   │   ├── SearchBar.jsx
│   │   ├── Footer.jsx
│   │   └── ProductCard.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Product.jsx
│   │   ├── Cart.jsx
│   │   ├── Order.jsx
│   │   ├── Search.jsx
│   │   ├── Wishlist.jsx
│   │   ├── FAQ.jsx
│   │   ├── ThankYou.jsx
│   │   └── Category.jsx
│   ├── App.jsx
│   └── index.js
└── package.json
```

## Setup & Run

```bash
npm install
npm start
```

## Build for Production

```bash
npm run build
```

## Important Notes

### 1. Add your images
- Place product images in `public/p/` (e.g., `1.webp`, `1a.webp`, etc.)
- Place category/hero images in `public/rootimg/` (e.g., `01.webp`)

### 2. Update WhatsApp number
In `src/pages/Product.jsx`, find:
```js
const WA_NUMBER = '';
```
Replace with your number (e.g., `'919395229608'`)

### 3. Update database.json
Add/edit products in `public/database.json`. Each product:
```json
{
  "id": 1,
  "name": "Product Name",
  "url": "p/1.webp",
  "url2": "p/1a.webp",
  "price": "3950₹",
  "cat": "category tags here featured"
}
```
Use `"featured"` in `cat` to mark featured products.

### 4. Routes
| Old HTML page | New React route |
|---|---|
| `index.html` | `/` |
| `product.html?id=1` | `/product?id=1` |
| `cart.html` | `/cart` |
| `order.html` | `/order` |
| `search.html?q=...` | `/search?q=...` |
| `wishlist.html` | `/wishlist` |
| `faq.html` | `/faq` |
| `thankyou.html` | `/thankyou` |
| `catagories/clothing.html` | `/categories/clothing` |
| `catagories/jewelry.html` | `/categories/jewelry` |
| `catagories/accessories.html` | `/categories/accessories` |

### 5. Zoho Form
The order form still submits to your Zoho endpoint. No changes needed.

### 6. Deploy
For Netlify/Vercel, add a redirect rule so all routes go to `index.html`:

**Netlify** — create `public/_redirects`:
```
/* /index.html 200
```

**Vercel** — create `vercel.json`:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```
