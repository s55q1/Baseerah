'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft, BarChart3, Brain, CircleAlert, Clock3,
  Landmark, RefreshCw, Settings2, Sparkles, TrendingDown, TrendingUp, Wallet, Zap,
} from 'lucide-react';
import {
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { SiteShell } from '@/components/site-shell';
import { AuthGuard } from '@/components/auth-guard';
import { Onboarding } from '@/components/onboarding';

/* ════════════════════════════════════════════════════════════════
   FINANCIAL ENGINE — LAYER 1: Input Model
   ════════════════════════════════════════════════════════════════ */

interface FinancialInputs {
  currentCash: number;          // SAR millions
  monthlyRevenue: number;       // SAR millions
  burnRate: number;             // % of revenue consumed by variable costs
  operationalExpenses: number;  // SAR millions/month (fixed)
  salaryTrend: number;          // risk factor 0–100
  collectionDelay: number;      // days 0–90
  inventoryStagnation: number;  // risk factor 0–100
}

/* Scenario presets for live demo */
const CRISIS_INPUTS: FinancialInputs = {
  currentCash: 8.2, monthlyRevenue: 3.5, burnRate: 45, operationalExpenses: 2.8,
  salaryTrend: 78, collectionDelay: 52, inventoryStagnation: 65,
};
const HEALTHY_INPUTS: FinancialInputs = {
  currentCash: 18.5, monthlyRevenue: 6.2, burnRate: 22, operationalExpenses: 1.9,
  salaryTrend: 18, collectionDelay: 12, inventoryStagnation: 14,
};

/* ════════════════════════════════════════════════════════════════
   FINANCIAL ENGINE — LAYER 2: Compute Functions
   ════════════════════════════════════════════════════════════════ */

/** Weighted AI Risk Score (3 drivers) */
function computeRiskScore(inp: FinancialInputs): number {
  const salary     = inp.salaryTrend * 0.40;
  const collection = Math.min((inp.collectionDelay / 60) * 100, 100) * 0.35;
  const inventory  = inp.inventoryStagnation * 0.25;
  return Math.min(100, Math.round(salary + collection + inventory));
}

/** 6-month cash trajectory with compounding outflow pressure */
function computeForecast(inp: FinancialInputs): { month: string; cash: number; runway: number }[] {
  const MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];
  const fixedCosts    = inp.operationalExpenses;
  const variableCosts = inp.monthlyRevenue * (inp.burnRate / 100);
  const totalExpenses = fixedCosts + variableCosts;
  const collEff       = Math.max(0, 1 - inp.collectionDelay / 90);
  const inflow        = inp.monthlyRevenue * collEff;
  const netMonthly    = inflow - totalExpenses;

  let cash = inp.currentCash;
  return MONTHS.map((month, i) => {
    /* Compounding: each delayed month amplifies cost pressure slightly */
    const compound = 1 + i * 0.015;
    cash = Math.max(0, cash + netMonthly / compound);
    const runway = netMonthly < 0
      ? Math.max(0, Math.round((cash / Math.abs(netMonthly)) * 30))
      : 365;
    return { month, cash: Math.round(cash * 10000), runway };
  });
}

/** Days of cash remaining at current burn */
function computeRunwayDays(inp: FinancialInputs): number {
  const totalExpenses = inp.operationalExpenses + inp.monthlyRevenue * (inp.burnRate / 100);
  const collEff       = Math.max(0, 1 - inp.collectionDelay / 90);
  const inflow        = inp.monthlyRevenue * collEff;
  const netMonthly    = inflow - totalExpenses;
  if (netMonthly >= 0) return 365;
  return Math.max(0, Math.round((inp.currentCash / Math.abs(netMonthly)) * 30));
}

/** Warning threshold: ~65% of runway */
function computeDaysToAlert(inp: FinancialInputs): number {
  return Math.max(0, Math.round(computeRunwayDays(inp) * 0.65));
}

type GapSeverity = 'critical' | 'minor' | 'stable';

