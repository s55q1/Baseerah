'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { hasCompany } from '@/lib/company-store';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (hasCompany()) {
      router.replace('/dashboard');
    } else {
      router.replace('/setup');
    }
  }, [router]);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f8fafc',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        color: '#64748b', fontSize: '14px',
      }}>
        <svg style={{ animation: 'spin 1s linear infinite' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A3D91" strokeWidth="2.5">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
        جاري التحميل...
        <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      </div>
    </div>
  );
}
