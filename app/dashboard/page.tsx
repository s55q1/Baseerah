'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  ArrowLeft, BarChart3, Brain, CircleAlert, Clock3,
  Landmark, RefreshCw, Sparkles, TrendingDown, TrendingUp, Wallet, Zap,
} from 'lucide-react';
import {
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { SiteShell } from '@/components/site-shell';
import { AuthGuard } from '@/components/auth-guard';

/* ════════════════════════════════════════════════════
   LIQUIDITY PREDICTION ENGINE — logic unchanged
   ════════════════════════════════════════════════════ */
type LiquidityStatus = 'critical' | 'warning' | 'stable';

interface FinancialSnapshot {
  riskScore: number;
  cashMillions: number;
  runwayDays: number;
  daysToAlert: number;
  cashTrend: { month: string; cash: number; runway: number }[];
  riskDrivers: { label: string; value: number; color: string }[];
  lastSynced: string;
}

function computeLiquidityStatus(snapshot: FinancialSnapshot): LiquidityStatus {
  const { riskScore, runwayDays, cashTrend } = snapshot;
  const declining = cashTrend[cashTrend.length - 1].cash < cashTrend[0].cash;
  if (riskScore >= 75 || runwayDays < 30) return 'critical';
  if (riskScore >= 50 || declining) return 'warning';
  return 'stable';
}

/* ════════════════════════════════════════════════════
   ACTIONABLE INSIGHTS — logic unchanged
   ════════════════════════════════════════════════════ */
const insightsByStatus: Record<LiquidityStatus, { text: string; urgency: string; urgencyColor: string; urgencyBg: string }[]> = {
  critical: [
    { text: 'خفض المصروفات التشغيلية بنسبة 8% خلال 30 يوماً',       urgency: 'عاجل',      urgencyColor: '#B45309', urgencyBg: '#FFFBEB' },
    { text: 'تسريع تحصيل الفواتير وعرض خصم 2% للدفع المبكر',        urgency: 'مهم',       urgencyColor: '#0369A1', urgencyBg: '#F0F9FF' },
    { text: 'استكشاف خط تمويل رأس المال العامل قبل نفاد الرصيد',     urgency: 'استراتيجي', urgencyColor: '#6D28D9', urgencyBg: '#F5F3FF' },
  ],
  warning: [
    { text: 'مراجعة بنود الإنفاق وتأجيل المصروفات غير الضرورية 14 يوماً', urgency: 'مهم',       urgencyColor: '#0369A1', urgencyBg: '#F0F9FF' },
    { text: 'التفاوض مع الموردين على تمديد فترة السداد 30 يوماً',          urgency: 'مقترح',     urgencyColor: '#6D28D9', urgencyBg: '#F5F3FF' },
    { text: 'مراقبة مؤشر السيولة أسبوعياً وإعداد خطة طوارئ',              urgency: 'استراتيجي', urgencyColor: '#065F46', urgencyBg: '#ECFDF5' },
  ],
  stable: [
    { text: 'الوضع المالي مستقر — استمر في مراقبة التدفقات شهرياً',   urgency: 'مستقر',  urgencyColor: '#065F46', urgencyBg: '#ECFDF5' },
    { text: 'فرصة جيدة للنظر في استثمار الفائض النقدي',               urgency: 'فرصة',   urgencyColor: '#0369A1', urgencyBg: '#F0F9FF' },
    { text: 'قم بمراجعة شروط التمويل الحالية للحصول على معدلات أفضل', urgency: 'مقترح',  urgencyColor: '#6D28D9', urgencyBg: '#F5F3FF' },
  ],
};

/* Enterprise-refined status palette — soft, authoritative */
const statusConfig: Record<LiquidityStatus, { label: string; color: string; bg: string; border: string; dot: string }> = {
  critical: { label: 'حرج',   color: '#92400E', bg: 'rgba(217,119,6,0.08)',  border: 'rgba(217,119,6,0.25)',  dot: '#D97706' },
  warning:  { label: 'تحذير', color: '#1E40AF', bg: 'rgba(37,99,235,0.07)',  border: 'rgba(37,99,235,0.22)',  dot: '#3B82F6' },
  stable:   { label: 'مستقر', color: '#065F46', bg: 'rgba(16,185,129,0.07)', border: 'rgba(16,185,129,0.22)', dot: '#10B981' },
};

/* ════════════════════════════════════════════════════
   DATA SNAPSHOTS — unchanged
   ════════════════════════════════════════════════════ */
const INITIAL_DATA: FinancialSnapshot = {
  riskScore: 84, cashMillions: 8.2, runwayDays: 92, daysToAlert: 18,
  lastSynced: 'منذ 24 ساعة',
  cashTrend: [
    { month: 'أبريل', cash: 120000, runway: 190 },
    { month: 'مايو',  cash: 132000, runway: 205 },
    { month: 'يونيو', cash: 118000, runway: 180 },
    { month: 'يوليو', cash: 96000,  runway: 145 },
    { month: 'أغسطس', cash: 87000,  runway: 112 },
    { month: 'سبتمبر',cash: 76000,  runway: 92  },
  ],
  riskDrivers: [
    { label: 'ارتفاع الرواتب', value: 72, color: '#D97706, #B45309' },
    { label: 'تأخر التحصيل',   value: 54, color: '#3B82F6, #2563EB' },
    { label: 'تكدس المخزون',   value: 41, color: '#8B5CF6, #7C3AED' },
  ],
};

const SYNCED_DATA: FinancialSnapshot = {
  riskScore: 61, cashMillions: 9.5, runwayDays: 118, daysToAlert: 32,
  lastSynced: 'الآن',
  cashTrend: [
    { month: 'أبريل', cash: 130000, runway: 200 },
    { month: 'مايو',  cash: 145000, runway: 220 },
    { month: 'يونيو', cash: 138000, runway: 210 },
    { month: 'يوليو', cash: 125000, runway: 190 },
    { month: 'أغسطس', cash: 118000, runway: 175 },
    { month: 'سبتمبر',cash: 110000, runway: 160 },
  ],
  riskDrivers: [
    { label: 'ارتفاع الرواتب', value: 55, color: '#3B82F6, #2563EB' },
    { label: 'تأخر التحصيل',   value: 38, color: '#8B5CF6, #7C3AED' },
    { label: 'تكدس المخزون',   value: 29, color: '#10B981, #059669' },
  ],
};

/* ── Count-up hook — unchanged ── */
function useCountUp(target: number, duration = 1400, delay = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    setValue(0);
    const timeout = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);
  return value;
}