/** Liquidity gap = (expenses − inflow) / expenses */
function computeGapSeverity(inp: FinancialInputs): GapSeverity {
  const totalExpenses = inp.operationalExpenses + inp.monthlyRevenue * (inp.burnRate / 100);
  const collEff       = Math.max(0, 1 - inp.collectionDelay / 90);
  const inflow        = inp.monthlyRevenue * collEff;
  const gap           = totalExpenses > 0 ? (totalExpenses - inflow) / totalExpenses : 0;
  if (gap > 0.40) return 'critical';
  if (gap > 0.10) return 'minor';
  return 'stable';
}

/* ════════════════════════════════════════════════════════════════
   FINANCIAL ENGINE — LAYER 3: Snapshot (drives the UI)
   ════════════════════════════════════════════════════════════════ */

type LiquidityStatus = 'critical' | 'warning' | 'stable';

interface FinancialSnapshot {
  riskScore: number;
  cashMillions: number;
  runwayDays: number;
  daysToAlert: number;
  gapSeverity: GapSeverity;
  cashTrend: { month: string; cash: number; runway: number }[];
  riskDrivers: { label: string; value: number; color: string }[];
  lastSynced: string;
}

function deriveSnapshot(inp: FinancialInputs, syncLabel = 'الآن'): FinancialSnapshot {
  const riskScore = computeRiskScore(inp);
  const colRisk   = Math.min(Math.round((inp.collectionDelay / 60) * 100), 100);
  return {
    riskScore,
    cashMillions:  inp.currentCash,
    runwayDays:    computeRunwayDays(inp),
    daysToAlert:   computeDaysToAlert(inp),
    gapSeverity:   computeGapSeverity(inp),
    cashTrend:     computeForecast(inp),
    riskDrivers: [
      { label: 'ارتفاع الرواتب', value: inp.salaryTrend,         color: inp.salaryTrend > 60        ? '#D97706, #B45309' : '#3B82F6, #2563EB' },
      { label: 'تأخر التحصيل',   value: colRisk,                 color: '#8B5CF6, #7C3AED' },
      { label: 'تكدس المخزون',   value: inp.inventoryStagnation, color: inp.inventoryStagnation > 50 ? '#EF4444, #DC2626' : '#10B981, #059669' },
    ],
    lastSynced: syncLabel,
  };
}

/** Map risk score to liquidity status */
function computeLiquidityStatus(snap: FinancialSnapshot): LiquidityStatus {
  if (snap.riskScore >= 75 || snap.runwayDays < 30) return 'critical';
  if (snap.riskScore >= 50) return 'warning';
  return 'stable';
}

/* ════════════════════════════════════════════════════════════════
   LAYER 4: Dynamic Recommendation Engine
   Triggers specific actions based on gap severity
   ════════════════════════════════════════════════════════════════ */

interface Recommendation {
  text: string; urgency: string; urgencyColor: string; urgencyBg: string;
}

