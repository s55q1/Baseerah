'use client';

import { useRouter } from 'next/navigation';
import { hasCompany } from '@/lib/company-store';

const STATS = [
  { value: '82%',  label: 'من الشركات الصغيرة تفشل بسبب أزمة سيولة لم تتوقعها', color: '#EF4444' },
  { value: '18',   label: 'يوماً تحذيراً مسبقاً قبل وقوع الأزمة', color: '#60A5FA' },
  { value: '92%',  label: 'دقة في التنبؤ بمسار السيولة 6 أشهر مستقبلاً', color: '#34D399' },
  { value: '3x',   label: 'أسرع في اتخاذ قرارات التمويل الصحيحة', color: '#A78BFA' },
];

const HOW = [
  { num: '01', title: 'أدخل بيانات شركتك', body: 'الرصيد النقدي، الإيرادات، المصروفات، وعوامل الخطر في 3 دقائق فقط', icon: '📋' },
  { num: '02', title: 'يحلل محرك AI', body: 'خوارزمية مرجّحة بـ 3 عوامل تحسب درجة الخطر وتتنبأ بمسار السيولة 6 أشهر', icon: '🧠' },
  { num: '03', title: 'تتخذ قراراً مدروساً', body: 'توصيات تمويلية فورية مخصصة لحجم الفجوة — قبل أن تصبح أزمة', icon: '🎯' },
];

