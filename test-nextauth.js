#!/usr/bin/env node

/**
 * NextAuth.js Implementation Test Script
 * 
 * This script tests the NextAuth.js implementation by making HTTP requests
 * to the authentication endpoints.
 */

const BASE_URL = 'http://localhost:3002';

async function testNextAuthImplementation() {
  console.log('🔍 Testing NextAuth.js Implementation...\n');

  // Test 1: Check if NextAuth API routes are accessible
  try {
    console.log('1. Testing NextAuth API routes...');
    const response = await fetch(`${BASE_URL}/api/auth/providers`);
    if (response.ok) {
      const providers = await response.json();
      console.log('✅ NextAuth API routes are accessible');
      console.log('📄 Available providers:', Object.keys(providers));
    } else {
      console.log('❌ NextAuth API routes are not accessible');
    }
  } catch (error) {
    console.log('❌ Error testing NextAuth API routes:', error.message);
  }

  console.log();

  // Test 2: Check if login page is accessible
  try {
    console.log('2. Testing login page accessibility...');
    const response = await fetch(`${BASE_URL}/auth/login`);
    if (response.ok) {
      console.log('✅ Login page is accessible');
    } else {
      console.log('❌ Login page is not accessible');
    }
  } catch (error) {
    console.log('❌ Error testing login page:', error.message);
  }

  console.log();

  // Test 3: Check if middleware is working
  try {
    console.log('3. Testing middleware protection...');
    const response = await fetch(`${BASE_URL}/dashboard`, {
      redirect: 'manual'
    });
    if (response.status === 302 || response.status === 307) {
      console.log('✅ Middleware is working - redirecting protected routes');
    } else {
      console.log('❌ Middleware might not be working properly');
    }
  } catch (error) {
    console.log('❌ Error testing middleware:', error.message);
  }

  console.log();

  // Test 4: Check environment variables
  console.log('4. Checking environment variables...');
  const envVars = ['NEXTAUTH_URL', 'NEXTAUTH_SECRET', 'NEXT_PUBLIC_API_URL'];
  envVars.forEach(envVar => {
    if (process.env[envVar]) {
      console.log(`✅ ${envVar} is set`);
    } else {
      console.log(`❌ ${envVar} is not set`);
    }
  });

  console.log();
  console.log('🎉 NextAuth.js implementation test completed!');
  console.log('📝 Check the results above for any issues.');
}

// Run the test
testNextAuthImplementation().catch(console.error);