const RECOMMENDATIONS: Record<GapSeverity, Recommendation[]> = {
  critical: [
    { text: 'خفض التكاليف التشغيلية فوراً بنسبة 15-20% — الفجوة المالية تتجاوز 40% من الإيرادات',
      urgency: 'فوري', urgencyColor: '#991B1B', urgencyBg: '#FEF2F2' },
    { text: 'التقدم لخط تمويل طارئ عبر SAMA أو بنك الرياض — النافذة محدودة بـ 3 أسابيع',
      urgency: 'حرج', urgencyColor: '#92400E', urgencyBg: '#FFFBEB' },
    { text: 'تعليق الإنفاق غير الأساسي وإعادة توزيع الميزانية على العمليات الحيوية فقط',
      urgency: 'عاجل', urgencyColor: '#92400E', urgencyBg: '#FFFBEB' },
  ],
  minor: [
    { text: 'تمويل الفواتير: حوّل فواتيرك المعلّقة إلى سيولة فورية بمعدل 2.1% — الأسرع لسد الفجوة',
      urgency: 'مقترح', urgencyColor: '#0369A1', urgencyBg: '#F0F9FF' },
    { text: 'تفاوض مع الموردين لتمديد الدفع 30-45 يوماً — يحرر ما يقارب 1.2M ر.س شهرياً',
      urgency: 'مهم', urgencyColor: '#1E40AF', urgencyBg: '#EFF6FF' },
    { text: 'راجع بنود الإنفاق المتغير وأجّل غير الضروري — الفجوة قابلة للسد بدون تمويل',
      urgency: 'استراتيجي', urgencyColor: '#6D28D9', urgencyBg: '#F5F3FF' },
  ],
  stable: [
    { text: 'الوضع مستقر — استثمر الفائض النقدي في أدوات سوق المال قصيرة الأجل',
      urgency: 'فرصة', urgencyColor: '#065F46', urgencyBg: '#ECFDF5' },
    { text: 'راجع شروط التمويل الحالية — يمكن تخفيض الفائدة بما يصل 1.4% في السوق الحالي',
      urgency: 'مقترح', urgencyColor: '#0369A1', urgencyBg: '#F0F9FF' },
    { text: 'ضع خطة طوارئ بحد أدنى سيولة 3 أشهر — اجعل بصيرة تنبهك عند الاقتراب منه',
      urgency: 'استراتيجي', urgencyColor: '#6D28D9', urgencyBg: '#F5F3FF' },
  ],
};

/* ── Status palette ── */
const statusConfig: Record<LiquidityStatus, { label: string; color: string; bg: string; border: string; dot: string }> = {
  critical: { label: 'حرج',   color: '#92400E', bg: 'rgba(217,119,6,0.08)',  border: 'rgba(217,119,6,0.25)',  dot: '#D97706' },
  warning:  { label: 'تحذير', color: '#1E40AF', bg: 'rgba(37,99,235,0.07)',  border: 'rgba(37,99,235,0.22)',  dot: '#3B82F6' },
  stable:   { label: 'مستقر', color: '#065F46', bg: 'rgba(16,185,129,0.07)', border: 'rgba(16,185,129,0.22)', dot: '#10B981' },
};

/* ════════════════════════════════════════════════════════════════
   HOOKS & MICRO-COMPONENTS
   ════════════════════════════════════════════════════════════════ */

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

  const r = 50, circ = 2 * Math.PI * r, dash = (displayed / 100) * circ;
  const color = score >= 75 ? '#D97706' : score >= 50 ? '#3B82F6' : '#10B981';
  return (
    <svg width="130" height="130" viewBox="0 0 130 130" style={{ display: 'block', margin: '0 auto' }}>
      <circle cx="65" cy="65" r={r} fill="none" stroke="#F1F5F9" strokeWidth="8" />
      <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 65 65)"
        style={{ transition: 'stroke-dasharray 0.05s linear', filter: `drop-shadow(0 0 6px ${color}55)` }} />
      <text x="65" y="58" textAnchor="middle" fill="#0F172A" fontSize="30" fontWeight="700" fontFamily="Inter, system-ui">{displayed}</text>
      <text x="65" y="76" textAnchor="middle" fill="#94A3B8" fontSize="11" fontFamily="Inter, system-ui">/100</text>
    </svg>
  );
}

