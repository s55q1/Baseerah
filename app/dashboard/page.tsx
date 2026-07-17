'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { CrisisAlert } from '@/components/crisis-alert';
import { AiChat } from '@/components/ai-chat';
import { loadCompany, saveCompany, type FinancialInputs as StoredInputs } from '@/lib/company-store';

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

      <div style={{ padding: '12px 18px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={() => { if (typeof window !== 'undefined') window.location.href = '/setup'; }}
          style={{ width: '100%', background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.25)', borderRadius: '8px', padding: '9px', color: '#60A5FA', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
          ✏️ تعديل بيانات شركتي
        </button>
        <p style={{ fontSize: '10px', color: '#1E3A5F', textAlign: 'center' }}>Shift+D لفتح/إغلاق اللوحة</p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const router = useRouter();

  /* Load real company data from localStorage, fallback to demo */
  const [inputs, setInputs] = useState<FinancialInputs>(() => {
    const saved = loadCompany();
    return (saved?.inputs as FinancialInputs) ?? CRISIS_INPUTS;
  });
  const [companyName, setCompanyName] = useState<string>('');
  const [syncing, setSyncing]     = useState(false);
  const [syncCount, setSyncCount] = useState(0);
  const [debugOpen, setDebugOpen]       = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [demoMode, setDemoMode]         = useState(false);
  const [alertModal, setAlertModal]     = useState(false);
  const [financeModal, setFinanceModal] = useState(false);
  const [scenarioOpen, setScenarioOpen] = useState(false);
  const [scenarioInputs, setScenarioInputs] = useState<FinancialInputs | null>(null);
  const realInputsRef = useRef<FinancialInputs | null>(null);
  const syncRef = useRef(0);

  /* Read company name on mount */
  useEffect(() => {
    const saved = loadCompany();
    if (saved?.name) setCompanyName(saved.name);
  }, []);

  /* Persist inputs to localStorage whenever they change */
  useEffect(() => {
    const saved = loadCompany();
    if (saved) {
      saveCompany({ ...saved, inputs, savedAt: new Date().toISOString() });
    }
  }, [inputs]);

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

  /* Sync: if real data exists, toggle demo/real; otherwise toggle crisis/healthy */
  const handleSync = useCallback(async () => {
    if (syncing) return;
    setSyncing(true);
    await new Promise((r) => setTimeout(r, 2200));
    syncRef.current += 1;
    const saved = loadCompany();
    if (saved?.inputs) {
      if (demoMode) {
        // return to real data
        setInputs(saved.inputs as FinancialInputs);
        setDemoMode(false);
      } else {
        // save real inputs, switch to demo scenario
        realInputsRef.current = saved.inputs as FinancialInputs;
        setInputs(computeRiskScore(saved.inputs as FinancialInputs) > 60 ? HEALTHY_INPUTS : CRISIS_INPUTS);
        setDemoMode(true);
      }
    } else {
      setInputs((prev) => (computeRiskScore(prev) > 60 ? HEALTHY_INPUTS : CRISIS_INPUTS));
    }
    setSyncCount((c) => c + 1);
    setSyncing(false);
  }, [syncing, demoMode]);

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
      <Onboarding forceShow={showOnboarding} />
      <CrisisAlert status={status} riskScore={data.riskScore} daysToAlert={data.daysToAlert} />
      <SiteShell>
        <main style={{ minHeight: '100vh', background: '#EEF2F7', padding: '28px 20px', fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif" }} dir="rtl">
          <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {/* ── Real data CTA — shows when no company data saved ── */}
            {!companyName && (
              <div style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(16,185,129,0.10))', border: '1px solid rgba(37,99,235,0.3)', borderRadius: '14px', padding: '16px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', animation: 'slideDown 0.4s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '24px' }}>📊</span>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#F8FAFC', marginBottom: '2px' }}>أنت تشاهد بيانات تجريبية</p>
                    <p style={{ fontSize: '12px', color: '#64748B' }}>أدخل بيانات شركتك الحقيقية لتحليل دقيق لوضع السيولة</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/setup')}
                  style={{ background: '#2563EB', border: 'none', borderRadius: '10px', padding: '10px 20px', color: 'white', fontSize: '13px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 2px 12px rgba(37,99,235,0.4)', flexShrink: 0 }}>
                  ✏️ أدخل بياناتي الآن
                </button>
              </div>
            )}

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
                    {companyName && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', borderRadius: '6px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)', padding: '4px 12px', color: '#F8FAFC', fontSize: '11px', fontWeight: 700 }}>
                        🏢 {companyName}
                      </span>
                    )}
                    <button
                      onClick={() => setShowOnboarding(true)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', padding: '4px 12px', color: '#64748B', fontSize: '11px', fontWeight: 500, cursor: 'pointer' }}>
                      🎯 عرض المقدمة
                    </button>
                    <button
                      onClick={() => setAlertModal(true)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', borderRadius: '6px', background: 'rgba(37,211,102,0.10)', border: '1px solid rgba(37,211,102,0.25)', padding: '4px 12px', color: '#4ADE80', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                      📱 محاكاة تنبيه
                    </button>
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
                <button
                  onClick={() => setFinanceModal(true)}
                  style={{ marginTop: '14px', width: '100%', borderRadius: '10px', background: '#2563EB', padding: '12px', fontSize: '13px', fontWeight: 600, color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', boxShadow: '0 2px 12px rgba(37,99,235,0.30)', transition: 'background 0.2s' }}>
                  <TrendingUp size={13} /> طلب تمويل الآن <ArrowLeft size={12} />
                </button>
              </div>
            </section>

            {/* ── Scenario Simulator ── */}
            <div style={{ ...card, border: '1px solid rgba(109,40,217,0.2)', background: 'linear-gradient(135deg, #1E1B4B 0%, #1E293B 100%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: scenarioOpen ? '20px' : '0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={14} color="#A78BFA" />
                  <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#F8FAFC' }}>محاكي السيناريوهات — ماذا لو؟</h2>
                  <span style={{ fontSize: '10px', color: '#7C3AED', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: '4px', padding: '2px 8px', fontWeight: 600 }}>AI</span>
                </div>
                <button
                  onClick={() => { setScenarioOpen(v => !v); if (!scenarioInputs) setScenarioInputs({ ...inputs }); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', background: scenarioOpen ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.06)', border: `1px solid ${scenarioOpen ? 'rgba(167,139,250,0.35)' : 'rgba(255,255,255,0.10)'}`, borderRadius: '8px', padding: '7px 14px', color: scenarioOpen ? '#A78BFA' : '#94A3B8', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                  {scenarioOpen ? '▲ إخفاء' : '▼ جرّب الآن'}
                </button>
              </div>

              {scenarioOpen && scenarioInputs && (() => {
                const simData    = deriveSnapshot(scenarioInputs);
                const simStatus  = computeLiquidityStatus(simData);
                const riskDelta  = simData.riskScore - data.riskScore;
                const cashDelta  = simData.cashMillions - data.cashMillions;
                const runwayDelta = simData.runwayDays - data.runwayDays;
                const simColor   = simStatus === 'stable' ? '#10B981' : simStatus === 'warning' ? '#D97706' : '#EF4444';

                const sl = (field: keyof FinancialInputs, label: string, min: number, max: number, step = 1, unit = '') => (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>{label}</span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#F8FAFC' }}>{(scenarioInputs[field] as number).toFixed(step < 1 ? 1 : 0)}{unit}</span>
                    </div>
                    <input type="range" min={min} max={max} step={step}
                      value={scenarioInputs[field] as number}
                      onChange={e => setScenarioInputs(p => p ? { ...p, [field]: parseFloat(e.target.value) } : p)}
                      style={{ width: '100%', accentColor: '#A78BFA' }} />
                  </div>
                );

                return (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {/* Left: sliders */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <p style={{ fontSize: '10px', color: '#6D28D9', fontWeight: 700, letterSpacing: '1px' }}>عدّل المتغيرات</p>
                      {sl('collectionDelay',     'تأخر التحصيل (يوم)',        0, 90,  1,  ' د')}
                      {sl('burnRate',            'معدل الاحتراق (%)',          5, 95,  1,  '%')}
                      {sl('salaryTrend',         'ضغط الرواتب (%)',            0, 100, 1,  '%')}
                      {sl('inventoryStagnation', 'تكدس المخزون (%)',           0, 100, 1,  '%')}
                      {sl('monthlyRevenue',      'الإيراد الشهري (M ر.س)',    0.5, 30, 0.1, 'M')}
                      <button onClick={() => setScenarioInputs({ ...inputs })} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '7px', color: '#475569', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}>↺ إعادة تعيين</button>
                    </div>

                    {/* Right: results */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <p style={{ fontSize: '10px', color: '#6D28D9', fontWeight: 700, letterSpacing: '1px' }}>النتائج الفورية</p>

                      {/* Risk score comparison */}
                      <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${simColor}30`, borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                        <p style={{ fontSize: '10px', color: '#64748B', marginBottom: '6px' }}>درجة الخطر</p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '28px', fontWeight: 900, color: '#64748B', textDecoration: 'line-through', opacity: 0.5 }}>{data.riskScore}</span>
                          <span style={{ fontSize: '14px', color: riskDelta < 0 ? '#10B981' : '#EF4444' }}>→</span>
                          <span style={{ fontSize: '36px', fontWeight: 900, color: simColor }}>{simData.riskScore}</span>
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: riskDelta < 0 ? '#10B981' : '#EF4444' }}>
                          {riskDelta > 0 ? '+' : ''}{riskDelta} نقطة
                        </span>
                      </div>

                      {[
                        { label: 'مدة التشغيل', before: data.runwayDays, after: simData.runwayDays, delta: runwayDelta, unit: ' يوم', good: runwayDelta > 0 },
                        { label: 'الرصيد النقدي', before: data.cashMillions.toFixed(1), after: simData.cashMillions.toFixed(1), delta: cashDelta, unit: 'M', good: cashDelta > 0 },
                      ].map(m => (
                        <div key={m.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '12px' }}>
                          <p style={{ fontSize: '10px', color: '#64748B', marginBottom: '6px' }}>{m.label}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '14px', color: '#334155', textDecoration: 'line-through' }}>{m.before}{m.unit}</span>
                            <span style={{ fontSize: '11px', color: '#334155' }}>→</span>
                            <span style={{ fontSize: '18px', fontWeight: 800, color: m.good ? '#10B981' : '#EF4444' }}>{m.after}{m.unit}</span>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: m.good ? '#10B981' : '#EF4444', marginRight: 'auto' }}>
                              ({m.delta > 0 ? '+' : ''}{typeof m.delta === 'number' ? m.delta.toFixed(m.unit === 'M' ? 1 : 0) : m.delta}{m.unit})
                            </span>
                          </div>
                        </div>
                      ))}

                      <div style={{ background: `${simColor}10`, border: `1px solid ${simColor}25`, borderRadius: '10px', padding: '10px 12px' }}>
                        <p style={{ fontSize: '11px', color: simColor, fontWeight: 700 }}>
                          {simStatus === 'stable' ? '✅ هذا السيناريو يُحسّن وضعك للمستقر' : simStatus === 'warning' ? '⚠️ لا يزال في نطاق التحذير' : '🔴 الوضع لا يزال حرجاً'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>
        </main>

        {/* ── Finance Application Modal ── */}
        {financeModal && (() => {
          const recommended = data.gapSeverity === 'minor' ? 'تمويل الفواتير' : data.gapSeverity === 'critical' ? 'خط رأس المال العامل' : 'قرض قصير الأجل';
          const amount = Math.max(0.5, Math.abs((inputs.operationalExpenses + inputs.monthlyRevenue * (inputs.burnRate / 100)) - inputs.monthlyRevenue * 0.75) * 3).toFixed(1);
          const options = [
            { name: 'تمويل الفواتير',       rate: '2.1%', term: '3-7 أيام',    max: '2M ر.س',  icon: '📄', best: data.gapSeverity === 'minor' },
            { name: 'خط رأس المال العامل', rate: '8.9%', term: '12 أسبوعاً',  max: '5M ر.س',  icon: '🏦', best: data.gapSeverity === 'critical' },
            { name: 'قرض قصير الأجل',      rate: '11.2%', term: '6 أشهر',     max: '10M ر.س', icon: '💰', best: data.gapSeverity === 'stable' },
          ];
          return (
            <div style={{ position: 'fixed', inset: 0, zIndex: 99998, background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setFinanceModal(false)}>
              <div style={{ width: '100%', maxWidth: '460px', background: '#1E293B', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 32px 80px rgba(0,0,0,0.5)', overflow: 'hidden' }} onClick={e => e.stopPropagation()} dir="rtl">
                {/* Header */}
                <div style={{ background: 'linear-gradient(135deg, #0F172A, #1E293B)', padding: '24px 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: '5px', padding: '3px 10px', marginBottom: '10px' }}>
                        <Landmark size={10} color="#60A5FA" />
                        <span style={{ fontSize: '10px', color: '#60A5FA', fontWeight: 600 }}>طلب تمويل — بصيرة AI</span>
                      </div>
                      <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.3px' }}>{companyName || 'شركتك'}</h2>
                      <p style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>مبلغ التمويل المقترح: <strong style={{ color: '#60A5FA' }}>{amount}M ر.س</strong></p>
                    </div>
                    <button onClick={() => setFinanceModal(false)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '20px', lineHeight: 1 }}>×</button>
                  </div>
                  {/* Risk badge */}
                  <div style={{ marginTop: '14px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', color: '#FCD34D', background: 'rgba(217,119,6,0.12)', border: '1px solid rgba(217,119,6,0.25)', borderRadius: '5px', padding: '3px 10px', fontWeight: 600 }}>درجة الخطر: {data.riskScore}/100</span>
                    <span style={{ fontSize: '11px', color: '#93C5FD', background: 'rgba(37,99,235,0.10)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: '5px', padding: '3px 10px', fontWeight: 600 }}>مدة التشغيل: {data.runwayDays} يوم</span>
                    <span style={{ fontSize: '11px', color: '#6EE7B7', background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '5px', padding: '3px 10px', fontWeight: 600 }}>الموصى به: {recommended}</span>
                  </div>
                </div>

                {/* Options */}
                <div style={{ padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <p style={{ fontSize: '11px', color: '#475569', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '4px' }}>اختر خيار التمويل</p>
                  {options.map(opt => (
                    <div key={opt.name} style={{ borderRadius: '12px', padding: '14px 16px', border: opt.best ? '1.5px solid #2563EB' : '1px solid rgba(255,255,255,0.07)', background: opt.best ? 'rgba(37,99,235,0.10)' : 'rgba(255,255,255,0.03)', cursor: 'pointer', transition: 'all 0.2s' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '20px' }}>{opt.icon}</span>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <p style={{ fontSize: '13px', fontWeight: 700, color: '#F1F5F9' }}>{opt.name}</p>
                              {opt.best && <span style={{ fontSize: '9px', fontWeight: 700, color: 'white', background: '#2563EB', borderRadius: '3px', padding: '2px 6px' }}>الأفضل</span>}
                            </div>
                            <p style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>حتى {opt.max} · {opt.term}</p>
                          </div>
                        </div>
                        <span style={{ fontSize: '16px', fontWeight: 800, color: opt.best ? '#60A5FA' : '#64748B' }}>{opt.rate}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Submit simulation */}
                <div style={{ padding: '0 24px 24px' }}>
                  <button
                    onClick={() => {
                      setFinanceModal(false);
                      setTimeout(() => alert(`✅ تم إرسال طلب التمويل!\n\nالشركة: ${companyName || 'شركتك'}\nالمبلغ: ${amount}M ر.س\nالخيار: ${recommended}\n\nسيتواصل معك ممثل البنك خلال 24 ساعة.`), 100);
                    }}
                    style={{ width: '100%', background: 'linear-gradient(135deg, #2563EB, #1d4ed8)', border: 'none', borderRadius: '12px', padding: '14px', color: 'white', fontSize: '14px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 20px rgba(37,99,235,0.4)', letterSpacing: '-0.2px' }}>
                    🏦 تقديم طلب التمويل الآن
                  </button>
                  <p style={{ textAlign: 'center', fontSize: '11px', color: '#334155', marginTop: '10px' }}>محاكاة تجريبية — بدون التزام مالي</p>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── WhatsApp/Email Alert Simulation Modal ── */}
        {alertModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 99998, background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setAlertModal(false)}>
            <div style={{ width: '100%', maxWidth: '420px', fontFamily: "'Inter', system-ui, sans-serif" }} onClick={e => e.stopPropagation()} dir="rtl">
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <p style={{ fontSize: '11px', color: '#60A5FA', fontWeight: 600, letterSpacing: '1px' }}>محاكاة التنبيه التلقائي</p>
                <p style={{ fontSize: '12px', color: '#334155', marginTop: '4px' }}>هكذا يصل التنبيه لصاحب الشركة</p>
              </div>

              {/* WhatsApp mockup */}
              <div style={{ background: '#111B21', borderRadius: '16px', overflow: 'hidden', marginBottom: '12px', boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}>
                <div style={{ background: '#1F2C33', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>👁</div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#E9EDEF' }}>بصيرة AI</p>
                    <p style={{ fontSize: '11px', color: '#8696A0' }}>متصل الآن</p>
                  </div>
                  <span style={{ marginRight: 'auto', fontSize: '20px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </span>
                </div>
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', background: '#0B141A' }}>
                  <div style={{ background: '#1F2C33', borderRadius: '0 10px 10px 10px', padding: '12px 14px', maxWidth: '85%' }}>
                    <p style={{ fontSize: '13px', color: '#E9EDEF', lineHeight: 1.6, direction: 'rtl' }}>
                      🚨 <strong>تحذير سيولة — {companyName || 'شركتك'}</strong><br /><br />
                      درجة الخطر وصلت <strong style={{ color: data.riskScore >= 75 ? '#FF6B6B' : '#FFD93D' }}>{data.riskScore}/100</strong><br />
                      متوقع نفاد الرصيد خلال <strong>{data.runwayDays} يوم</strong><br /><br />
                      📋 التوصية الفورية:<br />
                      {recs[0]?.text.slice(0, 70)}...<br /><br />
                      <span style={{ color: '#8696A0', fontSize: '11px' }}>بصيرة AI · الآن</span>
                    </p>
                  </div>
                  <div style={{ alignSelf: 'flex-end', background: '#005C4B', borderRadius: '10px 0 10px 10px', padding: '10px 14px' }}>
                    <p style={{ fontSize: '12px', color: '#E9EDEF' }}>✓✓ تم الاستلام</p>
                  </div>
                </div>
              </div>

              {/* Email mockup */}
              <div style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden', marginBottom: '16px' }}>
                <div style={{ background: '#0F172A', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
                  <span style={{ marginRight: '8px', fontSize: '11px', color: '#334155' }}>إشعار بريد إلكتروني</span>
                </div>
                <div style={{ padding: '16px' }}>
                  <p style={{ fontSize: '10px', color: '#475569', marginBottom: '6px' }}>من: alerts@baseerah.ai · إلى: owner@company.sa</p>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: '#F8FAFC', marginBottom: '10px' }}>
                    {data.riskScore >= 75 ? '🚨' : '⚠️'} تقرير سيولة طارئ — {companyName || 'شركتك'}
                  </p>
                  <div style={{ background: data.riskScore >= 75 ? 'rgba(239,68,68,0.08)' : 'rgba(217,119,6,0.08)', border: `1px solid ${data.riskScore >= 75 ? 'rgba(239,68,68,0.2)' : 'rgba(217,119,6,0.2)'}`, borderRadius: '8px', padding: '10px', marginBottom: '10px' }}>
                    <p style={{ fontSize: '12px', color: data.riskScore >= 75 ? '#FCA5A5' : '#FCD34D', fontWeight: 600 }}>
                      درجة الخطر: {data.riskScore}/100 · مدة التشغيل: {data.runwayDays} يوم
                    </p>
                  </div>
                  <p style={{ fontSize: '11px', color: '#475569', lineHeight: 1.6 }}>{recs[0]?.text}</p>
                </div>
              </div>

              <button onClick={() => setAlertModal(false)} style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '11px', color: '#94A3B8', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}>
                إغلاق
              </button>
            </div>
          </div>
        )}

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
      <AiChat />
    </AuthGuard>
  );
}
