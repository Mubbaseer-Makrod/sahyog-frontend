# Authentication State Management Documentation

## Overview
The admin system uses **React Context API** with **localStorage** for persistent authentication state management. This document explains the complete authentication flow, state management, and protection mechanisms.

---

## Architecture

### Core Components

1. **AuthContext** (`contexts/AuthContext.tsx`) - Global authentication state
2. **Auth Utilities** (`lib/auth.ts`) - Token and user data management
3. **ProtectedRoute** (`components/admin/ProtectedRoute.tsx`) - Route protection wrapper
4. **Admin Layout** (`app/admin/layout.tsx`) - Layout with conditional protection

---

## How Authentication Works

### 1. State Storage (localStorage)

Authentication data is stored in the browser's localStorage:

```typescript
// Stored Keys
AUTH_TOKEN_KEY = "auth_token"      // JWT token
USER_DATA_KEY = "user_data"        // User object (id, email, name, role)
```

**Why localStorage?**
- ✅ Persists across browser sessions
- ✅ Survives page refreshes
- ✅ Simple to implement
- ⚠️ Note: For production, consider httpOnly cookies for better security

---

### 2. Authentication Context (Global State)

Located in `contexts/AuthContext.tsx`

```typescript
interface AuthContextType {
  user: User | null;              // Current user object
  isAuthenticated: boolean;        // Auth status (true if user exists)
  isLoading: boolean;              // Loading state
  login: (email, password) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}
```

**State Flow:**

1. **Initial Load** (when app starts):
   ```
   App Start → AuthProvider mounts → checkAuth() runs
   ↓
   Check localStorage for token
   ↓
   If token exists → Get cached user data → Display UI immediately
   ↓
   Verify token with backend (in background)
   ↓
   If valid → Continue | If invalid → Clear auth & logout
   ```

2. **Login Flow**:
   ```
   User submits form → login(email, password)
   ↓
   Call backend API (or mock login)
   ↓
   Receive: { user, token }
   ↓
   Save to localStorage: setAuthToken(token) + setUserData(user)
   ↓
   Update context state: setUser(user)
   ↓
   Redirect to: /admin/dashboard
   ```

3. **Logout Flow**:
   ```
   User clicks logout → logout()
   ↓
   Clear localStorage: clearAuthData()
   ↓
   Update context state: setUser(null)
   ↓
   Redirect to: /admin/login
   ```

---

### 3. Route Protection System

**Three-Layer Protection:**

#### Layer 1: Admin Layout (`app/admin/layout.tsx`)
```typescript
export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  // Login page: Only wrap with AuthProvider (no protection)
  if (isLoginPage) {
    return <AuthProvider>{children}</AuthProvider>;
  }

  // All other admin pages: Wrap with AuthProvider + ProtectedRoute
  return (
    <AuthProvider>
      <ProtectedRoute>
        <div className="flex min-h-screen bg-gray-50">
          <AdminSidebar />
          <main>{children}</main>
        </div>
      </ProtectedRoute>
    </AuthProvider>
  );
}
```

**Key Points:**
- `/admin/login` → AuthProvider only (accessible without login)
- `/admin/*` (other pages) → AuthProvider + ProtectedRoute (requires login)
- Prevents infinite redirect loops

#### Layer 2: ProtectedRoute Component (`components/admin/ProtectedRoute.tsx`)
```typescript
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading]);

  // Show loading while checking auth
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Render protected content
  return <>{children}</>;
}
```

**Protection Logic:**
1. Show loading spinner while `isLoading = true`
2. If `!isAuthenticated` after loading → Redirect to `/admin/login`
3. Only render children if authenticated

#### Layer 3: API Client (`lib/api.ts`)
```typescript
class APIClient {
  async request(endpoint, options) {
    const token = getAuthToken();
    
    // Automatically add Authorization header
    const headers = {
      ...options.headers,
      Authorization: token ? `Bearer ${token}` : '',
    };

    const response = await fetch(endpoint, { ...options, headers });
    
    // Handle 401 Unauthorized
    if (response.status === 401) {
      clearAuthData();
      window.location.href = '/admin/login';
    }
    
    return response.json();
  }
}
```

**API Protection:**
- Automatically includes JWT token in all requests
- Handles 401 errors by clearing auth and redirecting to login
- Prevents unauthorized API calls

---

## Complete Flow Diagram

### First Visit (Not Logged In)
```
User navigates to /admin/dashboard
↓
AdminLayout renders
↓
pathname !== '/admin/login' → Wrap with ProtectedRoute
↓
AuthProvider mounts → checkAuth()
↓
No token in localStorage
↓
isAuthenticated = false, isLoading = false
↓
ProtectedRoute detects !isAuthenticated
↓
Redirect to /admin/login
```

### Login Process
```
User at /admin/login (not protected)
↓
AuthProvider wraps LoginForm
↓
User enters: admin@sahyogfarm.com / admin123
↓
login() function called
↓
Mock validation (or API call)
↓
Success → Save token + user to localStorage
↓
setUser(user) → isAuthenticated = true
↓
router.push('/admin/dashboard')
↓
Dashboard loads with ProtectedRoute
↓
isAuthenticated = true → Render dashboard
```

### Authenticated Navigation
```
User at /admin/dashboard (authenticated)
↓
Clicks link to /admin/products
↓
AdminLayout re-renders
↓
AuthProvider already has user in state
↓
ProtectedRoute checks → isAuthenticated = true
↓
Render products page immediately
```

### Page Refresh (While Logged In)
```
User refreshes /admin/dashboard
↓
AuthProvider mounts → checkAuth()
↓
getAuthToken() → token exists
↓
getUserData() → user data exists
↓
setUser(cached user) → isAuthenticated = true
↓
Show UI immediately (no loading)
↓
Background: Verify token with backend
↓
If valid → Continue | If invalid → Logout
```