function AnimatedBar({ value, color, delay }: { value: number; color: string; delay: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    setWidth(0);
    const t = setTimeout(() => setWidth(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return (
    <div style={{ height: '4px', borderRadius: '999px', background: '#F1F5F9', overflow: 'hidden' }}>
      <div style={{ height: '100%', borderRadius: '999px', background: `linear-gradient(90deg, ${color})`, width: `${width}%`, transition: 'width 1.4s cubic-bezier(0.16,1,0.3,1)' }} />
    </div>
  );
}

const liveInsights = [
  'ارتفاع في فواتير الموردين بنسبة 14% هذا الأسبوع',
  'الرواتب ستستهلك 43% من السيولة في الدورة القادمة',
  '3 فواتير متأخرة تجاوزت 30 يوماً — يُنصح بالمتابعة الفورية',
  'مؤشر السيولة انخفض 6 نقاط منذ الأسبوع الماضي',
  'تمويل الفواتير متاح بمعدل 2.1% — الأقل تكلفةً حالياً',
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
    <div style={{ background: '#0F172A', borderRadius: '12px', padding: '11px 20px', display: 'flex', alignItems: 'center', gap: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexShrink: 0 }}>
        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981', animation: 'pulse 2s infinite' }} />
        <span style={{ color: '#6EE7B7', fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px' }}>LIVE</span>
      </div>
      <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
      <span style={{ color: '#94A3B8', fontSize: '12.5px', flex: 1, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(4px)', transition: 'opacity 0.35s, transform 0.35s' }}>
        {liveInsights[index]}
      </span>
      <button onClick={onSync} disabled={syncing} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '8px', padding: '5px 13px', color: syncing ? '#475569' : '#CBD5E1', fontSize: '12px', fontWeight: 500, cursor: syncing ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
        <RefreshCw size={11} style={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
        {syncing ? 'مزامنة...' : `مزامنة · ${lastSynced}`}
      </button>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   DEBUG PANEL — hidden demo control centre
   Toggle: Shift+D  or  the ⚙ icon (bottom-left)
   ════════════════════════════════════════════════════════════════ */

interface DebugPanelProps {
  inputs: FinancialInputs;
  onChange: (next: FinancialInputs) => void;
  onClose: () => void;
}

function DebugPanel({ inputs, onChange, onClose }: DebugPanelProps) {
  const set = (key: keyof FinancialInputs, val: number) =>
    onChange({ ...inputs, [key]: val });

  const SliderRow = ({
    label, field, min, max, step = 1, unit = '',
  }: { label: string; field: keyof FinancialInputs; min: number; max: number; step?: number; unit?: string }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', color: '#94A3B8' }}>{label}</span>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#F8FAFC' }}>
          {(inputs[field] as number).toFixed(step < 1 ? 1 : 0)}{unit}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={inputs[field] as number}
        onChange={(e) => set(field, parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: '#2563EB', height: '4px' }} />
    </div>
  );

  return (
    <div style={{
      position: 'fixed', bottom: '70px', left: '20px', zIndex: 9999, width: '310px',
      background: '#0F172A', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.10)',
      boxShadow: '0 24px 64px rgba(0,0,0,0.5)', overflow: 'hidden',
      animation: 'slideDown 0.25s ease',
    }}>
      {/* Header */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <Settings2 size={13} color="#2563EB" />
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#F8FAFC', letterSpacing: '0.3px' }}>لوحة التحكم التجريبي</span>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '18px', lineHeight: 1 }}>×</button>
      </div>

      {/* Scenario presets */}
      <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <p style={{ fontSize: '10px', color: '#475569', fontWeight: 600, letterSpacing: '1px', marginBottom: '10px' }}>السيناريوهات السريعة</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => onChange(CRISIS_INPUTS)} style={{ flex: 1, borderRadius: '8px', padding: '9px', border: '1px solid rgba(217,119,6,0.4)', background: 'rgba(217,119,6,0.10)', color: '#FCD34D', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
            🔴 أزمة
          </button>
          <button onClick={() => onChange(HEALTHY_INPUTS)} style={{ flex: 1, borderRadius: '8px', padding: '9px', border: '1px solid rgba(16,185,129,0.4)', background: 'rgba(16,185,129,0.10)', color: '#6EE7B7', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
            🟢 صحي
          </button>
        </div>
      </div>

      {/* Sliders */}
      <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '380px', overflowY: 'auto' }}>
        <p style={{ fontSize: '10px', color: '#475569', fontWeight: 600, letterSpacing: '1px', margin: '0' }}>المدخلات المالية</p>
        <SliderRow label="الرصيد النقدي (مليون ر.س)"     field="currentCash"         min={1}   max={50}  step={0.1} unit=" M" />
        <SliderRow label="الإيراد الشهري (مليون ر.س)"    field="monthlyRevenue"      min={0.5} max={20}  step={0.1} unit=" M" />
        <SliderRow label="معدل الاحتراق (%)"              field="burnRate"            min={5}   max={95}             unit="%" />
        <SliderRow label="المصروفات الثابتة (مليون ر.س)" field="operationalExpenses" min={0.2} max={15}  step={0.1} unit=" M" />
        <p style={{ fontSize: '10px', color: '#475569', fontWeight: 600, letterSpacing: '1px', margin: '4px 0 0' }}>عوامل الخطر</p>
        <SliderRow label="مؤشر ارتفاع الرواتب" field="salaryTrend"         min={0} max={100} unit="%" />
        <SliderRow label="تأخر التحصيل (يوم)"  field="collectionDelay"     min={0} max={90}  unit="d" />
        <SliderRow label="تكدس المخزون"         field="inventoryStagnation" min={0} max={100} unit="%" />
      </div>

      <div style={{ padding: '10px 18px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <p style={{ fontSize: '10px', color: '#334155', textAlign: 'center' }}>Shift+D لفتح/إغلاق اللوحة</p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const [inputs, setInputs]       = useState<FinancialInputs>(CRISIS_INPUTS);
  const [syncing, setSyncing]     = useState(false);
  const [syncCount, setSyncCount] = useState(0);
  const [debugOpen, setDebugOpen] = useState(false);
  const syncRef = useRef(0);

  /* Keyboard shortcut: Shift+D */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'D') setDebugOpen((v) => !v);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  /* Derive all computed state from inputs — instant reactivity */
  const data = useMemo(
    () => deriveSnapshot(inputs, syncing ? 'جاري...' : syncCount > 0 ? 'الآن' : 'منذ 24 ساعة'),
    [inputs, syncing, syncCount],
  );
  const status    = computeLiquidityStatus(data);
  const statusCfg = statusConfig[status];
  const recs      = RECOMMENDATIONS[data.gapSeverity];

  /* Sync: toggle between CRISIS ↔ HEALTHY presets */
  const handleSync = useCallback(async () => {
    if (syncing) return;
    setSyncing(true);
    await new Promise((r) => setTimeout(r, 2200));
    syncRef.current += 1;
    setInputs((prev) => (prev === CRISIS_INPUTS || prev.riskScore > 60 ? HEALTHY_INPUTS : CRISIS_INPUTS));
    setSyncCount((c) => c + 1);
    setSyncing(false);
  }, [syncing]);

  /* Count-up animations — re-trigger on input changes */
  const cashAnim   = useCountUp(Math.round(data.cashMillions * 10), 1600, 200);
  const daysAnim   = useCountUp(data.daysToAlert, 1200, 100);
  const runwayAnim = useCountUp(data.runwayDays,  1400, 400);

  const card = {
    borderRadius: '14px', background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.05)',
    padding: '22px',
  };

  return (
    <AuthGuard>
      <Onboarding />
      <SiteShell>
        <main style={{ minHeight: '100vh', background: '#EEF2F7', padding: '28px 20px', fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif" }} dir="rtl">
          <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {/* ── LIVE ticker ── */}
            <LiveTicker onSync={handleSync} syncing={syncing} lastSynced={data.lastSynced} />

            {/* ── Sync notification ── */}
            {syncCount > 0 && (
              <div style={{ ...card, padding: '13px 18px', display: 'flex', alignItems: 'center', gap: '10px', borderRight: `3px solid ${statusCfg.dot}`, animation: 'slideDown 0.35s ease' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: statusCfg.dot, flexShrink: 0 }} />
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#334155' }}>
                  {status === 'stable'
                    ? 'تحديث ناجح — الوضع المالي مستقر. محرك التنبؤ أعاد حساب جميع المؤشرات.'
                    : status === 'warning'
                    ? 'تحديث ناجح — الوضع في نطاق التحذير. راجع التوصيات الجديدة.'
                    : 'تحديث ناجح — الوضع حرج. محرك الخطر يوصي باتخاذ إجراء فوري.'}
                </span>
              </div>
            )}

            {/* ── Hero header — Midnight Navy ── */}
            <header style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', padding: '36px 40px', color: 'white', boxShadow: '0 4px 32px rgba(15,23,42,0.28)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ position: 'absolute', top: '-120px', right: '-60px', width: '360px', height: '360px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.12), transparent 70%)', pointerEvents: 'none' }} />

              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', gap: '32px', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', borderRadius: '6px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)', padding: '4px 12px', color: '#94A3B8', fontSize: '11px', fontWeight: 500 }}>
                      <Brain size={10} /> محرك تنبؤ ذكي · يُحدَّث لحظياً
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', borderRadius: '6px', background: statusCfg.bg, border: `1px solid ${statusCfg.border}`, padding: '4px 12px', color: statusCfg.color, fontSize: '11px', fontWeight: 600 }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: statusCfg.dot, display: 'inline-block', animation: status !== 'stable' ? 'pulse 2s infinite' : 'none' }} />
                      حالة السيولة: {statusCfg.label}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', padding: '4px 12px', color: '#CBD5E1', fontSize: '11px', fontWeight: 500 }}>
                      فجوة: {data.gapSeverity === 'critical' ? 'حرجة' : data.gapSeverity === 'minor' ? 'محدودة' : 'معدومة'}
                    </span>
                  </div>

                  <h1 style={{ fontSize: '32px', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.5px', color: '#F8FAFC' }}>
                    رؤية أزمة السيولة<br />
                    <span style={{ color: '#60A5FA', fontWeight: 800 }}>قبل {daysAnim} يوماً من وقوعها</span>
                  </h1>
                  <p style={{ color: '#64748B', fontSize: '14px', marginTop: '14px', maxWidth: '460px', lineHeight: 1.75 }}>
                    محرك التنبؤ يحسب المسار المالي لحظياً بناءً على معدل الاحتراق، تأخر التحصيل، وضغط الرواتب.
                  </p>
                </div>

                {/* Alert card */}
                <div style={{ borderRadius: '12px', padding: '22px 28px', textAlign: 'center', minWidth: '156px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', border: `1px solid ${statusCfg.border}`, boxShadow: `inset 0 0 24px ${statusCfg.dot}10` }}>
                  <p style={{ color: statusCfg.color, fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusCfg.dot, display: 'inline-block', animation: status !== 'stable' ? 'pulse 1.8s infinite' : 'none' }} />
                    {status === 'critical' ? 'تنبيه حرج' : status === 'warning' ? 'تحذير مبكر' : 'وضع مستقر'}
                  </p>
                  <p style={{ fontSize: '56px', fontWeight: 800, color: '#F8FAFC', lineHeight: 1, letterSpacing: '-2px' }}>{daysAnim}</p>
                  <p style={{ color: '#64748B', fontSize: '12px', marginTop: '6px' }}>يوم حتى الأزمة</p>
                  <div style={{ marginTop: '14px', height: '3px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)' }}>
                    <div style={{ height: '100%', width: `${Math.min(data.daysToAlert / 120 * 100, 100)}%`, borderRadius: '999px', background: statusCfg.dot, transition: 'width 1.2s ease' }} />
                  </div>
                </div>
              </div>
            </header>

            {/* ── KPI cards ── */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              {[
                {
                  title: 'التدفق النقدي', value: `${(cashAnim / 10).toFixed(1)}`, unit: 'مليون ر.س',
                  badge: data.cashMillions > 12 ? 'صحي' : data.cashMillions > 7 ? 'متوسط' : 'منخفض',
                  badgeColor: data.cashMillions > 12 ? '#065F46' : data.cashMillions > 7 ? '#0369A1' : '#92400E',
                  badgeBg:    data.cashMillions > 12 ? '#ECFDF5' : data.cashMillions > 7 ? '#F0F9FF' : '#FFFBEB',
                  accent: '#2563EB', icon: <Wallet size={16} />, iconBg: '#EFF6FF', iconColor: '#2563EB',
                },
                {
                  title: 'مؤشر الخطر AI', value: `${data.riskScore}`, unit: '/ 100',
                  badge: statusCfg.label, badgeColor: statusCfg.color, badgeBg: statusCfg.bg,
                  accent: statusCfg.dot, icon: <CircleAlert size={16} />, iconBg: statusCfg.bg, iconColor: statusCfg.color,
                },
                {
                  title: 'وقت التحذير', value: `${daysAnim}`, unit: 'يوم متبقي',
                  badge: daysAnim < 20 ? 'قريب' : daysAnim < 60 ? 'تحذير' : 'آمن',
                  badgeColor: daysAnim < 20 ? '#92400E' : daysAnim < 60 ? '#1E40AF' : '#065F46',
                  badgeBg:    daysAnim < 20 ? '#FFFBEB' : daysAnim < 60 ? '#EFF6FF' : '#ECFDF5',
                  accent: '#D97706', icon: <Clock3 size={16} />, iconBg: '#FFFBEB', iconColor: '#D97706',
                },
                {
                  title: 'مدة التشغيل', value: `${runwayAnim}`, unit: 'يوم',
                  badge: runwayAnim > 180 ? 'ممتاز' : runwayAnim > 90 ? 'جيد' : 'محدود',
                  badgeColor: runwayAnim > 180 ? '#065F46' : runwayAnim > 90 ? '#0369A1' : '#92400E',
                  badgeBg:    runwayAnim > 180 ? '#ECFDF5' : runwayAnim > 90 ? '#F0F9FF' : '#FFFBEB',
                  accent: '#10B981', icon: <BarChart3 size={16} />, iconBg: '#ECFDF5', iconColor: '#10B981',
                },
              ].map((item) => (
                <div key={item.title} style={{ ...card, borderTop: `2px solid ${item.accent}` }}>
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
              {/* Predictive chart — live from engine */}
              <div style={card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
                  <div>
                    <p style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>محرك التنبؤ · 6 أشهر</p>
                    <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginTop: '3px' }}>مسار الرصيد النقدي المتوقع</h2>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#EFF6FF', borderRadius: '6px', padding: '4px 11px', fontSize: '11px', color: '#2563EB', fontWeight: 600 }}>
                    <Zap size={10} /> يُحسب ديناميكياً
                  </span>
                </div>
                <div style={{ height: '210px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.cashTrend} key={`chart-${syncCount}-${inputs.burnRate}`} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="eliteGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%"   stopColor="#2563EB" stopOpacity={0.18} />
                          <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'Inter, system-ui' }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'Inter, system-ui' }} width={55} />
                      <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontFamily: 'Inter, system-ui' }} cursor={{ stroke: '#E2E8F0', strokeWidth: 1 }} />
                      <Area type="monotone" dataKey="cash" stroke="#2563EB" strokeWidth={1.8} fill="url(#eliteGrad)" dot={false} animationDuration={1600} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* AI Risk Gauge */}
              <div style={card}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '2px' }}>
                  <Sparkles size={14} color="#2563EB" />
                  <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>AI Risk Score</h2>
                </div>
                <p style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '18px' }}>مؤشر المخاطر بالذكاء الاصطناعي</p>
                <RiskGauge score={data.riskScore} key={`gauge-${data.riskScore}`} />
                <div style={{ marginTop: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {data.riskDrivers.map((d, i) => (
                    <div key={d.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 500, color: '#475569' }}>{d.label}</span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>{d.value}%</span>
                      </div>
                      <AnimatedBar key={`bar-${d.value}-${i}`} value={d.value} color={d.color} delay={500 + i * 150} />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── Recommendations + Finance ── */}
            <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>

              {/* Dynamic Recommendation Engine */}
              <div style={card}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <TrendingDown size={14} color="#D97706" />
                    <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>الإجراءات المقترحة</h2>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '5px', background: statusCfg.bg, color: statusCfg.color, border: `1px solid ${statusCfg.border}` }}>
                      {statusCfg.label}
                    </span>
                    <span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '5px', background: '#F8FAFC', color: '#64748B', border: '1px solid #E2E8F0' }}>
                      {data.gapSeverity === 'critical' ? 'فجوة حرجة' : data.gapSeverity === 'minor' ? 'فجوة محدودة' : 'لا فجوة'}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {recs.map((item, i) => (
                    <div key={`${syncCount}-${i}-${data.gapSeverity}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '11px', borderRadius: '10px', border: '1px solid #F1F5F9', background: '#FAFAFA', padding: '13px', animation: 'slideDown 0.3s ease both', animationDelay: `${i * 60}ms` }}>
                      <div style={{ flexShrink: 0, width: '22px', height: '22px', borderRadius: '6px', background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '11px', fontWeight: 700 }}>{i + 1}</div>
                      <p style={{ flex: 1, fontSize: '13px', color: '#334155', lineHeight: 1.65 }}>{item.text}</p>
                      <span style={{ flexShrink: 0, background: item.urgencyBg, color: item.urgencyColor, fontSize: '10px', fontWeight: 600, padding: '3px 9px', borderRadius: '5px', whiteSpace: 'nowrap' }}>{item.urgency}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Finance Options — best option auto-selected based on gap */}
              <div style={card}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '18px' }}>
                  <Landmark size={14} color="#2563EB" />
                  <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>خيارات التمويل</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { name: 'تمويل الفواتير',       term: '3 أيام',    rate: '2.1%',  recommended: data.gapSeverity === 'minor'    },
                    { name: 'خط رأس المال العامل', term: '12 أسبوعاً', rate: '8.9%',  recommended: data.gapSeverity === 'critical' },
                    { name: 'قرض قصير الأجل',      term: '6 أشهر',    rate: '11.2%', recommended: data.gapSeverity === 'stable'   },
                  ].map((opt) => (
                    <div key={opt.name} style={{ borderRadius: '10px', padding: '13px', border: opt.recommended ? '1px solid #BFDBFE' : '1px solid #F1F5F9', background: opt.recommended ? '#F0F7FF' : '#FAFAFA', transition: 'all 0.4s' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                          <p style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{opt.name}</p>
                          {opt.recommended && <span style={{ background: '#1E40AF', color: 'white', fontSize: '9px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px', letterSpacing: '0.3px', animation: 'slideDown 0.3s ease' }}>الأفضل</span>}
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
                <button style={{ marginTop: '14px', width: '100%', borderRadius: '10px', background: '#2563EB', padding: '12px', fontSize: '13px', fontWeight: 600, color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', boxShadow: '0 2px 12px rgba(37,99,235,0.30)', transition: 'background 0.2s' }}>
                  <TrendingUp size={13} /> طلب تمويل الآن <ArrowLeft size={12} />
                </button>
              </div>
            </section>

          </div>
        </main>

        {/* ── Debug toggle button (bottom-left, subtle) ── */}
        <div style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 9998 }}>
          <button
            onClick={() => setDebugOpen((v) => !v)}
            title="لوحة التحكم التجريبي (Shift+D)"
            style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: debugOpen ? '#2563EB' : 'rgba(15,23,42,0.75)',
              border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.2s', color: 'white',
            }}
          >
            <Settings2 size={15} />
          </button>
        </div>

        {/* ── Debug Panel ── */}
        {debugOpen && (
          <DebugPanel
            inputs={inputs}
            onChange={(next) => { setInputs(next); setSyncCount((c) => c + 1); }}
            onClose={() => setDebugOpen(false)}
          />
        )}

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          @keyframes pulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.45;transform:scale(0.8)} }
          @keyframes spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
          @keyframes slideDown{ from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        `}</style>
      </SiteShell>
    </AuthGuard>
  );
}
