# 🚜 SahyogFarm Frontend - Next.js Application

Modern, responsive Next.js application for SahyogFarm tractor marketplace with real-time API integration.

## 🎯 Overview

- **Framework**: Next.js 16.1.6 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **API Client**: Custom fetch wrapper with error handling
- **Deployment**: Vercel

---

## ✨ Features

### Public Features
- 📱 Responsive homepage with tractor listings
- 🔍 Server-side pagination (12 items per page)
- 💬 WhatsApp integration for inquiries
- 🖼️ Image optimization with Next.js Image
- 🎨 Modern UI with Tailwind CSS

### Admin Features
- 🔐 JWT-based authentication
- 📊 Dashboard with real-time statistics
- ➕ Create/Edit/Delete products
- 🖼️ Image upload to Cloudinary
- 🔄 Toggle product status (Available/Sold)
- 🔍 Search and filter products
- 📄 Pagination (10 items per page)
- 🎯 Toast notifications for all actions

---

## 🏗️ Project Structure

```
frontend/sahyogfarm/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Public homepage
│   ├── globals.css          # Global styles
│   ├── admin/               # Admin panel
│   │   ├── layout.tsx      # Admin layout with auth
│   │   ├── login/          # Login page
│   │   ├── dashboard/      # Admin dashboard
│   │   └── products/       # Product management
│   │       ├── page.tsx    # Products list (paginated)
│   │       ├── new/        # Create product
│   │       └── [id]/       # Edit product (dynamic route)
│   └── components/
│
├── components/              # Reusable React components
│   ├── Header.tsx          # Site header
│   ├── Footer.tsx          # Site footer
│   ├── Hero.tsx            # Homepage hero
│   ├── ProductCard.tsx     # Product display card
│   ├── Pagination.tsx      # Pagination component
│   ├── SectionHeader.tsx   # Section titles
│   └── Providers.tsx       # Context providers wrapper
│
├── contexts/                # React Context providers
│   ├── AuthContext.tsx     # Authentication state
│   ├── ProductsContext.tsx # Products state & CRUD
│   └── ToastContext.tsx    # Toast notifications
│
├── lib/                     # Utilities and helpers
│   ├── api.ts              # API client with error handling
│   ├── auth.ts             # Auth utilities
│   └── constants.ts        # App constants & endpoints
│
├── services/                # API service layer
│   └── productService.ts   # Product API calls
│
├── types/                   # TypeScript type definitions
│   └── index.ts            # Shared types
│
├── public/                  # Static assets
│   └── images/             # Image files
│
└── config files            # Configuration
    ├── next.config.ts      # Next.js config
    ├── tsconfig.json       # TypeScript config
    ├── tailwind.config.ts  # Tailwind config
    └── .env.local          # Environment variables (gitignored)
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Backend API running (or deployed)

### Installation

```bash
# Navigate to frontend directory
cd frontend/sahyogfarm

# Install dependencies
npm install

# Create environment file
cp .env.vercel.example .env.local

# Edit .env.local with your backend URL
NEXT_PUBLIC_API_URL=http://localhost:3001/api  # Development
# OR
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api  # Production
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Build & Production

```bash
# Build for production
npm run build

# Start production server
npm start

# Or deploy to Vercel (recommended)
vercel deploy
```

---

## 🔑 Environment Variables

Create `.env.local` in the root directory:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

**Important**: 
- ❌ Never commit `.env.local` to Git
- ✅ Use `.env.vercel.example` as template
- ✅ Add to Vercel dashboard for production

---

## 🎨 Key Features Implementation

### 1. **Authentication Flow**
```typescript
// contexts/AuthContext.tsx
- JWT token storage in localStorage
- Auto-redirect on auth failure
- Protected admin routes
```

### 2. **Toast Notifications**
```typescript
// contexts/ToastContext.tsx
- 4 types: success, error, warning, info
- Auto-dismiss with progress bar
- Stack multiple toasts
- Slide-in animation
```

