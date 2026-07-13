'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Brain, Building2, CheckCircle2, DollarSign, TrendingDown } from 'lucide-react';
import { saveCompany, type FinancialInputs } from '@/lib/company-store';

/* ── Sectors ── */
const SECTORS = ['تجزئة', 'إنشاءات', 'تقنية', 'غذاء وضيافة', 'لوجستيات', 'استيراد وتصدير', 'خدمات مهنية', 'صحة', 'تعليم', 'أخرى'];
const SIZES   = ['أقل من 10 موظفين', '10 – 50 موظف', '50 – 200 موظف', 'أكثر من 200 موظف'];

/* ── Step types ── */
interface Step1 { name: string; sector: string; size: string }
interface Step2 { currentCash: string; monthlyRevenue: string; operationalExpenses: string; burnRate: string }
interface Step3 { salaryTrend: number; collectionDelay: number; inventoryStagnation: number }

const STEP_META = [
  { label: 'شركتك', icon: <Building2 size={16} /> },
  { label: 'وضعك المالي', icon: <DollarSign size={16} /> },
  { label: 'عوامل الخطر', icon: <TrendingDown size={16} /> },
];

/* ── Helpers ── */
const riskLabel = (v: number) =>
  v < 30 ? { t: 'منخفض', c: '#10B981' } : v < 60 ? { t: 'متوسط', c: '#D97706' } : { t: 'مرتفع', c: '#EF4444' };

