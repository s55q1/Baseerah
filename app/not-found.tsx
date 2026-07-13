'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', background: '#0F172A', display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontFamily: "'Inter', system-ui, sans-serif", padding: '20px',
    }} dir="rtl">
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '6px', padding: '4px 14px', marginBottom: '20px' }}>
          <span style={{ fontSize: '11px', color: '#FCA5A5', fontWeight: 700 }}>خطأ 404</span>
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.4px', marginBottom: '12px' }}>
          هذه الصفحة غير موجودة
        </h1>
        <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.7, marginBottom: '32px' }}>
          الرابط الذي وصلت إليه غير صحيح أو تمت إزالة الصفحة.
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/dashboard" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: '#2563EB', color: 'white', textDecoration: 'none',
            padding: '11px 22px', borderRadius: '10px', fontSize: '13px', fontWeight: 700,
            boxShadow: '0 2px 12px rgba(37,99,235,0.4)',
          }}>
            🏠 لوحة التحكم
          </Link>
          <Link href="/about" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(255,255,255,0.06)', color: '#94A3B8', textDecoration: 'none',
            padding: '11px 22px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            عن بصيرة
          </Link>
        </div>
      </div>
    </div>
  );
}
