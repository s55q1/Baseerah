'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { mockLogin } from '@/lib/mock-auth';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise((r) => setTimeout(r, 700));

    const ok = mockLogin(username.trim(), password);
    if (!ok) {
      setLoading(false);
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
      return;
    }

    setSuccess(true);
    await new Promise((r) => setTimeout(r, 500));
    router.push('/dashboard');
  };

  const fillDemo = () => {
    setUsername('admin');
    setPassword('admin');
    setError('');
  };

  return (
    <div
      className="min-h-screen flex"
      dir="rtl"
      style={{
        animation: success ? 'fadeOut 0.4s ease forwards' : 'fadeIn 0.5s ease both',
      }}
    >
      {/* ===== اللوحة الداكنة (يمين) ===== */}
      <div className="hidden lg:flex lg:w-[58%] relative overflow-hidden flex-col justify-between p-14"
        style={{ background: 'linear-gradient(145deg, #010C1F 0%, #031430 50%, #020B1E 100%)' }}
      >
        {/* توهجات خلفية */}
        <div style={{
          position: 'absolute', top: '-100px', left: '-100px',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(30,80,200,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', right: '10%',
          width: '380px', height: '380px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,180,220,0.10) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* شعار */}
        <div className="relative z-10 flex items-center gap-3">
          <div style={{
            background: 'linear-gradient(135deg, #1a56db, #0A3D91)',
            borderRadius: '14px', padding: '10px',
            boxShadow: '0 4px 20px rgba(26,86,219,0.45)',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
            </svg>
          </div>
          <div>
            <p style={{ color: '#fff', fontSize: '22px', fontWeight: 800, letterSpacing: '-0.3px' }}>بصيرة</p>
            <p style={{ color: '#5b8dee', fontSize: '11px', marginTop: '1px' }}>ذكاء السيولة للأعمال</p>
          </div>
        </div>

        {/* النص الرئيسي */}
        <div className="relative z-10">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            borderRadius: '999px', border: '1px solid rgba(91,141,238,0.3)',
            background: 'rgba(91,141,238,0.08)', padding: '6px 14px',
            color: '#7ba7f5', fontSize: '12px', marginBottom: '28px',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            مدعوم بالذكاء الاصطناعي · هاكاثون أمد 2026
          </div>

          <h1 style={{
            color: '#fff', fontSize: '46px', fontWeight: 900,
            lineHeight: 1.15, letterSpacing: '-1px',
          }}>
            اعرف أزمة<br />
            <span style={{
              background: 'linear-gradient(90deg, #60c8ff, #93c5fd)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>السيولة قبلها</span><br />
            بـ 18 يوم
          </h1>

          <p style={{ color: '#7d95b5', fontSize: '15px', marginTop: '20px', maxWidth: '400px', lineHeight: 1.7 }}>
            بصيرة تحلل تدفقاتك المالية في الوقت الفعلي وتنبهك قبل وقوع الأزمة، مع توصيات تمويلية فورية.
          </p>

          {/* إحصائيات */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '40px' }}>
            {[
              { value: '18', label: 'يوم تنبيه مسبق', color: '#60c8ff' },
              { value: '92%', label: 'دقة التنبؤ', color: '#4ade80' },
              { value: '3x', label: 'سرعة القرار', color: '#a78bfa' },
            ].map((s) => (
              <div key={s.label} style={{
                borderRadius: '16px', border: '1px solid rgba(255,255,255,0.07)',
                background: 'rgba(255,255,255,0.04)', padding: '16px', backdropFilter: 'blur(8px)',
              }}>
                <p style={{ fontSize: '30px', fontWeight: 900, color: s.color }}>{s.value}</p>
                <p style={{ fontSize: '11px', color: '#5a7a9e', marginTop: '4px', lineHeight: 1.3 }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* ميزات */}
          <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              'تنبؤ بالتدفقات النقدية قبل 6 أشهر',
              'تحليل أسباب الخطر بالذكاء الاصطناعي',
              'توصيات تمويلية فورية من بنوك معتمدة',
            ].map((f) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#8faec8' }}>
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #60c8ff, #3b82f6)', flexShrink: 0,
                }} />
                <span style={{ fontSize: '13px' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ position: 'relative', zIndex: 10, color: '#2d4a6a', fontSize: '11px' }}>
          بصيرة © 2026 · جميع الحقوق محفوظة
        </p>
      </div>

      {/* ===== نموذج الدخول (يسار) ===== */}
      <div className="w-full lg:w-[42%] flex items-center justify-center bg-white px-8 py-12">
        <div style={{ width: '100%', maxWidth: '360px' }}>

          {/* شعار للجوال */}
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <div style={{ background: '#0A3D91', borderRadius: '12px', padding: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
              </svg>
            </div>
            <p style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>بصيرة</p>
          </div>

          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            مرحباً بك
          </h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '6px' }}>
            سجّل دخولك للوصول إلى لوحة التحكم
          </p>

          {/* بطاقة الديمو */}
          <button
            type="button"
            onClick={fillDemo}
            style={{
              marginTop: '24px', width: '100%', borderRadius: '16px',
              border: '2px dashed #bfdbfe', background: 'linear-gradient(135deg, #eff6ff, #f0f9ff)',
              padding: '14px 16px', textAlign: 'right', cursor: 'pointer',
              transition: 'all 0.2s', display: 'block',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#0A3D91')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#bfdbfe')}
          >
            <p style={{ color: '#0A3D91', fontWeight: 700, fontSize: '13px' }}>
              ⚡ اضغط لملء بيانات الديمو تلقائياً
            </p>
            <p style={{ color: '#60a5fa', fontSize: '12px', fontFamily: 'monospace', marginTop: '4px' }}>
              المستخدم: admin · كلمة السر: admin
            </p>
          </button>

          {/* فاصل */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            <span style={{ color: '#94a3b8', fontSize: '12px' }}>أو أدخل يدوياً</span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                اسم المستخدم
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                style={{
                  width: '100%', borderRadius: '14px',
                  border: '1.5px solid #e2e8f0', background: '#f8fafc',
                  padding: '12px 16px', fontSize: '14px', color: '#0f172a',
                  outline: 'none', transition: 'border 0.2s, box-shadow 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#0A3D91';
                  e.target.style.boxShadow = '0 0 0 3px rgba(10,61,145,0.08)';
                  e.target.style.background = '#fff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = '#f8fafc';
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                كلمة المرور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%', borderRadius: '14px',
                  border: '1.5px solid #e2e8f0', background: '#f8fafc',
                  padding: '12px 16px', fontSize: '14px', color: '#0f172a',
                  outline: 'none', transition: 'border 0.2s, box-shadow 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#0A3D91';
                  e.target.style.boxShadow = '0 0 0 3px rgba(10,61,145,0.08)';
                  e.target.style.background = '#fff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = '#f8fafc';
                }}
              />
            </div>

            {error && (
              <div style={{
                borderRadius: '14px', border: '1px solid #fecaca',
                background: '#fef2f2', padding: '12px 16px',
                color: '#b91c1c', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || success}
              style={{
                width: '100%', borderRadius: '14px',
                background: loading || success
                  ? 'linear-gradient(135deg, #60a5fa, #3b82f6)'
                  : 'linear-gradient(135deg, #1a56db, #0A3D91)',
                padding: '14px', fontSize: '14px', fontWeight: 700,
                color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 20px rgba(10,61,145,0.3)',
                transition: 'all 0.2s', letterSpacing: '0.2px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              {loading ? (
                <>
                  <svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  جاري الدخول...
                </>
              ) : success ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  تم الدخول ✓
                </>
              ) : (
                'دخول إلى بصيرة ←'
              )}
            </button>
          </form>

          <div style={{ marginTop: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#94a3b8', fontSize: '12px' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            نظام آمن · للعرض التجريبي فقط
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(-8px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
