# SahyogFarm Admin System Documentation

## Overview
Complete admin panel for managing products with JWT authentication.

## Project Structure

```
app/
├── admin/
│   ├── login/
│   │   ├── layout.tsx         # Login page layout with AuthProvider
│   │   └── page.tsx           # Login page
│   ├── dashboard/
│   │   └── page.tsx           # Dashboard with statistics
│   ├── products/
│   │   ├── page.tsx           # Products list with search/filter
│   │   ├── new/
│   │   │   └── page.tsx       # Create new product
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx   # Edit product
│   └── layout.tsx             # Admin layout with sidebar

components/
├── admin/
│   ├── LoginForm.tsx          # Login form component
│   ├── ProtectedRoute.tsx     # Auth protection wrapper
│   └── Sidebar.tsx            # Admin navigation sidebar

contexts/
└── AuthContext.tsx            # Authentication context & state

lib/
├── api.ts                     # API client with auth headers
├── auth.ts                    # Auth utilities (token management)
└── constants.ts               # API endpoints & constants

types/
└── index.ts                   # TypeScript type definitions
```

## Features Implemented

### 1. Authentication
- ✅ JWT-based authentication
- ✅ Login page with demo credentials
- ✅ Auth context for global state
- ✅ Protected routes
- ✅ Token management (localStorage)
- ✅ Auto-redirect on login/logout

**Demo Credentials:**
- Email: `admin@sahyogfarm.com`
- Password: `admin123`

### 2. Dashboard
- ✅ Statistics cards (Total, Available, Sold, Recent)
- ✅ Quick actions (Add New, View All)
- ✅ Recent products table
- ✅ Responsive layout

### 3. Product Management
- ✅ List all products with search
- ✅ Filter by status (All/Available/Sold)
- ✅ Create new product
- ✅ Edit existing product
- ✅ Delete product (with confirmation)
- ✅ Toggle product status
- ✅ Multiple image support
- ✅ Image preview & management

### 4. UI/UX Features
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Mobile-friendly sidebar
- ✅ Loading states
- ✅ Form validation
- ✅ Error handling
- ✅ Success/error messages
- ✅ Clean, professional design matching main site

## Routes

### Public Routes
- `/` - Homepage (existing)
- `/admin/login` - Admin login page

### Protected Admin Routes
- `/admin/dashboard` - Dashboard overview
- `/admin/products` - Products list
- `/admin/products/new` - Create product
- `/admin/products/[id]/edit` - Edit product

## Usage Guide

### 1. Login
1. Navigate to `/admin/login`
2. Enter credentials (see demo credentials above)
3. Click "Sign In"
4. Redirected to `/admin/dashboard`

### 2. Create Product
1. Go to Dashboard or Products page
2. Click "Add New Product"
3. Fill in:
   - Title (required)
   - Description (required)
   - Year (required)
   - Price (optional)
   - Status (Available/Sold)
4. Add image URLs
5. Click "Create Product"

### 3. Edit Product
1. Go to Products page
2. Click edit icon on any product
3. Modify fields
4. Click "Update Product"

### 4. Toggle Status
1. Go to Products page
2. Click toggle icon to switch between Available/Sold

### 5. Delete Product
1. Go to Products page
2. Click delete icon
3. Confirm deletion

## Backend Integration Guide

### Required API Endpoints

#### Authentication
```typescript
POST /api/auth/login
Body: { email: string, password: string }
Response: { user: User, token: string }

GET /api/auth/me
Headers: { Authorization: "Bearer {token}" }
Response: { user: User }

POST /api/auth/logout
Headers: { Authorization: "Bearer {token}" }
Response: { success: boolean }
```

#### Products (Admin)
```typescript
GET /api/admin/products
Headers: { Authorization: "Bearer {token}" }
Response: { data: Product[], total: number }

GET /api/admin/products/:id
Headers: { Authorization: "Bearer {token}" }
Response: { data: Product }

POST /api/admin/products
Headers: { Authorization: "Bearer {token}" }
Body: ProductFormData
Response: { data: Product }

PUT /api/admin/products/:id
Headers: { Authorization: "Bearer {token}" }
Body: ProductFormData
Response: { data: Product }

DELETE /api/admin/products/:id
Headers: { Authorization: "Bearer {token}" }
Response: { success: boolean }

PATCH /api/admin/products/:id/status
Headers: { Authorization: "Bearer {token}" }
Body: { status: "available" | "sold" }
Response: { data: Product }
```

#### Images
```typescript
POST /api/admin/upload
Headers: { Authorization: "Bearer {token}" }
Body: FormData with image file
Response: { url: string }
```

### Data Models

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin';
}

interface Product {
  id: string;
  title: string;
  description: string;
  images: string[];
  year: number;
  price?: number;
  status: 'available' | 'sold';
  createdAt: string;
  updatedAt: string;
}
```

## Configuration

### Update API Base URL
Edit `lib/constants.ts`:
```typescript
export const API_BASE_URL = 'YOUR_BACKEND_URL/api';
```

### Update Authentication
Edit `contexts/AuthContext.tsx` - Uncomment actual API calls and remove mock logic.

## Current State

✅ **Fully Functional with Mock Data**
- All pages working
- Mock authentication
- Mock CRUD operations
- Ready for backend integration

🔄 **Next Steps for Production:**
1. Implement backend API
2. Update API_BASE_URL in constants
3. Uncomment API calls in AuthContext
4. Add actual image upload endpoint
5. Test with real data
6. Deploy

## Notes

- **Mock Authentication:** Currently using hardcoded credentials. Replace with actual JWT validation.
- **Mock Data:** Products use static data. Replace with API calls.
- **Image Upload:** Currently using URL input. Add file upload when backend ready.
- **Tokens:** Stored in localStorage. Consider httpOnly cookies for production.

## Security Recommendations

1. Use httpOnly cookies instead of localStorage for tokens
2. Implement refresh token mechanism
3. Add CSRF protection
4. Rate limit login attempts
5. Use HTTPS in production
6. Validate all inputs on backend
7. Sanitize user inputs
8. Implement proper error handling without exposing sensitive info

## Support

For questions or issues:
- Check type definitions in `types/index.ts`
- Review API client in `lib/api.ts`
- Check auth utilities in `lib/auth.ts`
