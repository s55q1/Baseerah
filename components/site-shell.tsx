'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { mockLogout } from '@/lib/mock-auth';

const links = [
  { href: '/dashboard', label: 'لوحة التحكم' },
  { href: '/analytics', label: 'التحليلات' },
  { href: '/reports', label: 'التقارير' },
  { href: '/admin', label: 'الإدارة' },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    mockLogout();
    router.replace('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a' }}>
      {/* ===== Navbar ===== */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 30,
        borderBottom: '1px solid rgba(226,232,240,0.8)',
        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)',
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px', height: '64px',
        }}>
          {/* شعار */}
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(135deg, #1a56db, #0A3D91)',
              borderRadius: '12px', padding: '8px',
              boxShadow: '0 2px 12px rgba(10,61,145,0.25)',
            }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>بصيرة</p>
              <p style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>ذكاء السيولة</p>
            </div>
          </Link>

          {/* روابط */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontSize: '13px', fontWeight: active ? 700 : 500,
                    color: active ? '#0A3D91' : '#64748b',
                    padding: '6px 14px', borderRadius: '10px',
                    background: active ? '#eff6ff' : 'transparent',
                    textDecoration: 'none', transition: 'all 0.15s',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* زر تسجيل الخروج */}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 18px', borderRadius: '12px',
              border: '1.5px solid #e2e8f0', background: 'white',
              fontSize: '13px', fontWeight: 600, color: '#475569',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#0A3D91';
              e.currentTarget.style.color = '#0A3D91';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.color = '#475569';
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            خروج
          </button>
        </div>
      </header>

      <main>{children}</main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #e2e8f0', background: 'white',
        padding: '20px 32px',
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: '#0A3D91', borderRadius: '8px', padding: '6px' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
              مُصمم للشركات الصغيرة والمتوسطة · هاكاثون أمد 2026
            </p>
          </div>
          <p style={{ fontSize: '12px', color: '#94a3b8' }}>بصيرة © 2026</p>
        </div>
      </footer>
    </div>
  );
}
