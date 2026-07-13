'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, ArrowLeft, X } from 'lucide-react';

interface CrisisAlertProps {
  status: 'critical' | 'warning' | 'stable';
  riskScore: number;
  daysToAlert: number;
  onDismiss?: () => void;
}

export function CrisisAlert({ status, riskScore, daysToAlert, onDismiss }: CrisisAlertProps) {
  const [visible, setVisible]     = useState(false);
  const [leaving, setLeaving]     = useState(false);
  const prevStatus = useRef<string>('');
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const prev = prevStatus.current;
    prevStatus.current = status;

    /* Show alert whenever status changes TO critical or warning */
    if ((status === 'critical' || status === 'warning') && prev !== status && prev !== '') {
      setLeaving(false);
      setVisible(true);

      if (timerRef.current) clearTimeout(timerRef.current);
      /* Auto-dismiss after 8s */
      timerRef.current = setTimeout(() => dismiss(), 8000);
    }

    /* If status returns to stable, dismiss */
    if (status === 'stable' && prev !== 'stable' && prev !== '') {
      dismiss();
    }

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [status]);

  const dismiss = () => {
    setLeaving(true);
    setTimeout(() => { setVisible(false); setLeaving(false); onDismiss?.(); }, 350);
  };

  if (!visible) return null;

  const isCritical = status === 'critical';
  const accent     = isCritical ? '#D97706' : '#3B82F6';
  const accentDark = isCritical ? '#92400E' : '#1E40AF';
  const bg         = isCritical ? '#FFFBEB' : '#EFF6FF';
  const border     = isCritical ? '#FDE68A' : '#BFDBFE';

  return (
    <div
      style={{
        position: 'fixed', bottom: '24px', right: '24px', zIndex: 99998,
        width: '340px', maxWidth: 'calc(100vw - 40px)',
        background: bg, border: `1.5px solid ${border}`,
        borderRight: `4px solid ${accent}`,
        borderRadius: '14px',
        boxShadow: `0 8px 32px ${accent}30, 0 2px 8px rgba(0,0,0,0.08)`,
        fontFamily: "'Inter', system-ui, sans-serif",
        animation: leaving ? 'toastOut 0.35s ease forwards' : 'toastIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        overflow: 'hidden',
      }}
      dir="rtl"
    >
      {/* Progress bar (depletes over 8s) */}
      <div style={{ height: '3px', background: `${accent}20` }}>
        <div style={{
          height: '100%', background: accent, borderRadius: '999px',
          animation: 'depleteBar 8s linear forwards',
          width: '100%',
        }} />
      </div>

      <div style={{ padding: '16px 16px 18px' }}>
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          {/* Icon */}
          <div style={{
            flexShrink: 0, width: '36px', height: '36px', borderRadius: '10px',
            background: accent + '20', border: `1px solid ${accent}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: isCritical ? 'iconPulse 1.5s ease infinite' : 'none',
          }}>
            <AlertTriangle size={18} color={accent} />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 700, color: accent, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '3px' }}>
                  {isCritical ? '⚠️ تنبيه حرج' : '🔔 تحذير مالي'}
                </p>
                <p style={{ fontSize: '14px', fontWeight: 700, color: accentDark, lineHeight: 1.3 }}>
                  {isCritical
                    ? 'السيولة في خطر — اتخذ إجراءً فورياً'
                    : 'الوضع المالي يحتاج متابعة'}
                </p>
              </div>
              <button onClick={dismiss} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '2px', flexShrink: 0, marginTop: '-2px' }}>
                <X size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '14px' }}>
          <div style={{ background: 'white', borderRadius: '9px', padding: '10px 12px', border: `1px solid ${border}` }}>
            <p style={{ fontSize: '10px', color: '#94A3B8', marginBottom: '3px' }}>مؤشر الخطر</p>
            <p style={{ fontSize: '20px', fontWeight: 800, color: accentDark }}>{riskScore}<span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 400 }}>/100</span></p>
          </div>
          <div style={{ background: 'white', borderRadius: '9px', padding: '10px 12px', border: `1px solid ${border}` }}>
            <p style={{ fontSize: '10px', color: '#94A3B8', marginBottom: '3px' }}>وقت التحذير</p>
            <p style={{ fontSize: '20px', fontWeight: 800, color: accentDark }}>{daysToAlert}<span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 400 }}> يوم</span></p>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={dismiss}
          style={{
            marginTop: '12px', width: '100%', borderRadius: '9px',
            background: isCritical ? '#D97706' : '#2563EB', border: 'none',
            padding: '10px', fontSize: '12px', fontWeight: 700, color: 'white',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            boxShadow: `0 2px 8px ${accent}40`,
          }}
        >
          {isCritical ? 'عرض التوصيات الفورية' : 'راجع الخطة المقترحة'} <ArrowLeft size={12} />
        </button>
      </div>

      <style>{`
        @keyframes toastIn    { from{opacity:0;transform:translateY(16px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes toastOut   { from{opacity:1;transform:translateY(0) scale(1)} to{opacity:0;transform:translateY(16px) scale(0.96)} }
        @keyframes depleteBar { from{width:100%} to{width:0%} }
        @keyframes iconPulse  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.12)} }
      `}</style>
    </div>
  );
}
