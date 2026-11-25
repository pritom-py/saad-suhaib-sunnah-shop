# সাদ সুহাইব সুন্নাহ শপ — Project Handover Document
**Saad Suhaib Sunnah Shop — Full-Stack E-Commerce Website**

---

## 📋 Project Overview

| Field | Value |
|---|---|
| **Business Name** | সাদ সুহাইব সুন্নাহ শপ (Saad Suhaib Sunnah Shop) |
| **Framework** | Next.js 15 + React 19 + TypeScript |
| **Database** | SQLite (dev) / Neon PostgreSQL (production) |
| **ORM** | Prisma 6 |
| **Styling** | Tailwind CSS v3 |
| **Language** | Bengali (primary) / English (secondary) |
| **Currency** | BDT (৳) |
| **Phone** | +880 1749160444 |
| **WhatsApp** | https://wa.me/8801749160444 |
| **Facebook** | https://facebook.com/profile.php?id=61571320383081 |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 20+
- pnpm (`npm install -g pnpm`)

### Setup Steps

```powershell
# 1. Clone / navigate to project
cd E:\EHSARA\site

# 2. Install dependencies
pnpm install

# 3. Generate Prisma client
pnpm prisma:generate

# 4. Create database schema (SQLite)
pnpm prisma:push

# 5. Seed with demo data + products
pnpm db:seed

# 6. Start development server
pnpm dev
```

The site will be live at **http://localhost:3000**

---

## 🔐 Admin Credentials (Demo)

| Field | Value |
|---|---|
| **URL** | http://localhost:3000/admin/login |
| **Email** | `admin@saadsuhaib.local` |
| **Password** | the `DEMO_ADMIN_PASSWORD` value in your `.env` |

> ⚠️ **Change these before going live!** Use the Admin → Settings page or update the seed.ts file.

---

## 📁 Project Structure

```
E:\EHSARA\site\
├── public/
│   ├── logo/           ← logo.jpg (circular Islamic brand logo)
│   ├── products/       ← 31 product images (WhatsApp originals)
│   ├── banners/        ← Hero banner images
│   └── patterns/       ← Islamic geometric background patterns
│
├── prisma/
│   ├── schema.prisma   ← Full database schema (30+ models)
│   ├── dev.db          ← SQLite database (local dev only)
│   └── seed.ts         ← Seeds 19 products, categories, admin, demo order
│
├── src/
│   ├── app/            ← Next.js App Router pages
│   │   ├── (storefront pages: homepage, shop, product, checkout, etc.)
│   │   └── admin/      ← Complete CMS dashboard
│   ├── components/
│   │   └── storefront/ ← All reusable UI components
│   ├── lib/
│   │   ├── auth.ts     ← JWT authentication (no NextAuth dependency)
│   │   ├── prisma.ts   ← Prisma singleton client
│   │   ├── locale.ts   ← Bengali number/price formatting
│   │   └── bangladesh-geo.ts ← All 64 districts + upazilas
│   ├── actions/        ← Next.js Server Actions (checkout, orders, admin)
│   ├── services/       ← Database query layer
│   ├── validations/    ← Zod schemas for all forms
│   ├── locales/        ← bn.json + en.json translation files
│   └── __tests__/      ← Vitest unit tests (37 tests, 100% pass)
│
├── docs/               ← This handover document
├── .env                ← Environment variables (do NOT commit to git)
├── vitest.config.ts    ← Vitest configuration
└── package.json        ← npm scripts
```

---

## 🌐 All Pages & Routes

### Storefront
| Route | Page | Description |
|---|---|---|
| `/` | Homepage | Hero + categories + featured products + wholesale CTA |
| `/shop` | All Products | Filter by category, paginated grid |
| `/category/[slug]` | Category Page | Products in a specific category |
| `/product/[slug]` | Product Detail | Image gallery, variants, add-to-cart |
| `/checkout` | Checkout | COD/bKash/Nagad form with district selector |
| `/order-success` | Order Confirmation | Success screen with order number |
| `/track-order` | Order Tracking | Visual timeline with courier info |
| `/wholesale` | Wholesale Inquiry | Form for bulk/trade customers |
| `/offers` | Active Coupons | Public coupon codes display |
| `/about` | About Us | Business story and mission |
| `/contact` | Contact | Phone, WhatsApp, Facebook links |
| `/delivery-policy` | Delivery Policy | Full delivery terms (Bengali) |
| `/return-policy` | Return Policy | Returns & exchange policy |
| `/privacy-policy` | Privacy Policy | Data usage policy |

### Admin CMS
| Route | Page |
|---|---|
| `/admin/login` | Admin login |
| `/admin` | Dashboard with KPIs & recent orders |
| `/admin/products` | Products list (edit/delete) |
| `/admin/products/new` | Add new product |
| `/admin/categories` | Category management |
| `/admin/orders` | All orders with status filters |
| `/admin/orders/[id]` | Order detail + status update + courier |
| `/admin/payments` | Payment verification (bKash/Nagad) |
| `/admin/inventory` | Stock level management |
| `/admin/wholesale` | Wholesale inquiry management |
| `/admin/cms` | Hero banners + content pages editor |
| `/admin/settings` | Business settings (delivery rates, payment numbers) |

---

## 💳 Payment Configuration

### Cash on Delivery (COD)
No configuration needed. Orders are created immediately.

### bKash
1. Go to **Admin → Settings**
2. Enter your bKash merchant number
3. Customers pay to that number, enter Transaction ID in checkout
4. Admin verifies in **Admin → Payments**