/* ── Risk Gauge — enterprise colors ── */
function RiskGauge({ score }: { score: number }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    setDisplayed(0);
    const id = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / 1400, 1);
        setDisplayed(Math.round(score * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, 300);
    return () => clearTimeout(id);
  }, [score]);

  const r = 50, circ = 2 * Math.PI * r;
  const dash = (displayed / 100) * circ;
  /* Soft amber for critical, blue for warning, emerald for stable */
  const color = score >= 75 ? '#D97706' : score >= 50 ? '#3B82F6' : '#10B981';

  return (
    <svg width="130" height="130" viewBox="0 0 130 130" style={{ display: 'block', margin: '0 auto' }}>
      {/* Track */}
      <circle cx="65" cy="65" r={r} fill="none" stroke="#F1F5F9" strokeWidth="8" />
      {/* Fill */}
      <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 65 65)"
        style={{ transition: 'stroke-dasharray 0.05s linear', filter: `drop-shadow(0 0 6px ${color}55)` }}
      />
      <text x="65" y="58" textAnchor="middle" fill="#0F172A" fontSize="30" fontWeight="700" fontFamily="Inter, system-ui, sans-serif">{displayed}</text>
      <text x="65" y="76" textAnchor="middle" fill="#94A3B8" fontSize="11" fontFamily="Inter, system-ui, sans-serif">/100</text>
    </svg>
  );
}

