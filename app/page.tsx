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
            <span style={{ fontSize: '12px', color: '#60A5FA', fontWeight: 600 }}>هاكاثون أمد 2026 · مدعوم بالذكاء الاصطناعي</span>
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
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
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
          <span style={{ fontSize: '12px', color: '#334155', fontWeight: 500 }}>بصيرة © 2026 · هاكاثون أمد</span>
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
        }
        @media (max-width: 600px) {
          div[style*="gridTemplateColumns: '1fr 1fr'"] { grid-template-columns: 1fr !important; }
          div[style*="gridTemplateColumns: 'repeat(3"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
