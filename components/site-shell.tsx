'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { isAuthenticated, mockLogout } from '@/lib/mock-auth';

const navLinks = [
  { href: '/dashboard', label: 'لوحة التحكم' },
  { href: '/analytics', label: 'التحليلات' },
  { href: '/reports',   label: 'التقارير'   },
  { href: '/admin',     label: 'الإدارة'    },
  { href: '/about',     label: 'عن بصيرة'   },
  { href: '/setup',     label: '✏️ بياناتي'  },
];

const publicPaths = ['/', '/login', '/signup'];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isPublic = publicPaths.includes(pathname);
  /* Auth is bypassed for demo — treat all non-public pages as authenticated */
  const authed = !isPublic || isAuthenticated();

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
        background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(14px)',
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px', height: '64px',
        }}>
          {/* شعار */}
          <Link href={authed ? '/dashboard' : '/login'} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img src="/mascot.png" alt="بصيرة" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
            <div>
              <p style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>بصيرة</p>
              <p style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>ذكاء السيولة</p>
            </div>
          </Link>

          {/* روابط — تظهر فقط للمسجلين داخل الصفحات المحمية */}
          {!isPublic && authed && (
            <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {navLinks.map((link) => {
                const active = pathname === link.href;
                const isSetup = link.href === '/setup';
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      fontSize: '13px', fontWeight: active ? 700 : 500,
                      color: isSetup ? '#0A3D91' : active ? '#0A3D91' : '#64748b',
                      padding: '6px 14px', borderRadius: '10px',
                      background: isSetup ? '#dbeafe' : active ? '#eff6ff' : 'transparent',
                      textDecoration: 'none', transition: 'all 0.15s',
                      border: isSetup ? '1px solid #bfdbfe' : 'none',
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* يمين الـ navbar */}
          {!isPublic && authed ? (
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
          ) : isPublic ? (
            <Link href="/login" style={{
              padding: '8px 20px', borderRadius: '12px',
              background: '#0A3D91', color: 'white',
              fontSize: '13px', fontWeight: 700, textDecoration: 'none',
              boxShadow: '0 2px 12px rgba(10,61,145,0.3)',
            }}>
              دخول
            </Link>
          ) : null}
        </div>
      </header>

      <main>{children}</main>

      {/* Footer */}
      {!isPublic && (
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
                مُصمم للشركات الصغيرة والمتوسطة · هاكاثون أمد 2026 · بنك الإنماء
              </p>
            </div>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>بصيرة © 2026</p>
          </div>
        </footer>
      )}
    </div>
  );
}