### 3. **Server-Side Pagination**
```typescript
// app/admin/products/page.tsx
- Fetches only 10 products per page
- Maintains state across CRUD operations
- Auto-reset on search/filter change
```

### 4. **Error Handling**
```typescript
// lib/api.ts
- Custom ApiError class
- Preserves statusCode, code, details
- Extracts validation errors
- Rate limit detection
```

### 5. **Image Handling**
```typescript
// Components
- Base64 upload for new images
- Cloudinary URL for existing images
- Next.js Image optimization
- Multiple image support (up to 10)
```

---

## 📡 API Integration

### API Client (`lib/api.ts`)
```typescript
// Handles all HTTP requests
- Automatic JWT token attachment
- Error transformation
- Response unwrapping
- Type-safe responses
```

### Service Layer (`services/productService.ts`)
```typescript
// Product operations
- fetchProducts() - Admin list with pagination
- fetchPublicProducts() - Public list
- createProduct() - Create with images
- updateProduct() - Update with image handling
- deleteProduct() - Soft delete
- toggleProductStatus() - Status toggle
```

### Context Layer (`contexts/ProductsContext.tsx`)
```typescript
// Global state management
- Products array
- Pagination state
- Loading states
- CRUD operations
- Maintains pagination params
```

---

## 🎯 Pages & Routes

### Public Routes
- `/` - Homepage with product listings
- `/products` - All available products (if implemented)

### Admin Routes (Protected)
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin dashboard
- `/admin/products` - Products list (paginated)
- `/admin/products/new` - Create new product
- `/admin/products/[id]/edit` - Edit product

---

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type check
npx tsc --noEmit

# Build check
npm run build
```

---

## 📦 Dependencies

### Core
- `next` (16.1.6) - React framework
- `react` (19.0.0) - UI library
- `react-dom` (19.0.0) - React DOM

### UI & Styling
- `tailwindcss` - Utility-first CSS
- `react-icons` - Icon library

### State & Data
- React Context API - State management
- Custom fetch client - API calls

---

## 🚢 Deployment (Vercel)

### Via Vercel Dashboard

1. **Connect Repository**
   - Import from GitHub
   - Select `frontend/sahyogfarm` as root directory

2. **Configure Build**
   - Framework: Next.js (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `.next` (auto)

3. **Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
   ```

4. **Deploy**
   - Click "Deploy"
   - Auto-deploys on every push to main

### Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

---

## 🛠️ Configuration Files

### `next.config.ts`
```typescript
// Cloudinary image optimization
images: {
  remotePatterns: [{
    protocol: 'https',
    hostname: 'res.cloudinary.com'
  }]
}
```

### `tsconfig.json`
```json
// Path aliases
"paths": {
  "@/*": ["./*"]
}
```

---

## 📱 Responsive Design

- ✅ Mobile-first approach
- ✅ Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- ✅ Flexible grid layouts
- ✅ Touch-friendly UI elements

---

## 🔒 Security

- ✅ JWT tokens in httpOnly storage
- ✅ Protected admin routes
- ✅ Environment variables for sensitive data
- ✅ CORS configuration
- ✅ Input validation
- ✅ XSS protection via React

---

## 🐛 Common Issues

### Issue: API calls failing
**Solution**: Check `NEXT_PUBLIC_API_URL` in `.env.local`

### Issue: Images not loading
**Solution**: Verify Cloudinary domain in `next.config.ts`

### Issue: Auth not working
**Solution**: Clear localStorage and login again

### Issue: Build failing
**Solution**: Run `npm install` and check for TypeScript errors

---

## 📝 Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm start           # Start production server
npm run lint        # Run ESLint
```

---

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test locally
4. Submit pull request

---

## 📄 License

Private project - All rights reserved

---

## 🆘 Support

For issues or questions:
- Check documentation in `DEPLOYMENT_GUIDE.md`
- Review API documentation at backend `/api-docs`
- Check console for error details

---

**Built with ❤️ using Next.js and TypeScript**