/* ── Animated Bar — thinner, enterprise ── */
function AnimatedBar({ value, color, delay }: { value: number; color: string; delay: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    setWidth(0);
    const t = setTimeout(() => setWidth(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return (
    <div style={{ height: '4px', borderRadius: '999px', background: '#F1F5F9', overflow: 'hidden' }}>
      <div style={{
        height: '100%', borderRadius: '999px',
        background: `linear-gradient(90deg, ${color})`,
        width: `${width}%`,
        transition: 'width 1.4s cubic-bezier(0.16,1,0.3,1)',
      }} />
    </div>
  );
}

/* ── Live Ticker — refined dark bar ── */
const liveInsights = [
  'ارتفاع في فواتير الموردين بنسبة 14% هذا الأسبوع',
  'الرواتب ستستهلك 43% من السيولة في الدورة القادمة',
  '3 فواتير متأخرة تجاوزت 30 يوم — يُنصح بالمتابعة الفورية',
  'مؤشر السيولة انخفض 6 نقاط منذ الأسبوع الماضي',
  'التمويل عبر الفواتير متاح بمعدل 2.1% — الأقل تكلفةً حالياً',
];

function LiveTicker({ onSync, syncing, lastSynced }: { onSync: () => void; syncing: boolean; lastSynced: string }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const iv = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIndex((i) => (i + 1) % liveInsights.length); setVisible(true); }, 350);
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{
      background: '#0F172A', borderRadius: '12px', padding: '11px 20px',
      display: 'flex', alignItems: 'center', gap: '14px',
      border: '1px solid rgba(255,255,255,0.06)',
    }}>
      {/* LIVE badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexShrink: 0 }}>
        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981', animation: 'pulse 2s infinite' }} />
        <span style={{ color: '#6EE7B7', fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px' }}>LIVE</span>
      </div>
      {/* Separator */}
      <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
      {/* Insight */}
      <span style={{
        color: '#94A3B8', fontSize: '12.5px', flex: 1,
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(4px)',
        transition: 'opacity 0.35s, transform 0.35s',
      }}>
        {liveInsights[index]}
      </span>
      {/* Sync button */}
      <button onClick={onSync} disabled={syncing} style={{
        flexShrink: 0, display: 'flex', alignItems: 'center', gap: '6px',
        background: 'transparent', border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: '8px', padding: '5px 13px',
        color: syncing ? '#475569' : '#CBD5E1', fontSize: '12px', fontWeight: 500,
        cursor: syncing ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
      }}>
        <RefreshCw size={11} style={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
        {syncing ? 'مزامنة...' : `مزامنة · ${lastSynced}`}
      </button>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const [data, setData] = useState<FinancialSnapshot>(INITIAL_DATA);
  const [syncing, setSyncing] = useState(false);
  const [syncCount, setSyncCount] = useState(0);

  const status = computeLiquidityStatus(data);
  const statusCfg = statusConfig[status];
  const activeRecommendations = insightsByStatus[status];

  const cashAnim   = useCountUp(Math.round(data.cashMillions * 10), 1600, 200);
  const riskAnim   = useCountUp(data.riskScore, 1400, 300);
  const daysAnim   = useCountUp(data.daysToAlert, 1200, 100);
  const runwayAnim = useCountUp(data.runwayDays, 1400, 400);

  const handleSync = useCallback(async () => {
    if (syncing) return;
    setSyncing(true);
    await new Promise((r) => setTimeout(r, 2200));
    setData((prev) => (prev.riskScore > 70 ? SYNCED_DATA : INITIAL_DATA));
    setSyncCount((c) => c + 1);
    setSyncing(false);
  }, [syncing]);

  /* ── Design tokens ── */
  const card = {
    borderRadius: '14px', background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.05)',
    padding: '22px',
  };

  return (
    <AuthGuard>
      <SiteShell>
        <main style={{ minHeight: '100vh', background: '#EEF2F7', padding: '28px 20px', fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif" }} dir="rtl">
          <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {/* ── LIVE ticker ── */}
            <LiveTicker onSync={handleSync} syncing={syncing} lastSynced={data.lastSynced} />

            {/* ── Status notification ── */}
            {syncCount > 0 && (
              <div style={{
                ...card, padding: '13px 18px',
                display: 'flex', alignItems: 'center', gap: '10px',
                borderRight: `3px solid ${statusCfg.dot}`,
                animation: 'slideDown 0.35s ease',
              }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: statusCfg.dot, flexShrink: 0 }} />
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#334155' }}>
                  {status === 'warning'
                    ? 'تم تحديث البيانات — الوضع تحسّن إلى مستوى تحذير. راجع التوصيات الجديدة.'
                    : 'البيانات الأصلية — الوضع حرج. اتخذ إجراءً فورياً.'}
                </span>
              </div>
            )}

            {/* ── Hero header — Midnight Navy ── */}
            <header style={{
              position: 'relative', overflow: 'hidden', borderRadius: '16px',
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              padding: '36px 40px', color: 'white',
              boxShadow: '0 4px 32px rgba(15,23,42,0.28)',
              border: '1px solid rgba(255,255,255,0.04)',
            }}>
              {/* Subtle ambient glow — one only, low opacity */}
              <div style={{ position: 'absolute', top: '-120px', right: '-60px', width: '360px', height: '360px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.12), transparent 70%)', pointerEvents: 'none' }} />

              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', gap: '32px', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                  {/* Pills */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', borderRadius: '6px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)', padding: '4px 12px', color: '#94A3B8', fontSize: '11px', fontWeight: 500, letterSpacing: '0.3px' }}>
                      <Brain size={10} /> AI · يتجدد كل 24 ساعة
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', borderRadius: '6px', background: statusCfg.bg, border: `1px solid ${statusCfg.border}`, padding: '4px 12px', color: statusCfg.color, fontSize: '11px', fontWeight: 600 }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: statusCfg.dot, display: 'inline-block', animation: status !== 'stable' ? 'pulse 2s infinite' : 'none' }} />
                      حالة السيولة: {statusCfg.label}
                    </span>
                  </div>

                  <h1 style={{ fontSize: '32px', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.5px', color: '#F8FAFC' }}>
                    رؤية أزمة السيولة<br />
                    <span style={{ color: '#60A5FA', fontWeight: 800 }}>قبل {daysAnim} يوماً من وقوعها</span>
                  </h1>
                  <p style={{ color: '#64748B', fontSize: '14px', marginTop: '14px', maxWidth: '460px', lineHeight: 1.75 }}>
                    راقب حالة النقد، افهم ما يضغط على ميزانيتك، واحصل على إجراءات واضحة قبل أن تتفاقم.
                  </p>
                </div>

                {/* Alert card — glassmorphism */}
                <div style={{
                  borderRadius: '12px', padding: '22px 28px', textAlign: 'center', minWidth: '156px',
                  background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)',
                  border: `1px solid ${statusCfg.border}`,
                  boxShadow: `inset 0 0 24px ${statusCfg.dot}10`,
                }}>
                  <p style={{ color: statusCfg.color, fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusCfg.dot, display: 'inline-block', animation: status !== 'stable' ? 'pulse 1.8s infinite' : 'none' }} />
                    {statusCfg.label === 'حرج' ? 'تنبيه حرج' : statusCfg.label === 'تحذير' ? 'تحذير مبكر' : 'وضع مستقر'}
                  </p>
                  <p style={{ fontSize: '56px', fontWeight: 800, color: '#F8FAFC', lineHeight: 1, letterSpacing: '-2px' }}>{daysAnim}</p>
                  <p style={{ color: '#64748B', fontSize: '12px', marginTop: '6px' }}>يوم حتى الأزمة</p>
                  <div style={{ marginTop: '14px', height: '3px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)' }}>
                    <div style={{ height: '100%', width: `${Math.min(data.daysToAlert / 60 * 100, 100)}%`, borderRadius: '999px', background: statusCfg.dot, transition: 'width 1.2s ease' }} />
                  </div>
                </div>
              </div>
            </header>

            {/* ── KPI cards ── */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              {[
                {
                  title: 'التدفق النقدي', value: `${(cashAnim / 10).toFixed(1)}`, unit: 'مليون ر.س',
                  badge: '+12.4%', badgeColor: '#065F46', badgeBg: '#ECFDF5',
                  accent: '#2563EB', icon: <Wallet size={16} />, iconBg: '#EFF6FF', iconColor: '#2563EB',
                },
                {
                  title: 'درجة المخاطر AI', value: `${riskAnim}`, unit: '/ 100',
                  badge: statusCfg.label, badgeColor: statusCfg.color, badgeBg: statusCfg.bg,
                  accent: statusCfg.dot, icon: <CircleAlert size={16} />, iconBg: statusCfg.bg, iconColor: statusCfg.color,
                },
                {
                  title: 'تاريخ الأزمة', value: '20 يوليو', unit: `بعد ${daysAnim} يوم`,
                  badge: status === 'stable' ? 'آمن' : 'قريب',
                  badgeColor: status === 'stable' ? '#065F46' : '#92400E',
                  badgeBg: status === 'stable' ? '#ECFDF5' : '#FFFBEB',
                  accent: '#D97706', icon: <Clock3 size={16} />, iconBg: '#FFFBEB', iconColor: '#D97706',
                },
                {
                  title: 'فترة التشغيل', value: `${runwayAnim}`, unit: 'يوم',
                  badge: 'مستقر', badgeColor: '#065F46', badgeBg: '#ECFDF5',
                  accent: '#10B981', icon: <BarChart3 size={16} />, iconBg: '#ECFDF5', iconColor: '#10B981',
                },
              ].map((item) => (
                <div key={item.title} style={{
                  ...card,
                  borderTop: `2px solid ${item.accent}`,
                  transition: 'box-shadow 0.2s',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <p style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.6px' }}>{item.title}</p>
                    <div style={{ background: item.iconBg, color: item.iconColor, borderRadius: '8px', padding: '7px' }}>{item.icon}</div>
                  </div>
                  <p style={{ fontSize: '28px', fontWeight: 700, color: '#0F172A', marginTop: '10px', letterSpacing: '-0.8px', lineHeight: 1 }}>{item.value}</p>
                  <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '3px' }}>{item.unit}</p>
                  <div style={{ marginTop: '14px' }}>
                    <span style={{ background: item.badgeBg, color: item.badgeColor, fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '5px' }}>{item.badge}</span>
                  </div>
                </div>
              ))}
            </section>

            {/* ── Chart + Risk Gauge ── */}
            <section style={{ display: 'grid', gridTemplateColumns: '1.65fr 1fr', gap: '14px' }}>

              {/* Chart — sleek, no gridlines */}
              <div style={card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
                  <div>
                    <p style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>توقعات مستقبلية</p>
                    <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginTop: '3px' }}>اتجاه الرصيد النقدي · 6 أشهر</h2>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#EFF6FF', borderRadius: '6px', padding: '4px 11px', fontSize: '11px', color: '#2563EB', fontWeight: 600 }}>
                    <Zap size={10} /> مباشر
                  </span>
                </div>
                <div style={{ height: '210px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.cashTrend} key={syncCount} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="eliteGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%"   stopColor="#2563EB" stopOpacity={0.18} />
                          <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      {/* No CartesianGrid — cleaner enterprise look */}
                      <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'Inter, system-ui' }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'Inter, system-ui' }} width={55} />
                      <Tooltip
                        contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontFamily: 'Inter, system-ui' }}
                        cursor={{ stroke: '#E2E8F0', strokeWidth: 1 }}
                      />
                      <Area type="monotone" dataKey="cash" stroke="#2563EB" strokeWidth={1.8} fill="url(#eliteGrad)" dot={false} animationDuration={1600} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* AI Risk Score */}
              <div style={card}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '2px' }}>
                  <Sparkles size={14} color="#2563EB" />
                  <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>AI Risk Score</h2>
                </div>
                <p style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '18px' }}>مؤشر المخاطر بالذكاء الاصطناعي</p>
                <RiskGauge score={data.riskScore} key={`gauge-${syncCount}`} />
                <div style={{ marginTop: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {data.riskDrivers.map((d, i) => (
                    <div key={d.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 500, color: '#475569' }}>{d.label}</span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>{d.value}%</span>
                      </div>
                      <AnimatedBar key={`bar-${syncCount}-${i}`} value={d.value} color={d.color} delay={500 + i * 150} />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── Recommendations + Finance ── */}
            <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>

              {/* Smart Recommendations */}
              <div style={card}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <TrendingDown size={14} color="#D97706" />
                    <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>الإجراءات المقترحة</h2>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '5px', background: statusCfg.bg, color: statusCfg.color, border: `1px solid ${statusCfg.border}` }}>
                    {statusCfg.label}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {activeRecommendations.map((item, i) => (
                    <div key={`${syncCount}-${i}`} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '11px',
                      borderRadius: '10px', border: '1px solid #F1F5F9', background: '#FAFAFA',
                      padding: '13px', animation: 'slideDown 0.3s ease both',
                      animationDelay: `${i * 60}ms`,
                    }}>
                      <div style={{ flexShrink: 0, width: '22px', height: '22px', borderRadius: '6px', background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '11px', fontWeight: 700 }}>{i + 1}</div>
                      <p style={{ flex: 1, fontSize: '13px', color: '#334155', lineHeight: 1.65 }}>{item.text}</p>
                      <span style={{ flexShrink: 0, background: item.urgencyBg, color: item.urgencyColor, fontSize: '10px', fontWeight: 600, padding: '3px 9px', borderRadius: '5px', whiteSpace: 'nowrap' }}>{item.urgency}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Finance Options */}
              <div style={card}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '18px' }}>
                  <Landmark size={14} color="#2563EB" />
                  <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>خيارات التمويل</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { name: 'خط رأس المال العامل', term: '12 أسبوعاً', rate: '8.9%',  recommended: true  },
                    { name: 'قرض قصير الأجل',      term: '6 أشهر',    rate: '11.2%', recommended: false },
                    { name: 'تمويل الفواتير',       term: '3 أيام',    rate: '2.1%',  recommended: false },
                  ].map((opt) => (
                    <div key={opt.name} style={{
                      borderRadius: '10px', padding: '13px',
                      border: opt.recommended ? '1px solid #BFDBFE' : '1px solid #F1F5F9',
                      background: opt.recommended ? '#F0F7FF' : '#FAFAFA',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                          <p style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{opt.name}</p>
                          {opt.recommended && <span style={{ background: '#1E40AF', color: 'white', fontSize: '9px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px', letterSpacing: '0.3px' }}>الأفضل</span>}
                        </div>
                        <span style={{ fontSize: '11px', color: '#64748B', background: 'white', border: '1px solid #E2E8F0', borderRadius: '5px', padding: '2px 9px' }}>{opt.term}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                        <span style={{ fontSize: '11px', color: '#94A3B8' }}>معدل الفائدة</span>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#1E40AF' }}>{opt.rate}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Electric Blue CTA */}
                <button style={{
                  marginTop: '14px', width: '100%', borderRadius: '10px',
                  background: '#2563EB', padding: '12px',
                  fontSize: '13px', fontWeight: 600, color: 'white',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                  boxShadow: '0 2px 12px rgba(37,99,235,0.30)',
                  transition: 'background 0.2s',
                }}>
                  <TrendingUp size={13} /> طلب تمويل الآن <ArrowLeft size={12} />
                </button>
              </div>
            </section>

          </div>
        </main>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          @keyframes pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.45;transform:scale(0.8)} }
          @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
          @keyframes slideDown { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        `}</style>
      </SiteShell>
    </AuthGuard>
  );
}
