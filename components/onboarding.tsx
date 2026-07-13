'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Brain, CheckCircle2, X, Zap } from 'lucide-react';

const SLIDES = [
  {
    emoji: '😰',
    tag: 'المشكلة',
    tagColor: '#D97706',
    title: '82% من الشركات الصغيرة\nتفشل بسبب أزمة سيولة',
    body: 'يكتشف أصحاب الشركات أزمة السيولة بعد وقوع الضرر — بعد أن ينتهي الرصيد، أو يتأخر الراتب، أو يرفض المورد التمديد.',
    stat: [
      { value: '82%', label: 'نسبة الفشل بسبب السيولة' },
      { value: '0', label: 'يوم تحذير مسبق في المتوسط' },
    ],
  },
  {
    emoji: '🧠',
    tag: 'الحل',
    tagColor: '#2563EB',
    title: 'بصيرة تنبئك بالأزمة\nقبل 18 يوماً من وقوعها',
    body: 'محرك ذكاء اصطناعي يحلل معدل الاحتراق، تأخر التحصيل، وضغط الرواتب — ويعطيك درجة خطر دقيقة مع توصيات تمويلية فورية.',
    stat: [
      { value: '92%', label: 'دقة التنبؤ' },
      { value: '18', label: 'يوم تحذير مسبق' },
    ],
  },
  {
    emoji: '🚀',
    tag: 'العرض التجريبي',
    tagColor: '#10B981',
    title: 'جاهز للعرض الحي\nضغطة واحدة تغير السيناريو',
    body: 'استخدم لوحة التحكم التجريبي (⚙ أسفل اليسار أو Shift+D) للتبديل بين سيناريو الأزمة والوضع الصحي — كل الأرقام تتغير لحظياً.',
    stat: [
      { value: '7', label: 'متغيرات تفاعلية' },
      { value: '2', label: 'سيناريو جاهز للعرض' },
    ],
  },
];

const STORAGE_KEY = 'baseerah_onboarded';

export function Onboarding({ forceShow = false }: { forceShow?: boolean }) {
  const [visible, setVisible] = useState(false);
  const [slide, setSlide]     = useState(0);

  useEffect(() => {
    if (forceShow || !localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, [forceShow]);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
    setSlide(0);
  };

  if (!visible) return null;

  const current = SLIDES[slide];
  const isLast  = slide === SLIDES.length - 1;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: 'rgba(15,23,42,0.72)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
      animation: 'fadeIn 0.3s ease',
    }}>
      <div style={{
        width: '100%', maxWidth: '480px',
        background: '#0F172A', borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
        overflow: 'hidden', fontFamily: "'Inter', system-ui, sans-serif",
        animation: 'slideUp 0.35s cubic-bezier(0.16,1,0.3,1)',
      }} dir="rtl">

        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <Brain size={14} color="#60A5FA" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#F8FAFC', letterSpacing: '0.3px' }}>بصيرة · مرحباً بك</span>
          </div>
          <button onClick={dismiss} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', display: 'flex', padding: '4px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: '6px', padding: '14px 20px 0', justifyContent: 'center' }}>
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} style={{
              height: '3px', flex: 1, maxWidth: '60px', borderRadius: '999px',
              border: 'none', cursor: 'pointer',
              background: i === slide ? current.tagColor : i < slide ? '#334155' : 'rgba(255,255,255,0.08)',
              transition: 'all 0.3s',
            }} />
          ))}
        </div>

        {/* Slide content */}
        <div style={{ padding: '28px 28px 20px', textAlign: 'center' }} key={slide}>
          {/* Emoji */}
          <div style={{ fontSize: '52px', marginBottom: '16px', animation: 'popIn 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
            {current.emoji}
          </div>

          {/* Tag */}
          <span style={{ display: 'inline-block', background: current.tagColor + '20', border: `1px solid ${current.tagColor}44`, color: current.tagColor, fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '6px', marginBottom: '14px', letterSpacing: '0.5px' }}>
            {current.tag}
          </span>

          {/* Title */}
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#F8FAFC', lineHeight: 1.3, letterSpacing: '-0.4px', marginBottom: '14px', whiteSpace: 'pre-line' }}>
            {current.title}
          </h2>

          {/* Body */}
          <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.75, marginBottom: '22px' }}>
            {current.body}
          </p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '22px' }}>
            {current.stat.map((s) => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '14px' }}>
                <p style={{ fontSize: '26px', fontWeight: 900, color: current.tagColor, lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: '11px', color: '#475569', marginTop: '5px' }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Feature list on last slide */}
          {isLast && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '22px', textAlign: 'right' }}>
              {[
                'محرك تنبؤ يحسب 6 أشهر مستقبلية لحظياً',
                'مؤشر خطر AI مبني على 3 عوامل موزونة',
                'توصيات تمويلية تتغير حسب شدة الأزمة',
                'لوحة تحكم سرية للتبديل بين السيناريوهات',
              ].map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '9px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '9px 12px' }}>
                  <CheckCircle2 size={13} color="#10B981" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>{f}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ padding: '16px 24px 22px', display: 'flex', gap: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {slide > 0 && (
            <button onClick={() => setSlide((s) => s - 1)} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '10px', padding: '11px 18px', color: '#94A3B8', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              <ArrowRight size={13} /> السابق
            </button>
          )}
          <button
            onClick={isLast ? dismiss : () => setSlide((s) => s + 1)}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: isLast ? '#10B981' : '#2563EB', border: 'none', borderRadius: '10px', padding: '12px', color: 'white', fontSize: '13px', fontWeight: 700, cursor: 'pointer', boxShadow: `0 2px 12px ${isLast ? 'rgba(16,185,129,0.35)' : 'rgba(37,99,235,0.35)'}`, transition: 'all 0.2s' }}>
            {isLast ? (
              <><Zap size={13} /> ابدأ العرض التجريبي</>
            ) : (
              <>التالي <ArrowLeft size={13} /></>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(24px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes popIn   { from{transform:scale(0.6)} to{transform:scale(1)} }
      `}</style>
    </div>
  );
}