### Logout
```
User clicks "Logout" in Sidebar
↓
logout() function called
↓
clearAuthData() → Remove token + user from localStorage
↓
setUser(null) → isAuthenticated = false
↓
router.push('/admin/login')
↓
User at login page (not protected)
```

---

## State Management Details

### Context State
```typescript
const [user, setUser] = useState<User | null>(null);
const [isLoading, setIsLoading] = useState(true);
```

**user:**
- `null` = Not authenticated
- `{ id, email, name, role }` = Authenticated

**isLoading:**
- `true` = Checking authentication status
- `false` = Check complete (show UI or redirect)

**isAuthenticated:**
- Computed value: `!!user`
- `true` if user object exists
- `false` if user is null

### localStorage Management

**Functions in `lib/auth.ts`:**

```typescript
// Save authentication
setAuthToken(token: string)
setUserData(user: User)

// Retrieve authentication
getAuthToken(): string | null
getUserData(): User | null

// Clear authentication
clearAuthData() // Removes both token and user

// Check status
isAuthenticated(): boolean // Returns !!getAuthToken()
```

**Why cache user data?**
- Instant UI rendering on page refresh
- No waiting for backend verification
- Better user experience
- Background verification ensures security

---

## Current Implementation Status

### ✅ Working (Mock Authentication)
- Login with demo credentials
- Logout functionality
- Route protection
- State persistence across refreshes
- Auto-redirect for unauthenticated users
- Loading states

### 🔄 Ready for Backend Integration
When backend API is ready, update `contexts/AuthContext.tsx`:

```typescript
// Replace mock login with:
const login = async (email: string, password: string) => {
  try {
    setIsLoading(true);
    
    // Actual API call
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.LOGIN,
      { email, password }
    );

    setAuthToken(response.token);
    setUserData(response.user);
    setUser(response.user);
    router.push('/admin/dashboard');
  } catch (error) {
    throw error;
  } finally {
    setIsLoading(false);
  }
};
```

---

## Security Considerations

### Current Setup (Development)
- ✅ Token stored in localStorage
- ✅ Automatic token injection in API calls
- ✅ Client-side route protection
- ✅ 401 error handling
- ⚠️ No token expiration handling
- ⚠️ No refresh token mechanism

### Production Recommendations

1. **Use httpOnly Cookies**
   ```typescript
   // Instead of localStorage
   // Set-Cookie: auth_token=...; HttpOnly; Secure; SameSite=Strict
   ```
   - Prevents XSS attacks
   - Cannot be accessed by JavaScript
   - More secure than localStorage

2. **Implement Refresh Tokens**
   ```typescript
   // Short-lived access token (15 mins)
   // Long-lived refresh token (7 days)
   // Auto-refresh before expiration
   ```

3. **Add Token Expiration**
   ```typescript
   const checkAuth = async () => {
     const token = getAuthToken();
     if (isTokenExpired(token)) {
       await refreshToken();
     }
   };
   ```

4. **CSRF Protection**
   - Add CSRF tokens to form submissions
   - Verify tokens on backend

5. **Rate Limiting**
   - Limit login attempts (5 per 15 minutes)
   - Prevent brute force attacks

---

## Testing Authentication

### Manual Testing Steps

1. **Login Test**
   ```
   1. Go to /admin/login
   2. Enter: admin@sahyogfarm.com / admin123
   3. Click "Sign In"
   4. Should redirect to /admin/dashboard
   5. Check localStorage for auth_token and user_data
   ```

2. **Protected Route Test**
   ```
   1. Open incognito window
   2. Navigate to /admin/dashboard
   3. Should auto-redirect to /admin/login
   ```

3. **Persistence Test**
   ```
   1. Login successfully
   2. Refresh page (F5)
   3. Should remain logged in
   4. Check: No loading spinner, instant dashboard
   ```

4. **Logout Test**
   ```
   1. Click "Logout" button
   2. Should redirect to /admin/login
   3. Check localStorage: auth_token and user_data removed
   4. Try accessing /admin/dashboard → should redirect
   ```

5. **Invalid Credentials Test**
   ```
   1. Enter wrong email/password
   2. Should show error message
   3. Should not redirect
   4. localStorage should remain empty
   ```

---

## Troubleshooting

### Problem: Infinite Redirect Loop
**Cause:** ProtectedRoute wrapping login page
**Solution:** Check `app/admin/layout.tsx` - login page should NOT be wrapped in ProtectedRoute

### Problem: User Logged Out After Refresh
**Cause:** localStorage not persisting or checkAuth() failing
**Solution:** 
1. Check browser localStorage for auth_token
2. Verify getAuthToken() returns token
3. Check browser console for errors

### Problem: Cannot Access Protected Routes
**Cause:** Not authenticated
**Solution:**
1. Check isAuthenticated state in AuthContext
2. Verify token exists in localStorage
3. Check ProtectedRoute logic

---

## Summary

**Authentication State is Managed Through:**

1. **Context API** - Global state across all components
2. **localStorage** - Persistent storage for token and user
3. **ProtectedRoute** - Client-side access control
4. **API Client** - Automatic token injection and 401 handling
5. **Admin Layout** - Conditional protection based on route

**Key Benefits:**
- ✅ Persistent sessions (survives refresh)
- ✅ Instant UI rendering (cached user data)
- ✅ Automatic redirects (unauthenticated users)
- ✅ Centralized auth logic (single source of truth)
- ✅ Easy to integrate with backend (API-ready)

**Next Steps:**
1. Implement backend JWT authentication
2. Add token expiration and refresh mechanism
3. Consider migrating to httpOnly cookies for production
4. Add comprehensive error handling
5. Implement rate limiting on login endpoint
