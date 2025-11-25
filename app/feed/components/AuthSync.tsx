'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/shared/libs/axios.config';
import { setAuthToken } from '@/shared/libs/axios.config';

export function AuthSync() {
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    
    if (token) {
      setAuthToken(token);
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  return null;
}

