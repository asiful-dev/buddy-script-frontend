'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/shared/libs/axios.config';
import { setAuthToken } from '@/shared/libs/axios.config';

/**
 * Client-side component to sync localStorage token to cookie
 * This ensures middleware can see the token
 */
export function AuthSync() {
  const router = useRouter();

  useEffect(() => {
    // Check if we have a token in localStorage but not in cookie
    const token = getAuthToken();
    
    if (token) {
      // Sync token to cookie for middleware
      setAuthToken(token);
    } else {
      // No token found, redirect to login
      router.push('/auth/login');
    }
  }, [router]);

  return null;
}

