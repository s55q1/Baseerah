'use client';

import { Brain, Sparkles, Target, Trophy, Zap } from 'lucide-react';
import Link from 'next/link';
import { SiteShell } from '@/components/site-shell';

const TEAM = [
  {
    name: 'سلطان سالم',
    role: 'مطور Full-Stack & AI',
    bio: 'بنى محرك التنبؤ المالي وواجهة المستخدم الكاملة',
    avatar: '👨‍💻',
    accent: '#2563EB',
  },
];

const STACK = [
  { name: 'Next.js 14',   desc: 'App Router + SSR',         color: '#0F172A' },
  { name: 'Recharts',     desc: 'رسوم بيانية تفاعلية',      color: '#2563EB' },
  { name: 'TypeScript',   desc: 'Type-safe engine',          color: '#3B82F6' },
  { name: 'Vercel',       desc: 'نشر فوري',                  color: '#10B981' },
  { name: 'Tailwind CSS', desc: 'تصميم سريع',               color: '#6D28D9' },
];

const MILESTONES = [
  { time: 'اليوم 1',  event: 'تحديد المشكلة: 82% من الشركات تفشل بسبب السيولة' },
  { time: 'اليوم 2',  event: 'بناء محرك التنبؤ المالي والخوارزمية المرجحة بـ 7 متغيرات' },
  { time: 'اليوم 3',  event: 'تصميم الواجهة الاحترافية Dark Theme وتجربة المستخدم' },
  { time: 'اليوم 4',  event: 'التحليلات، التقارير PDF، لوحة الإدارة، نظام التنبيهات الحي' },
  { time: 'اليوم 5',  event: 'Wizard إدخال البيانات الحقيقية، ربط كل الصفحات بـ localStorage، PWA' },
  { time: 'اليوم 6',  event: 'محاكي "ماذا لو؟"، طلب التمويل الذكي، تقرير PDF كامل بالبيانات الحية — تقديم النهائي' },
];

const card = {
  borderRadius: '14px', background: '#FFF',
  border: '1px solid #E2E8F0',
  boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.05)',
  padding: '24px',
};