### Nagad
Same flow as bKash. Set Nagad number in Admin → Settings.

---

## 📦 Adding New Products

### Via Admin CMS (Recommended)
1. Upload product image to `public/products/` and name it descriptively (e.g., `new-tupi-blue.jpg`)
2. Go to **Admin → Products → Add New Product**
3. Fill in Bengali name, price, category, stock quantity
4. Enter the image filename in the Images field
5. Click Save — product immediately appears on storefront

### Via seed.ts (Bulk)
Edit `prisma/seed.ts` and add your product to the `products` array, then run:
```powershell
pnpm db:seed
```

---

## 🖼️ Product Image Naming Convention

Images in `public/products/` follow the pattern from `scripts/setup-assets.js`:
```
WhatsApp Image YYYY-MM-DD at HH.MM.SS (N).jpeg
```

The seed links these exact filenames. If you rename images, update the seed or database accordingly.

---

## 🧪 Running Tests

```powershell
# Run all tests once
pnpm test

# Watch mode (re-runs on file change)
pnpm test:watch

# Type check only (no emit)
pnpm type-check
```

**Current test results:** 37 tests across 3 suites — ✅ 100% passing
- `auth.test.ts` — JWT signing/verification, role permissions (9 tests)
- `validations.test.ts` — Zod schemas: checkout, wholesale, admin login (21 tests)
- `locale.test.ts` — Bengali number & price formatting (7 tests)

---

## 🏗️ Production Build

```powershell
pnpm build
```

**Last successful build output:**
- ✅ Compiled in 14.7s, zero TypeScript errors
- ✅ 31 routes generated (mix of static + dynamic)
- ⚠️ Minor warning: `metadataBase` not set (social OG images use localhost fallback — set in production)

To fix the metadataBase warning, add to your root `layout.tsx`:
```tsx
export const metadata: Metadata = {
  metadataBase: new URL("https://your-production-domain.com"),
  // ... rest of metadata
};
```

---

## ☁️ Production Deployment (Vercel + Neon)

### Step 1: Create Neon PostgreSQL Database
1. Go to [neon.tech](https://neon.tech) → Create Project → Copy connection string

### Step 2: Update .env for Production
```env
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/saadsuhaib?sslmode=require"
JWT_SECRET="<generate a 64-char random string>"
AUTH_SECRET="<generate a 64-char random string>"
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
```

### Step 3: Update prisma/schema.prisma
Change datasource provider:
```prisma
datasource db {
  provider = "postgresql"  // was "sqlite"
  url      = env("DATABASE_URL")
}
```

### Step 4: Push Schema to Neon
```powershell
pnpm prisma:push
pnpm db:seed
```

### Step 5: Deploy to Vercel
```powershell
vercel --prod
```
Or connect your GitHub repo in Vercel dashboard and add all env vars.

---

## 🎨 Brand Colors

| Color | Hex | Usage |
|---|---|---|
| Deep Emerald | `#063D2B` | Primary (nav, buttons, headers) |
| Maroon | `#780E15` | Accent (prices, logo border) |
| Gold | `#D4A43B` | Decorative (dividers, icons, borders) |
| Ivory | `#FBF7EC` | Background (page, cards) |

---

## 🗄️ Database Models Summary

The Prisma schema contains 30+ models:

| Model | Purpose |
|---|---|
| User | Admin accounts |
| Customer | Registered customers |
| Category | Product categories (টুপি, পাগড়ি, etc.) |
| Product | Products with Bengali/English names |
| ProductImage | Multiple images per product |
| ProductVariant | Size/color variants with separate prices |
| Cart + CartItem | Shopping cart (session-based) |
| Order + OrderItem | Orders with full audit trail |
| OrderStatusHistory | Complete order status timeline |
| Payment | bKash/Nagad payment records |
| DeliveryZone + DeliveryRate | Dhaka vs outside Dhaka pricing |
| WholesaleInquiry | Bulk order inquiries |
| Coupon + CouponUsage | Discount code system |
| HeroBanner | Rotating homepage hero images |
| HomepageSection | Homepage layout configuration |
| ContentPage | CMS pages (about, policies) |
| BusinessSettings | Site-wide settings (phone, payment, delivery) |
| AuditLog | Admin action log for security |

---

## 🛡️ Security Notes

- JWT tokens expire in 7 days; stored in `httpOnly` cookies (XSS-resistant)
- Passwords hashed with `bcryptjs` (12 salt rounds)
- All Server Actions validate input with Zod before hitting the database
- Prisma parameterized queries prevent SQL injection
- Order prices are re-verified server-side — client price cannot be manipulated
- Admin routes require session verification on every request

---

## 📞 Support Contacts

| Contact | Value |
|---|---|
| Phone / WhatsApp | +880 1749160444 |
| WhatsApp URL | https://wa.me/8801749160444 |
| Facebook | https://facebook.com/profile.php?id=61571320383081 |

---

## 🔄 Demo Test Data

After seeding, the following demo data is available:

| Data | Value |
|---|---|
| Demo Order | `SS-DEMO-1001` |
| Demo Phone | `01711000000` |
| Coupon 1 | `SUNNAH10` (10% off, min order ৳200) |
| Coupon 2 | `TUPI50` (৳50 off, min order ৳300) |

Use the demo order number + phone to test the Order Tracking page.

---

*Document generated: November 2026 | Project: Saad Suhaib Sunnah Shop v1.0*