const delayLabel = (d: number) =>
  d < 15 ? { t: 'ممتاز', c: '#10B981' } : d < 35 ? { t: 'مقبول', c: '#D97706' } : { t: 'متأخر', c: '#EF4444' };

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep]   = useState(0);
  const [saving, setSaving] = useState(false);

  const [s1, setS1] = useState<Step1>({ name: '', sector: '', size: '' });
  const [s2, setS2] = useState<Step2>({ currentCash: '', monthlyRevenue: '', operationalExpenses: '', burnRate: '35' });
  const [s3, setS3] = useState<Step3>({ salaryTrend: 40, collectionDelay: 25, inventoryStagnation: 30 });

  /* ── Validation ── */
  const canNext =
    step === 0 ? s1.name.trim().length > 1 && s1.sector && s1.size :
    step === 1 ? parseFloat(s2.currentCash) > 0 && parseFloat(s2.monthlyRevenue) > 0 && parseFloat(s2.operationalExpenses) > 0 :
    true;

  /* ── Save & go ── */
  const finish = async () => {
    setSaving(true);
    const inputs: FinancialInputs = {
      currentCash:          parseFloat(s2.currentCash),
      monthlyRevenue:       parseFloat(s2.monthlyRevenue),
      operationalExpenses:  parseFloat(s2.operationalExpenses),
      burnRate:             parseFloat(s2.burnRate),
      salaryTrend:          s3.salaryTrend,
      collectionDelay:      s3.collectionDelay,
      inventoryStagnation:  s3.inventoryStagnation,
    };
    saveCompany({ name: s1.name, sector: s1.sector, size: s1.size, inputs, savedAt: new Date().toISOString() });
    await new Promise(r => setTimeout(r, 600));
    router.replace('/dashboard');
  };

  /* ── Shared styles ── */
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '13px 16px', borderRadius: '11px',
    border: '1.5px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.05)',
    color: '#F8FAFC', fontSize: '15px', outline: 'none', boxSizing: 'border-box',
    fontFamily: "'Inter', system-ui, sans-serif", transition: 'border 0.2s',
  };
  const labelStyle: React.CSSProperties = { fontSize: '12px', color: '#64748B', fontWeight: 600, marginBottom: '8px', display: 'block', letterSpacing: '0.3px' };
  const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column' };

  return (
    <div style={{ minHeight: '100vh', background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'Inter', system-ui, sans-serif" }} dir="rtl">

      <div style={{ width: '100%', maxWidth: '520px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '6px' }}>
            <Brain size={22} color="#60A5FA" />
            <span style={{ fontSize: '22px', fontWeight: 900, color: '#F8FAFC', letterSpacing: '-0.4px' }}>بصيرة</span>
          </div>
          <p style={{ fontSize: '13px', color: '#475569' }}>ذكاء السيولة للشركات الصغيرة والمتوسطة</p>
        </div>

        {/* Card */}
        <div style={{ background: '#1E293B', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 24px 64px rgba(0,0,0,0.4)', overflow: 'hidden' }}>

          {/* Step bar */}
          <div style={{ padding: '20px 28px 0', display: 'flex', gap: '8px' }}>
            {STEP_META.map((m, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ height: '3px', borderRadius: '999px', background: i <= step ? '#2563EB' : 'rgba(255,255,255,0.08)', transition: 'background 0.35s' }} />
                <span style={{ fontSize: '10px', color: i === step ? '#60A5FA' : '#334155', fontWeight: i === step ? 700 : 500, transition: 'color 0.3s' }}>
                  {m.label}
                </span>
              </div>
            ))}
          </div>

          {/* Content */}
          <div style={{ padding: '28px 28px 24px' }}>

            {/* Step 1 — Company info */}
            {step === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', animation: 'slideIn 0.3s ease' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.3px' }}>أخبرنا عن شركتك</h2>
                  <p style={{ fontSize: '13px', color: '#475569', marginTop: '6px' }}>سنستخدم هذه المعلومات لتخصيص تحليل السيولة</p>
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>اسم الشركة / المؤسسة</label>
                  <input
                    value={s1.name}
                    onChange={e => setS1(p => ({ ...p, name: e.target.value }))}
                    placeholder="مثال: مؤسسة النجاح التجارية"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#2563EB'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.10)'}
                  />
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>القطاع</label>
                  <select
                    value={s1.sector}
                    onChange={e => setS1(p => ({ ...p, sector: e.target.value }))}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    <option value="" style={{ background: '#1E293B' }}>اختر القطاع...</option>
                    {SECTORS.map(s => <option key={s} value={s} style={{ background: '#1E293B' }}>{s}</option>)}
                  </select>
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>حجم الشركة</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {SIZES.map(sz => (
                      <button
                        key={sz}
                        onClick={() => setS1(p => ({ ...p, size: sz }))}
                        style={{
                          padding: '11px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                          background: s1.size === sz ? 'rgba(37,99,235,0.2)' : 'rgba(255,255,255,0.04)',
                          border: s1.size === sz ? '1.5px solid #2563EB' : '1.5px solid rgba(255,255,255,0.07)',
                          color: s1.size === sz ? '#60A5FA' : '#64748B',
                        }}
                      >{sz}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 — Financial data */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', animation: 'slideIn 0.3s ease' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.3px' }}>وضعك المالي الحالي</h2>
                  <p style={{ fontSize: '13px', color: '#475569', marginTop: '6px' }}>الأرقام بالمليون ريال سعودي — كن دقيقاً قدر الإمكان</p>
                </div>

                {[
                  { label: 'الرصيد النقدي الحالي (مليون ر.س)', key: 'currentCash',         placeholder: 'مثال: 8.5' },
                  { label: 'الإيراد الشهري (مليون ر.س)',        key: 'monthlyRevenue',      placeholder: 'مثال: 3.2' },
                  { label: 'المصروفات الثابتة الشهرية (مليون ر.س)', key: 'operationalExpenses', placeholder: 'مثال: 1.8' },
                ].map(f => (
                  <div key={f.key} style={fieldStyle}>
                    <label style={labelStyle}>{f.label}</label>
                    <input
                      type="number" min="0" step="0.1"
                      value={s2[f.key as keyof Step2]}
                      onChange={e => setS2(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#2563EB'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.10)'}
                    />
                  </div>
                ))}

                <div style={fieldStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ ...labelStyle, marginBottom: 0 }}>معدل الاحتراق المتغير</label>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#60A5FA' }}>{s2.burnRate}%</span>
                  </div>
                  <input type="range" min="5" max="90" value={s2.burnRate}
                    onChange={e => setS2(p => ({ ...p, burnRate: e.target.value }))}
                    style={{ width: '100%', accentColor: '#2563EB' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#334155', marginTop: '4px' }}>
                    <span>5% منخفض</span><span>90% حرج</span>
                  </div>
                </div>

                {/* Live preview */}
                {s2.currentCash && s2.monthlyRevenue && s2.operationalExpenses && (
                  <div style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: '10px', padding: '12px 16px' }}>
                    <p style={{ fontSize: '11px', color: '#60A5FA', fontWeight: 600, marginBottom: '6px' }}>معاينة سريعة</p>
                    <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.7 }}>
                      الصافي الشهري المتوقع:{' '}
                      <strong style={{ color: (() => {
                        const exp = parseFloat(s2.operationalExpenses) + parseFloat(s2.monthlyRevenue) * (parseFloat(s2.burnRate)/100);
                        return (parseFloat(s2.monthlyRevenue) * 0.75) - exp > 0 ? '#10B981' : '#EF4444';
                      })() }}>
                        {(() => {
                          const rev = parseFloat(s2.monthlyRevenue) * 0.75;
                          const exp = parseFloat(s2.operationalExpenses) + parseFloat(s2.monthlyRevenue) * (parseFloat(s2.burnRate)/100);
                          return (rev - exp).toFixed(2);
                        })()} M ر.س
                      </strong>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3 — Risk factors */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', animation: 'slideIn 0.3s ease' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.3px' }}>عوامل الخطر</h2>
                  <p style={{ fontSize: '13px', color: '#475569', marginTop: '6px' }}>تساعد بصيرة على تحديد المحركات الأساسية لمخاطر السيولة</p>
                </div>

                {[
                  {
                    label: 'مؤشر ضغط الرواتب', key: 'salaryTrend', val: s3.salaryTrend,
                    hint: 'هل ترتفع تكاليف الرواتب بشكل ملحوظ؟',
                    fn: riskLabel,
                  },
                  {
                    label: 'متوسط تأخر التحصيل (يوم)', key: 'collectionDelay', val: s3.collectionDelay,
                    hint: 'كم يوماً في المتوسط يتأخر عملاؤك في الدفع؟',
                    fn: delayLabel, max: 90, suffix: ' يوم',
                  },
                  {
                    label: 'مستوى تكدس المخزون', key: 'inventoryStagnation', val: s3.inventoryStagnation,
                    hint: 'هل يوجد مخزون راكد يضغط على السيولة؟',
                    fn: riskLabel,
                  },
                ].map(f => {
                  const lbl = f.fn(f.val);
                  return (
                    <div key={f.key} style={fieldStyle}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                        <label style={{ ...labelStyle, marginBottom: 0 }}>{f.label}</label>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: lbl.c, background: lbl.c + '18', padding: '2px 10px', borderRadius: '5px' }}>
                          {f.suffix ? f.val + f.suffix : lbl.t}
                        </span>
                      </div>
                      <p style={{ fontSize: '11px', color: '#334155', marginBottom: '8px' }}>{f.hint}</p>
                      <input type="range" min="0" max={f.max ?? 100} value={f.val}
                        onChange={e => setS3(p => ({ ...p, [f.key]: parseInt(e.target.value) }))}
                        style={{ width: '100%', accentColor: lbl.c }}
                      />
                      <div style={{ height: '3px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', marginTop: '4px' }}>
                        <div style={{ height: '100%', width: `${f.max ? (f.val/f.max)*100 : f.val}%`, background: lbl.c, borderRadius: '999px', transition: 'width 0.2s, background 0.3s' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

          {/* Actions */}
          <div style={{ padding: '0 28px 26px', display: 'flex', gap: '10px' }}>
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '11px', padding: '13px 20px', color: '#64748B', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                <ArrowRight size={14} /> السابق
              </button>
            )}
            <button
              onClick={step < 2 ? () => setStep(s => s + 1) : finish}
              disabled={!canNext || saving}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                background: !canNext ? 'rgba(255,255,255,0.05)' : step === 2 ? '#10B981' : '#2563EB',
                border: 'none', borderRadius: '11px', padding: '13px',
                color: !canNext ? '#334155' : 'white', fontSize: '14px', fontWeight: 700,
                cursor: !canNext ? 'not-allowed' : 'pointer',
                boxShadow: canNext ? `0 2px 14px ${step === 2 ? 'rgba(16,185,129,0.35)' : 'rgba(37,99,235,0.35)'}` : 'none',
                transition: 'all 0.2s',
              }}
            >
              {saving ? (
                <><div style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> جاري الحفظ...</>
              ) : step === 2 ? (
                <><CheckCircle2 size={15} /> ابدأ التحليل</>
              ) : (
                <>التالي <ArrowLeft size={14} /></>
              )}
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '11px', color: '#1E293B', marginTop: '16px' }}>
          بياناتك محفوظة على جهازك فقط · لا ترسل لأي خادم
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes slideIn { from{opacity:0;transform:translateX(12px)} to{opacity:1;transform:translateX(0)} }
        @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        select option { background: #1E293B; color: #F8FAFC; }
      `}</style>
    </div>
  );
}