export default function LandingPage() {
  const router = useRouter();

  const handleCTA = () => {
    if (hasCompany()) {
      router.push('/dashboard');
    } else {
      router.push('/setup');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0F172A', fontFamily: "'Inter', system-ui, sans-serif", overflowX: 'hidden' }} dir="rtl">

      {/* ── Navbar ── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/mascot.png" alt="بصيرة" style={{ width: '34px', height: '34px', objectFit: 'contain' }} />
          <div>
            <p style={{ fontSize: '16px', fontWeight: 800, color: '#F8FAFC', lineHeight: 1 }}>بصيرة</p>
            <p style={{ fontSize: '10px', color: '#475569', marginTop: '1px' }}>ذكاء السيولة</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => router.push('/about')} style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}>
            عن بصيرة
          </button>
          <button onClick={() => router.push('/login')} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '10px', padding: '8px 18px', color: '#CBD5E1', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            دخول
          </button>
          <button onClick={handleCTA} style={{ background: '#2563EB', border: 'none', borderRadius: '10px', padding: '9px 20px', color: 'white', fontSize: '13px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 12px rgba(37,99,235,0.4)' }}>
            جرّب مجاناً ←
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', padding: '100px 32px 80px', textAlign: 'center', overflow: 'hidden' }}>
        {/* background glows */}
        <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.12), transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '200px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.07), transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: '760px', margin: '0 auto' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: '999px', padding: '6px 16px', marginBottom: '32px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', display: 'inline-block', boxShadow: '0 0 6px #10B981' }} />
            <span style={{ fontSize: '12px', color: '#60A5FA', fontWeight: 600 }}>هاكاثون امد · مصرف الإنماء × طويق</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 900, color: '#F8FAFC', lineHeight: 1.15, letterSpacing: '-1.5px', marginBottom: '24px' }}>
            اعرف أزمة السيولة<br />
            <span style={{ background: 'linear-gradient(90deg, #60A5FA, #34D399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              قبلها بـ 18 يوماً
            </span>
          </h1>

          <p style={{ fontSize: '18px', color: '#64748B', lineHeight: 1.8, maxWidth: '520px', margin: '0 auto 40px' }}>
            منصة FinTech ذكية تحلل تدفقاتك المالية وتعطيك درجة خطر دقيقة مع توصيات تمويلية فورية — قبل أن تنتهي السيولة.
          </p>

          {/* CTAs */}
          <div className="landing-hero-btns" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleCTA}
              style={{ background: 'linear-gradient(135deg, #2563EB, #1d4ed8)', border: 'none', borderRadius: '14px', padding: '16px 36px', color: 'white', fontSize: '16px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 24px rgba(37,99,235,0.45)', letterSpacing: '-0.2px' }}>
              🚀 ابدأ التحليل مجاناً
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '14px', padding: '16px 36px', color: '#CBD5E1', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}>
              👁 شاهد العرض التجريبي
            </button>
          </div>

          <p style={{ marginTop: '16px', fontSize: '12px', color: '#334155' }}>لا يحتاج بطاقة ائتمانية · بياناتك تبقى على جهازك</p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ padding: '0 32px 80px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {STATS.map((s) => (
            <div key={s.value} style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '28px 24px', textAlign: 'center' }}>
              <p style={{ fontSize: '48px', fontWeight: 900, color: s.color, letterSpacing: '-2px', lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: '13px', color: '#64748B', marginTop: '10px', lineHeight: 1.6 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Problem / Solution ── */}
      <section style={{ padding: '0 32px 80px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ fontSize: '11px', color: '#475569', fontWeight: 600, letterSpacing: '2px', marginBottom: '10px' }}>المشكلة والحل</p>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.6px' }}>لماذا تفشل الشركات؟</h2>
          </div>
          <div className="landing-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '16px', padding: '32px' }}>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>😰</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FCA5A5', marginBottom: '12px' }}>بدون بصيرة</h3>
              {['تكتشف أزمة السيولة بعد نفاد الرصيد', 'لا تحذير مسبق — لا وقت للتصرف', 'قرارات تمويل عشوائية وأسعار مرتفعة', 'الراتب يتأخر، الموردون يرفضون التمديد'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ color: '#EF4444', flexShrink: 0, marginTop: '2px' }}>✕</span>
                  <span style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.6 }}>{t}</span>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '16px', padding: '32px' }}>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>🧠</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#6EE7B7', marginBottom: '12px' }}>مع بصيرة</h3>
              {['تحذير مسبق 18 يوماً قبل نفاد السيولة', 'محرك AI يحسب 6 أشهر مستقبلية لحظياً', 'توصيات تمويلية مخصصة بأقل تكلفة', 'قرارات مبنية على بيانات — لا على حدس'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }}>✓</span>
                  <span style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.6 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ padding: '0 32px 80px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ fontSize: '11px', color: '#475569', fontWeight: 600, letterSpacing: '2px', marginBottom: '10px' }}>كيف يعمل</p>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.6px' }}>3 خطوات للتحكم في سيولتك</h2>
          </div>
          <div className="landing-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {HOW.map((h) => (
              <div key={h.num} style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '32px 24px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '20px', left: '20px', fontSize: '11px', fontWeight: 700, color: '#1E3A5F', letterSpacing: '1px' }}>{h.num}</div>
                <div style={{ fontSize: '36px', marginBottom: '16px' }}>{h.icon}</div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#F8FAFC', marginBottom: '10px' }}>{h.title}</h3>
                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.7 }}>{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product Preview (Dashboard mockup) ── */}
      <section style={{ padding: '0 32px 80px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p style={{ fontSize: '11px', color: '#475569', fontWeight: 600, letterSpacing: '2px', marginBottom: '10px' }}>المنتج</p>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.6px' }}>شاهد بصيرة تعمل</h2>
            <p style={{ fontSize: '14px', color: '#64748B', marginTop: '10px' }}>لوحة تحكم ذكية تعطيك صورة كاملة عن صحة سيولتك</p>
          </div>

          {/* Mockup frame */}
          <div style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '3px', boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)' }}>
            {/* Window chrome */}
            <div style={{ background: '#0F172A', borderRadius: '17px 17px 0 0', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
              <div style={{ flex: 1, margin: '0 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '10px', color: '#475569' }}>baseerah.vercel.app/dashboard</span>
              </div>
            </div>

            {/* Dashboard content mockup */}
            <div style={{ background: '#EEF2F7', borderRadius: '0 0 17px 17px', padding: '16px', direction: 'rtl' }}>
              {/* Top KPI row */}
              <div className="landing-mockup-kpi" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '12px' }}>
                {[
                  { label: 'مؤشر الخطر', value: '84', color: '#EF4444', sub: 'حرج' },
                  { label: 'الرصيد النقدي', value: '8.2M', color: '#3B82F6', sub: 'ر.س' },
                  { label: 'مدة التشغيل', value: '92 يوم', color: '#D97706', sub: 'ينفد سبتمبر' },
                  { label: 'صافي الشهر', value: '-0.32M', color: '#EF4444', sub: 'خسارة' },
                ].map((k) => (
                  <div key={k.label} style={{ background: 'white', borderRadius: '10px', padding: '12px', border: '1px solid #E2E8F0' }}>
                    <p style={{ fontSize: '9px', color: '#94A3B8', marginBottom: '4px' }}>{k.label}</p>
                    <p style={{ fontSize: '18px', fontWeight: 900, color: k.color, lineHeight: 1 }}>{k.value}</p>
                    <p style={{ fontSize: '9px', color: '#CBD5E1', marginTop: '2px' }}>{k.sub}</p>
                  </div>
                ))}
              </div>

              {/* Middle row: chart + gauge */}
              <div className="landing-mockup-row" style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '10px', marginBottom: '12px' }}>
                {/* Fake bar chart */}
                <div style={{ background: 'white', borderRadius: '10px', padding: '14px', border: '1px solid #E2E8F0' }}>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>توقعات السيولة — 6 أشهر</p>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '70px' }}>
                    {[88, 72, 65, 58, 44, 32].map((h, i) => (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '100%', height: `${h}%`, borderRadius: '4px 4px 0 0', background: h > 70 ? '#EF4444' : h > 50 ? '#D97706' : '#10B981' }} />
                        <span style={{ fontSize: '8px', color: '#CBD5E1' }}>{['يناير','فبراير','مارس','أبريل','مايو','يونيو'][i].slice(0,3)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk gauge */}
                <div style={{ background: '#0F172A', borderRadius: '10px', padding: '14px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{ fontSize: '9px', color: '#64748B', marginBottom: '8px' }}>مؤشر الخطر</p>
                  <svg viewBox="0 0 80 50" width="120" height="75">
                    <path d="M 10 45 A 30 30 0 0 1 70 45" fill="none" stroke="#1E293B" strokeWidth="6" strokeLinecap="round"/>
                    <path d="M 10 45 A 30 30 0 0 1 70 45" fill="none" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" strokeDasharray="94" strokeDashoffset="24"/>
                    <text x="40" y="42" textAnchor="middle" fill="#F8FAFC" fontSize="14" fontWeight="900">84</text>
                  </svg>
                  <span style={{ fontSize: '9px', color: '#EF4444', fontWeight: 700 }}>⚠ خطر حرج</span>
                </div>
              </div>

              {/* Alert strip */}
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px' }}>⚠️</span>
                <p style={{ fontSize: '10px', color: '#92400E', fontWeight: 600 }}>تحذير: الرصيد النقدي سينفد خلال 92 يوماً — يُنصح بالتحرك الفوري للحصول على تمويل</p>
                <button style={{ marginRight: 'auto', background: '#D97706', border: 'none', borderRadius: '5px', padding: '4px 10px', color: 'white', fontSize: '9px', fontWeight: 700, cursor: 'default', flexShrink: 0 }}>اتخذ إجراءً</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Social proof / Dashboard preview ── */}
      <section style={{ padding: '0 32px 80px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '48px', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: '#60A5FA', fontWeight: 600, letterSpacing: '2px', marginBottom: '16px' }}>BASEERAH · بصيرة</p>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.5px', marginBottom: '16px' }}>
            جاهز لتجربة قرار أذكى؟
          </h2>
          <p style={{ fontSize: '15px', color: '#64748B', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px', lineHeight: 1.7 }}>
            أدخل بيانات شركتك وشاهد محرك التنبؤ يعمل على أرقامك الحقيقية — مجاناً وفورياً.
          </p>
          <button
            onClick={handleCTA}
            style={{ background: 'linear-gradient(135deg, #2563EB, #1d4ed8)', border: 'none', borderRadius: '14px', padding: '16px 40px', color: 'white', fontSize: '16px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 24px rgba(37,99,235,0.5)' }}>
            🚀 ابدأ التحليل الآن — مجاناً
          </button>
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginTop: '24px', flexWrap: 'wrap' }}>
            {['✓ بدون تسجيل', '✓ بياناتك على جهازك فقط', '✓ نتائج فورية'].map(t => (
              <span key={t} style={{ fontSize: '12px', color: '#475569', fontWeight: 500 }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="/mascot.png" alt="بصيرة" style={{ width: '24px', height: '24px', objectFit: 'contain', opacity: 0.7 }} />
          <span style={{ fontSize: '12px', color: '#334155', fontWeight: 500 }}>بصيرة © 2026 · هاكاثون امد · مصرف الإنماء × طويق</span>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          {[['لوحة التحكم', '/dashboard'], ['التحليلات', '/analytics'], ['التقارير', '/reports'], ['عن بصيرة', '/about']].map(([label, href]) => (
            <button key={href} onClick={() => router.push(href)} style={{ background: 'none', border: 'none', color: '#334155', fontSize: '12px', cursor: 'pointer', fontWeight: 500 }}>{label}</button>
          ))}
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          section { padding-left: 16px !important; padding-right: 16px !important; }
          header { padding: 0 16px !important; }
        }
        @media (max-width: 640px) {
          .landing-grid-2 { grid-template-columns: 1fr !important; }
          .landing-grid-3 { grid-template-columns: 1fr !important; }
          .landing-grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
          .landing-hero-btns { flex-direction: column !important; align-items: stretch !important; }
          .landing-hero-btns button { text-align: center !important; }
          .landing-nav-actions .nav-login { display: none !important; }
          .landing-mockup-row { grid-template-columns: 1fr !important; }
          .landing-mockup-kpi { grid-template-columns: repeat(2,1fr) !important; }
          .landing-mockup-bars { display: none !important; }
          .landing-footer { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }
          .landing-footer-links { flex-wrap: wrap !important; gap: 12px !important; }
        }
      `}</style>
    </div>
  );
}
