# NextAuth.js Implementation Documentation

## Overview

This implementation integrates NextAuth.js v5 with the existing NeuralContent application, providing JWT-based authentication with the backend API.

## Files Created/Modified

### Core Configuration
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth.js API route configuration
- `src/types/auth.ts` - TypeScript type definitions for authentication
- `middleware.ts` - Authentication middleware for route protection

### Providers
- `src/providers/NextAuthProvider.tsx` - NextAuth session provider
- `app/layout.tsx` - Modified to include NextAuth provider

### Components
- `src/components/auth/NextAuthLoginForm.tsx` - Login form using NextAuth
- `src/components/auth/NextAuthRegisterForm.tsx` - Registration form using NextAuth
- `src/components/auth/ProtectedRoute.tsx` - Route protection component
- `src/components/ui/LoadingSpinner.tsx` - Loading spinner component

### Services & Hooks
- `src/services/nextAuth.service.ts` - Authentication service for API calls
- `src/hooks/useNextAuth.ts` - Custom hook for NextAuth operations
- `src/lib/auth-utils.ts` - Authentication utility functions

### Environment Variables
- `.env.local` - Already configured with NextAuth variables

## Configuration Details

### NextAuth Configuration
- **Provider**: Credentials provider for email/password authentication
- **Session Strategy**: JWT (server-side sessions)
- **Session Duration**: 30 days
- **Pages**: Custom login (`/auth/login`) and error (`/auth/error`) pages

### API Integration
- **Backend URL**: `http://localhost:3001/v1`
- **Login Endpoint**: `/auth/login`
- **Register Endpoint**: `/auth/register`
- **Additional Endpoints**: Forgot password, reset password, email verification

### Middleware Protection
- Protects all routes except public pages and API routes
- Redirects unauthenticated users to `/auth/login`
- Redirects authenticated users away from auth pages to `/dashboard`

## Usage Examples

### Using the NextAuth Hook
```typescript
import { useNextAuth } from '@/hooks/useNextAuth';

function MyComponent() {
  const { user, isAuthenticated, login, logout, isLoading } = useNextAuth();
  
  // Component logic
}
```

### Protecting Routes
```typescript
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function DashboardPage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <Dashboard />
    </ProtectedRoute>
  );
}
```

### Using the HOC
```typescript
import { withProtectedRoute } from '@/components/auth/ProtectedRoute';

const ProtectedDashboard = withProtectedRoute(Dashboard, { 
  requireAuth: true 
});
```

## Environment Variables

Required environment variables in `.env.local`:
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-jwt-key-change-in-production
NEXT_PUBLIC_API_URL=http://localhost:3001/v1
```

## Integration with Existing Auth System

This NextAuth implementation works alongside the existing AuthProvider:
- `NextAuthProvider` provides session management
- `AuthProvider` provides additional authentication logic
- Both can be used together for comprehensive authentication

## Security Features

- JWT tokens for stateless authentication
- Secure session management
- Route-level protection
- Automatic token refresh handling
- CSRF protection (built-in NextAuth.js)

## Backend API Requirements

The backend API should support:
- `POST /auth/login` - Email/password authentication
- `POST /auth/register` - User registration
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Password reset confirmation
- `POST /auth/verify-email` - Email verification
- `POST /auth/resend-verification` - Resend verification email

Expected API response format:
```json
{
  "success": true,
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "string",
    "isEmailVerified": boolean
  }
}
```

## Testing

To test the implementation:
1. Start the backend API on `http://localhost:3001`
2. Start the Next.js app on `http://localhost:3000`
3. Navigate to `/auth/login` to test login
4. Navigate to `/auth/register` to test registration
5. Try accessing protected routes like `/dashboard`

## Next Steps

1. Test the implementation with the backend API
2. Implement additional authentication features (2FA, social login)
3. Add error handling and user feedback
4. Implement refresh token rotation
5. Add comprehensive test coverage
