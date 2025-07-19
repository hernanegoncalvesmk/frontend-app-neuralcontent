import { getSession } from "next-auth/react";

// Client-side session getter
export async function getClientAuthSession() {
  return await getSession();
}

// Check if user has specific role (client-side)
export async function hasRole(role: string) {
  const session = await getClientAuthSession();
  return session?.user && (session.user as any).role === role;
}

// Check if user's email is verified (client-side)
export async function isEmailVerified() {
  const session = await getClientAuthSession();
  return session?.user && (session.user as any).isEmailVerified;
}

// Get current user (client-side)
export async function getCurrentUser() {
  const session = await getClientAuthSession();
  return session?.user || null;
}

// Redirect to login if not authenticated
export function requireAuth() {
  return {
    redirect: {
      destination: "/auth/login",
      permanent: false,
    },
  };
}

// Redirect to dashboard if already authenticated
export function requireNoAuth() {
  return {
    redirect: {
      destination: "/dashboard",
      permanent: false,
    },
  };
}