export default function AboutPage() {
  return (
    <SiteShell>
      <main style={{ minHeight: '100vh', background: '#EEF2F7', padding: '28px 20px', fontFamily: "'Inter', system-ui, sans-serif" }} dir="rtl">
        <style>{`
          @media (max-width: 640px) {
            .about-grid-3 { grid-template-columns: 1fr !important; }
            .about-grid-2 { grid-template-columns: 1fr !important; }
            .about-stats  { grid-template-columns: repeat(2,1fr) !important; }
          }
        `}</style>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>

          {/* ── Hero ── */}
          <header style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', borderRadius: '16px', padding: '44px 40px', color: 'white', textAlign: 'center', boxShadow: '0 4px 32px rgba(15,23,42,0.28)' }}>
            <div style={{ fontSize: '52px', marginBottom: '16px' }}>👁️</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: '6px', padding: '4px 14px', marginBottom: '16px' }}>
              <Trophy size={11} color="#FCD34D" />
              <span style={{ fontSize: '11px', color: '#FCD34D', fontWeight: 700 }}>هاكاثون أمد 2026</span>
            </div>
            <h1 style={{ fontSize: '36px', fontWeight: 900, color: '#F8FAFC', letterSpacing: '-0.8px', lineHeight: 1.2 }}>
              بصيرة<br />
              <span style={{ fontSize: '20px', fontWeight: 500, color: '#60A5FA', letterSpacing: '-0.2px' }}>ذكاء السيولة للشركات الصغيرة والمتوسطة</span>
            </h1>
            <p style={{ color: '#64748B', fontSize: '15px', marginTop: '16px', maxWidth: '560px', margin: '16px auto 0', lineHeight: 1.75 }}>
              منصة FinTech تنبئك بأزمة السيولة قبل 18 يوماً من وقوعها — بالذكاء الاصطناعي، لا بالحدس.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px', flexWrap: 'wrap' }}>
              <Link href="/setup" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#2563EB', color: 'white', textDecoration: 'none', padding: '11px 22px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, boxShadow: '0 2px 12px rgba(37,99,235,0.4)' }}>
                <Zap size={13} /> جرّب بياناتك الآن
              </Link>
              <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.07)', color: '#CBD5E1', textDecoration: 'none', padding: '11px 22px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.10)' }}>
                العرض التجريبي
              </Link>
            </div>
          </header>

          {/* ── Problem / Solution / Impact ── */}
          <section className="about-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            {[
              { emoji: '😰', tag: 'المشكلة', color: '#D97706', body: '82% من الشركات الصغيرة تفشل بسبب أزمات سيولة لم تكن تتوقعها. لا تحذير، لا وقت للتصرف.' },
              { emoji: '🧠', tag: 'الحل',     color: '#2563EB', body: 'محرك AI يحسب درجة خطر مرجحة من 3 عوامل ويتنبأ بمسار الرصيد 6 أشهر مستقبلاً — لحظياً.' },
              { emoji: '🚀', tag: 'الأثر',    color: '#10B981', body: '92% دقة تنبؤ، تحذير مبكر 18 يوماً، وتوصيات تمويلية فورية تناسب حجم الفجوة.' },
            ].map((s) => (
              <div key={s.tag} style={{ ...card, textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{s.emoji}</div>
                <span style={{ background: s.color + '15', color: s.color, fontSize: '11px', fontWeight: 700, padding: '3px 11px', borderRadius: '5px', letterSpacing: '0.4px' }}>{s.tag}</span>
                <p style={{ fontSize: '13px', color: '#475569', marginTop: '12px', lineHeight: 1.7 }}>{s.body}</p>
              </div>
            ))}
          </section>

          {/* ── Team ── */}
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '20px' }}>
              <Brain size={14} color="#2563EB" />
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>الفريق</h2>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
              {TEAM.map((m) => (
                <div key={m.name} style={{ flex: '1', minWidth: '220px', background: '#F8FAFC', borderRadius: '12px', padding: '20px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: m.accent + '15', border: `1px solid ${m.accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
                    {m.avatar}
                  </div>
                  <div>
                    <p style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>{m.name}</p>
                    <p style={{ fontSize: '12px', color: m.accent, fontWeight: 600, marginTop: '2px' }}>{m.role}</p>
                    <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', lineHeight: 1.5 }}>{m.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Tech Stack + Timeline ── */}
          <section className="about-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '18px' }}>
                <Sparkles size={14} color="#2563EB" />
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>التقنيات المستخدمة</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {STACK.map((t) => (
                  <div key={t.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAFC', borderRadius: '9px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.color, flexShrink: 0 }} />
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{t.name}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>{t.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...card, background: '#0F172A', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '18px' }}>
                <Target size={14} color="#60A5FA" />
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#F8FAFC' }}>مسيرة البناء</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {MILESTONES.map((m, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', paddingBottom: i < MILESTONES.length - 1 ? '16px' : '0' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563EB', marginTop: '5px' }} />
                      {i < MILESTONES.length - 1 && <div style={{ width: '1px', flex: 1, background: 'rgba(255,255,255,0.08)', marginTop: '4px' }} />}
                    </div>
                    <div style={{ paddingBottom: i < MILESTONES.length - 1 ? '0' : '0' }}>
                      <span style={{ fontSize: '10px', color: '#2563EB', fontWeight: 700, letterSpacing: '0.5px' }}>{m.time}</span>
                      <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px', lineHeight: 1.6 }}>{m.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Stats strip ── */}
          <div className="about-stats" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', borderRadius: '14px', padding: '28px 32px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0', border: '1px solid rgba(255,255,255,0.04)' }}>
            {[
              { value: '18',  label: 'يوم تحذير مسبق',   color: '#D97706' },
              { value: '92%', label: 'دقة التنبؤ',         color: '#2563EB' },
              { value: '7',   label: 'متغيرات تفاعلية',   color: '#10B981' },
              { value: '3x',  label: 'سرعة القرار',        color: '#6D28D9' },
            ].map((s, i) => (
              <div key={s.label} style={{ textAlign: 'center', padding: '0 20px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <p style={{ fontSize: '32px', fontWeight: 900, color: s.color, letterSpacing: '-1px' }}>{s.value}</p>
                <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>{s.label}</p>
              </div>
            ))}
          </div>

        </div>
      </main>
    </SiteShell>
  );
}
