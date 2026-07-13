'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import {
  Activity, AlertTriangle, BarChart3, Brain,
  CheckCircle2, Clock, Sparkles, TrendingDown, TrendingUp,
} from 'lucide-react';
import {
  Area, AreaChart, Bar, BarChart,
  Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { SiteShell } from '@/components/site-shell';
import { AuthGuard } from '@/components/auth-guard';
import { loadCompany } from '@/lib/company-store';

/* ── Sector benchmarks ── */
const SECTOR_BENCHMARKS: Record<string, { burnRate: number; collectionDelay: number; salaryTrend: number }> = {
  'تجزئة':            { burnRate: 33, collectionDelay: 20, salaryTrend: 30 },
  'إنشاءات':          { burnRate: 48, collectionDelay: 45, salaryTrend: 40 },
  'تقنية':            { burnRate: 55, collectionDelay: 30, salaryTrend: 50 },
  'غذاء وضيافة':      { burnRate: 42, collectionDelay: 14, salaryTrend: 35 },
  'لوجستيات':         { burnRate: 38, collectionDelay: 25, salaryTrend: 28 },
  'استيراد وتصدير':   { burnRate: 36, collectionDelay: 35, salaryTrend: 25 },
  'خدمات مهنية':      { burnRate: 45, collectionDelay: 28, salaryTrend: 55 },
  'صحة':              { burnRate: 40, collectionDelay: 22, salaryTrend: 60 },
  'تعليم':            { burnRate: 35, collectionDelay: 18, salaryTrend: 45 },
  'أخرى':             { burnRate: 40, collectionDelay: 28, salaryTrend: 38 },
};

/* ── Data ── */
const CASH_TREND = [
  { month: 'يناير', cash: 195000, expenses: 142000, revenue: 168000 },
  { month: 'فبراير', cash: 188000, expenses: 151000, revenue: 162000 },
  { month: 'مارس', cash: 176000, expenses: 159000, revenue: 155000 },
  { month: 'أبريل', cash: 161000, expenses: 163000, revenue: 148000 },
  { month: 'مايو', cash: 143000, expenses: 168000, revenue: 139000 },
  { month: 'يونيو', cash: 124000, expenses: 172000, revenue: 131000 },
  { month: 'يوليو', cash: 108000, expenses: 175000, revenue: 126000 },
  { month: 'أغسطس', cash: 90000,  expenses: 179000, revenue: 118000 },
];

const RISK_HISTORY = [
  { month: 'يناير', score: 42 },
  { month: 'فبراير', score: 51 },
  { month: 'مارس', score: 58 },
  { month: 'أبريل', score: 67 },
  { month: 'مايو', score: 74 },
  { month: 'يونيو', score: 79 },
  { month: 'يوليو', score: 84 },
];

const DRIVERS = [
  { label: 'تأخر التحصيل',    before: 28, after: 54, weight: '35%' },
  { label: 'ارتفاع الرواتب',  before: 35, after: 78, weight: '40%' },
  { label: 'تكدس المخزون',    before: 22, after: 65, weight: '25%' },
];

const SCENARIO_CMP = [
  { metric: 'درجة الخطر',        crisis: '84 / 100',    healthy: '22 / 100',    delta: '▼ 62 نقطة' },
  { metric: 'الرصيد النقدي',     crisis: '8.2M ر.س',    healthy: '18.5M ر.س',   delta: '▲ 10.3M' },
  { metric: 'مدة التشغيل',       crisis: '92 يوم',       healthy: '+365 يوم',    delta: '▲ 4x' },
  { metric: 'وقت التحذير',       crisis: '18 يوم',       healthy: 'غير ضروري',   delta: '—' },
  { metric: 'الفجوة المالية',    crisis: 'حرجة (>40%)',   healthy: 'معدومة',      delta: '✓ محلولة' },
  { metric: 'التوصية المقترحة',  crisis: 'تمويل طارئ',   healthy: 'استثمار فائض', delta: '↑ مستوى' },
];

const AI_INSIGHTS = [
  { icon: <AlertTriangle size={13} />, color: '#D97706', bg: '#FFFBEB', text: 'معدل التحصيل انخفض 11% خلال 6 أشهر — الذمم المدينة تتراكم' },
  { icon: <TrendingDown size={13} />,  color: '#2563EB', bg: '#EFF6FF', text: 'الرواتب تستهلك 43% من التدفقات الخارجة — مستوى خطر مرتفع' },
  { icon: <Clock size={13} />,         color: '#7C3AED', bg: '#F5F3FF', text: 'المخزون يضغط على السيولة منذ منتصف يوليو — تصفية مقترحة' },
  { icon: <CheckCircle2 size={13} />,  color: '#059669', bg: '#ECFDF5', text: 'خط تمويل الفواتير يمكن أن يسد الفجوة بمعدل 2.1% فقط' },
];

/* ── Quick Calculator ── */
function QuickCalc() {
  const [rev, setRev]   = useState(3.5);
  const [burn, setBurn] = useState(45);
  const [cash, setCash] = useState(8.2);

  const expenses   = rev * (burn / 100) + rev * 0.45;
  const net        = rev * 0.65 - expenses;
  const runway     = net < 0 ? Math.max(0, Math.round((cash / Math.abs(net)) * 30)) : 365;
  const riskScore  = Math.min(100, Math.round(burn * 0.5 + (30 / Math.max(runway, 1)) * 50));
  const status     = riskScore >= 75 ? { label: 'حرج', color: '#D97706', bg: '#FFFBEB' }
                   : riskScore >= 50 ? { label: 'تحذير', color: '#2563EB', bg: '#EFF6FF' }
                   : { label: 'مستقر', color: '#059669', bg: '#ECFDF5' };

  return (
    <div style={{ background: '#0F172A', borderRadius: '14px', padding: '22px', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '18px' }}>
        <Brain size={14} color="#60A5FA" />
        <span style={{ fontSize: '14px', fontWeight: 700, color: '#F8FAFC' }}>الحاسبة الذكية</span>
        <span style={{ fontSize: '10px', color: '#475569', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '2px 7px' }}>تجريبي</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {[
          { label: 'الإيراد الشهري (M ر.س)', val: rev,  min: 0.5, max: 20,  step: 0.1, set: setRev  },
          { label: 'معدل الاحتراق (%)',        val: burn, min: 5,   max: 90,  step: 1,   set: setBurn },
          { label: 'الرصيد الحالي (M ر.س)',   val: cash, min: 1,   max: 50,  step: 0.5, set: setCash },
        ].map((s) => (
          <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', color: '#64748B' }}>{s.label}</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#F8FAFC' }}>{s.val.toFixed(1)}</span>
            </div>
            <input type="range" min={s.min} max={s.max} step={s.step} value={s.val}
              onChange={(e) => s.set(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#2563EB' }} />
          </div>
        ))}
      </div>

      <div style={{ marginTop: '18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ fontSize: '10px', color: '#64748B', marginBottom: '4px' }}>مدة التشغيل</p>
          <p style={{ fontSize: '22px', fontWeight: 800, color: '#F8FAFC' }}>{runway === 365 ? '∞' : runway}</p>
          <p style={{ fontSize: '10px', color: '#475569' }}>يوم</p>
        </div>
        <div style={{ background: status.bg + '22', borderRadius: '10px', padding: '12px', border: `1px solid ${status.color}44` }}>
          <p style={{ fontSize: '10px', color: '#64748B', marginBottom: '4px' }}>مؤشر الخطر</p>
          <p style={{ fontSize: '22px', fontWeight: 800, color: status.color }}>{riskScore}</p>
          <p style={{ fontSize: '10px', color: status.color, fontWeight: 600 }}>{status.label}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Animated counter ── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const s = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - s) / 1200, 1);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [to]);
  return <>{v}{suffix}</>;
}

const card = { borderRadius: '14px', background: '#FFF', border: '1px solid #E2E8F0', boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.05)', padding: '22px' };

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter'>('month');

  /* Load real company data */
  const company = typeof window !== 'undefined' ? loadCompany() : null;
  const inp = company?.inputs;
  const companyName = company?.name ?? 'شركتك';

  /* Derive live KPIs from real inputs if available */
  const totalRevenue  = inp ? Math.round(inp.monthlyRevenue * 10) : 214;
  const collectionRate = inp ? Math.max(10, Math.round(100 - inp.collectionDelay * 1.1)) : 67;
  const burnRate      = inp ? Math.round(inp.burnRate) : 38;
  const cashRatio     = inp ? parseFloat((inp.currentCash / (inp.operationalExpenses || 1)).toFixed(1)) : 2.4;

  /* Derive 6-month cash forecast for chart */
  const cashTrend = inp ? (() => {
    const months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس'];
    const fixedCosts = inp.operationalExpenses;
    const varCosts   = inp.monthlyRevenue * (inp.burnRate / 100);
    const totalExp   = fixedCosts + varCosts;
    const collEff    = Math.max(0, 1 - inp.collectionDelay / 90);
    const inflow     = inp.monthlyRevenue * collEff;
    const net        = inflow - totalExp;
    let cash = inp.currentCash;
    return months.map((month) => {
      cash = Math.max(0, cash + net);
      return {
        month,
        cash:     Math.round(cash * 10000),
        expenses: Math.round(totalExp * 10000),
        revenue:  Math.round(inp.monthlyRevenue * 10000),
      };
    });
  })() : CASH_TREND;

  /* Derive risk drivers */
  const colRisk = inp ? Math.min(Math.round((inp.collectionDelay / 60) * 100), 100) : 54;
  const drivers = inp ? [
    { label: 'تأخر التحصيل',   before: Math.max(5, colRisk - 26), after: colRisk,              weight: '35%' },
    { label: 'ارتفاع الرواتب', before: Math.max(5, inp.salaryTrend - 43), after: inp.salaryTrend, weight: '40%' },
    { label: 'تكدس المخزون',   before: Math.max(5, inp.inventoryStagnation - 43), after: inp.inventoryStagnation, weight: '25%' },
  ] : DRIVERS;

  /* Sector benchmarks */
  const sector    = company?.sector ?? '';
  const benchmark = SECTOR_BENCHMARKS[sector] ?? SECTOR_BENCHMARKS['أخرى'];

  /* Personalized AI insights from real numbers */
  const personalInsights = inp ? (() => {
    const monthlyCostOfDelay = parseFloat((inp.monthlyRevenue * (inp.collectionDelay / 90) * 0.18).toFixed(2));
    const savingIfReduced    = parseFloat((monthlyCostOfDelay * 0.55).toFixed(2));
    const burnDiff           = inp.burnRate - benchmark.burnRate;
    const delayDiff          = inp.collectionDelay - benchmark.collectionDelay;
    const salaryDiff         = inp.salaryTrend - benchmark.salaryTrend;
    const totalExp           = inp.operationalExpenses + inp.monthlyRevenue * (inp.burnRate / 100);
    const netMonthly         = inp.monthlyRevenue * 0.75 - totalExp;

    const list = [];

    if (inp.collectionDelay > 20)
      list.push({ icon: <AlertTriangle size={13} />, color: '#D97706', bg: '#FFFBEB',
        text: `تأخر التحصيل ${inp.collectionDelay} يوماً يُكلّفك ${monthlyCostOfDelay}M ر.س شهرياً — تخفيضه لـ 20 يوم يُحرّر ${savingIfReduced}M فورياً` });

    if (burnDiff > 5)
      list.push({ icon: <TrendingDown size={13} />, color: '#EF4444', bg: '#FEF2F2',
        text: `معدل احتراقك ${inp.burnRate}% أعلى من متوسط قطاع ${sector || 'السوق'} البالغ ${benchmark.burnRate}% — فرق ${burnDiff.toFixed(0)} نقطة يضغط على السيولة` });

    if (netMonthly < 0)
      list.push({ icon: <TrendingDown size={13} />, color: '#EF4444', bg: '#FEF2F2',
        text: `الصافي الشهري سالب (${netMonthly.toFixed(2)}M ر.س) — الرصيد يتآكل بمعدل ${Math.abs(netMonthly).toFixed(2)}M شهرياً` });
    else
      list.push({ icon: <CheckCircle2 size={13} />, color: '#059669', bg: '#ECFDF5',
        text: `الصافي الشهري إيجابي (+${netMonthly.toFixed(2)}M ر.س) — استثمر الفائض في أدوات سيولة قصيرة الأجل` });

    if (delayDiff > 10)
      list.push({ icon: <Clock size={13} />, color: '#7C3AED', bg: '#F5F3FF',
        text: `تأخر تحصيلك أعلى من متوسط القطاع بـ ${delayDiff} يوماً — تمويل الفواتير بمعدل 2.1% يسد الفجوة فوراً` });

    if (salaryDiff > 10)
      list.push({ icon: <AlertTriangle size={13} />, color: '#D97706', bg: '#FFFBEB',
        text: `ضغط الرواتب لديك (${inp.salaryTrend}%) أعلى من متوسط القطاع (${benchmark.salaryTrend}%) — مراجعة هيكل التعويضات مقترحة` });

    if (inp.inventoryStagnation > 50)
      list.push({ icon: <Clock size={13} />, color: '#7C3AED', bg: '#F5F3FF',
        text: `تكدس المخزون ${inp.inventoryStagnation}% — تصفية المخزون الراكد يمكن أن يُحرّر ${(inp.currentCash * 0.12).toFixed(2)}M ر.س` });

    return list.slice(0, 4);
  })() : AI_INSIGHTS;

  return (
    <AuthGuard>
      <SiteShell>
        <main style={{ minHeight: '100vh', background: '#EEF2F7', padding: '28px 20px', fontFamily: "'Inter', system-ui, sans-serif" }} dir="rtl">
          <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {/* ── Header ── */}
            <header style={{ ...card, padding: '28px 32px', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', border: 'none', color: 'white' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: '6px', padding: '4px 12px', marginBottom: '14px' }}>
                    <Sparkles size={11} color="#60A5FA" />
                    <span style={{ fontSize: '11px', color: '#60A5FA', fontWeight: 600 }}>طبقة تحليل متقدمة</span>
                  </div>
                  <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
                    {inp ? `تحليل سيولة ${companyName}` : 'افهم الضغط قبل أن يصل إلى ميزانيتك'}
                  </h1>
                  <p style={{ color: '#64748B', fontSize: '14px', marginTop: '10px' }}>
                    تحليل عميق لمسار السيولة، عوامل الخطر، ومقارنة السيناريوهات
                  </p>
                </div>
                {/* Period selector */}
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '4px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {(['week', 'month', 'quarter'] as const).map((p) => (
                    <button key={p} onClick={() => setPeriod(p)} style={{ borderRadius: '7px', padding: '6px 14px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', background: period === p ? 'white' : 'transparent', color: period === p ? '#0F172A' : '#64748B', transition: 'all 0.2s' }}>
                      {p === 'week' ? 'أسبوع' : p === 'month' ? 'شهر' : 'ربع سنة'}
                    </button>
                  ))}
                </div>
              </div>
            </header>

            {/* ── KPI Cards ── */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
              {[
                { label: 'الإيراد الشهري',  value: totalRevenue,   suffix: 'K', trend: '-8%',  up: false, accent: '#2563EB', icon: <TrendingUp size={15} /> },
                { label: 'معدل التحصيل',    value: collectionRate, suffix: '%', trend: '-4%',  up: false, accent: '#D97706', icon: <Activity size={15} /> },
                { label: 'معدل الاحتراق',   value: burnRate,       suffix: '%', trend: '+6%',  up: true,  accent: '#EF4444', icon: <TrendingDown size={15} /> },
                { label: 'نسبة تغطية النقد', value: Math.round(cashRatio * 10), suffix: 'x', trend: '-0.3', up: false, accent: '#10B981', icon: <BarChart3 size={15} /> },
              ].map((k) => (
                <div key={k.label} style={{ ...card, borderTop: `2px solid ${k.accent}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <p style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.6px' }}>{k.label}</p>
                    <div style={{ color: k.accent, background: k.accent + '15', borderRadius: '7px', padding: '6px' }}>{k.icon}</div>
                  </div>
                  <p style={{ fontSize: '26px', fontWeight: 700, color: '#0F172A', marginTop: '10px', letterSpacing: '-0.5px' }}>
                    <Counter to={k.value} suffix={k.suffix} />
                  </p>
                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: k.up ? '#EF4444' : '#059669', background: k.up ? '#FEF2F2' : '#ECFDF5', padding: '2px 8px', borderRadius: '4px' }}>{k.trend}</span>
                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>عن الشهر السابق</span>
                  </div>
                </div>
              ))}
            </section>

            {/* ── Cash Flow Chart + AI Insights ── */}
            <section style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '14px' }}>
              <div style={card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <p style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>الرصيد النقدي</p>
                    <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginTop: '3px' }}>اتجاه السيولة · 8 أشهر</h2>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '11px', color: '#94A3B8' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '8px', height: '3px', background: '#2563EB', display: 'inline-block', borderRadius: '2px' }} />رصيد</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '8px', height: '3px', background: '#10B981', display: 'inline-block', borderRadius: '2px' }} />إيرادات</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '8px', height: '3px', background: '#EF4444', display: 'inline-block', borderRadius: '2px' }} />مصروفات</span>
                  </div>
                </div>
                <div style={{ height: '200px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cashTrend} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563EB" stopOpacity={0.15} />
                          <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10B981" stopOpacity={0.10} />
                          <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} width={50} />
                      <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }} cursor={{ stroke: '#E2E8F0', strokeWidth: 1 }} />
                      <Area type="monotone" dataKey="revenue"  stroke="#10B981" strokeWidth={1.5} fill="url(#revGrad)"  dot={false} animationDuration={1400} />
                      <Area type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={1.5} fill="none"            dot={false} animationDuration={1600} strokeDasharray="4 2" />
                      <Area type="monotone" dataKey="cash"     stroke="#2563EB" strokeWidth={2}   fill="url(#cashGrad)" dot={false} animationDuration={1800} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* AI Insights */}
              <div style={{ ...card, background: '#0F172A', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '16px' }}>
                  <Brain size={14} color="#60A5FA" />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#F8FAFC' }}>رؤى الذكاء الاصطناعي</span>
                  <span style={{ marginRight: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', animation: 'pulse 2s infinite', display: 'inline-block' }} />
                    <span style={{ fontSize: '10px', color: '#6EE7B7', fontWeight: 600, letterSpacing: '1px' }}>LIVE</span>
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {personalInsights.map((ins, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '11px' }}>
                      <div style={{ flexShrink: 0, background: ins.bg + '22', color: ins.color, borderRadius: '6px', padding: '5px', display: 'flex' }}>{ins.icon}</div>
                      <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.6 }}>{ins.text}</p>
                    </div>
                  ))}
                </div>
                {inp && sector && (
                  <div style={{ marginTop: '12px', background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.15)', borderRadius: '10px', padding: '10px 14px' }}>
                    <p style={{ fontSize: '10px', color: '#60A5FA', fontWeight: 600, marginBottom: '2px' }}>مقارنة بقطاع {sector}</p>
                    <p style={{ fontSize: '11px', color: '#475569' }}>احتراق {benchmark.burnRate}% · تحصيل {benchmark.collectionDelay}د · رواتب {benchmark.salaryTrend}%</p>
                  </div>
                )}
              </div>
            </section>

            {/* ── Revenue vs Expenses + Risk Score ── */}
            <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div style={card}>
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>مقارنة</p>
                  <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginTop: '3px' }}>الإيرادات مقابل المصروفات</h2>
                </div>
                <div style={{ height: '190px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cashTrend} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                      <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} width={50} />
                      <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '12px' }} />
                      <Bar dataKey="revenue"  fill="#2563EB" radius={[4, 4, 0, 0]} name="إيرادات" />
                      <Bar dataKey="expenses" fill="#EF4444" radius={[4, 4, 0, 0]} name="مصروفات" opacity={0.7} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div style={card}>
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>التطور الزمني</p>
                  <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginTop: '3px' }}>مسار مؤشر الخطر AI</h2>
                </div>
                <div style={{ height: '190px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={RISK_HISTORY} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="riskLine" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%"   stopColor="#10B981" />
                          <stop offset="60%"  stopColor="#D97706" />
                          <stop offset="100%" stopColor="#EF4444" />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                      <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} width={35} />
                      <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '12px' }} />
                      <Line type="monotone" dataKey="score" stroke="#D97706" strokeWidth={2.5} dot={{ fill: '#D97706', r: 4 }} name="درجة الخطر" animationDuration={1800} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            {/* ── Risk Drivers + Quick Calc ── */}
            <section style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '14px' }}>
              <div style={card}>
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>تشريح الخطر</p>
                  <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginTop: '3px' }}>عوامل الخطر: قبل وبعد</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {drivers.map((d) => (
                    <div key={d.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{d.label}</span>
                          <span style={{ fontSize: '10px', color: '#94A3B8', marginRight: '8px' }}>وزن {d.weight}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', fontSize: '11px', fontWeight: 700 }}>
                          <span style={{ color: '#10B981' }}>قبل: {d.before}%</span>
                          <span style={{ color: '#64748B' }}>→</span>
                          <span style={{ color: '#EF4444' }}>الآن: {d.after}%</span>
                        </div>
                      </div>
                      {/* Before bar */}
                      <div style={{ height: '5px', borderRadius: '999px', background: '#F1F5F9', marginBottom: '4px' }}>
                        <div style={{ height: '100%', width: `${d.before}%`, background: 'linear-gradient(90deg, #10B981, #059669)', borderRadius: '999px', transition: 'width 1.2s ease' }} />
                      </div>
                      {/* After bar */}
                      <div style={{ height: '5px', borderRadius: '999px', background: '#F1F5F9' }}>
                        <div style={{ height: '100%', width: `${d.after}%`, background: 'linear-gradient(90deg, #D97706, #EF4444)', borderRadius: '999px', transition: 'width 1.4s ease' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <QuickCalc />
                {/* Sector Benchmarking */}
                {inp && sector && (
                  <div style={{ ...card, background: '#0F172A', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '16px' }}>
                      <Brain size={14} color="#A78BFA" />
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#F8FAFC' }}>مقارنة بالقطاع</span>
                      <span style={{ marginRight: 'auto', fontSize: '10px', color: '#475569', background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: '4px', padding: '2px 8px' }}>{sector}</span>
                    </div>
                    {[
                      { label: 'معدل الاحتراق', yours: inp.burnRate, avg: benchmark.burnRate, unit: '%', higherIsBad: true },
                      { label: 'تأخر التحصيل', yours: inp.collectionDelay, avg: benchmark.collectionDelay, unit: 'د', higherIsBad: true },
                      { label: 'ضغط الرواتب',  yours: inp.salaryTrend, avg: benchmark.salaryTrend, unit: '%', higherIsBad: true },
                    ].map((b) => {
                      const diff = b.yours - b.avg;
                      const worse = b.higherIsBad ? diff > 0 : diff < 0;
                      const color = worse ? '#FCA5A5' : '#6EE7B7';
                      return (
                        <div key={b.label} style={{ marginBottom: '14px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <span style={{ fontSize: '12px', color: '#94A3B8' }}>{b.label}</span>
                            <span style={{ fontSize: '12px', fontWeight: 700, color }}>
                              أنت: {b.yours}{b.unit} · متوسط: {b.avg}{b.unit}
                              <span style={{ marginRight: '6px', fontSize: '10px' }}>({diff > 0 ? '+' : ''}{diff}{b.unit})</span>
                            </span>
                          </div>
                          <div style={{ position: 'relative', height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px' }}>
                            <div style={{ position: 'absolute', height: '100%', width: `${Math.min(b.avg, 100)}%`, background: 'rgba(255,255,255,0.15)', borderRadius: '999px' }} />
                            <div style={{ position: 'absolute', height: '100%', width: `${Math.min(b.yours, 100)}%`, background: color, borderRadius: '999px', transition: 'width 1.2s ease' }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>

            {/* ── Scenario Comparison Table ── */}
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <p style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>محاكاة السيناريوهات</p>
                  <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginTop: '3px' }}>وضع الأزمة مقابل الوضع الصحي</h2>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ background: '#FFFBEB', color: '#92400E', fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '6px', border: '1px solid #FDE68A' }}>🔴 أزمة</span>
                  <span style={{ background: '#ECFDF5', color: '#065F46', fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '6px', border: '1px solid #A7F3D0' }}>🟢 صحي</span>
                </div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #F1F5F9' }}>
                      <th style={{ textAlign: 'right', padding: '8px 12px', color: '#64748B', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>المؤشر</th>
                      <th style={{ textAlign: 'center', padding: '8px 12px', color: '#92400E', fontWeight: 600, fontSize: '11px' }}>🔴 أزمة</th>
                      <th style={{ textAlign: 'center', padding: '8px 12px', color: '#065F46', fontWeight: 600, fontSize: '11px' }}>🟢 صحي</th>
                      <th style={{ textAlign: 'center', padding: '8px 12px', color: '#1E40AF', fontWeight: 600, fontSize: '11px' }}>الفرق</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SCENARIO_CMP.map((row, i) => (
                      <tr key={row.metric} style={{ borderBottom: '1px solid #F8FAFC', background: i % 2 === 0 ? '#FAFAFA' : 'white' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0F172A' }}>{row.metric}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center', color: '#92400E', background: '#FFFBEB40' }}>{row.crisis}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center', color: '#065F46', background: '#ECFDF540' }}>{row.healthy}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center', color: '#1E40AF', fontWeight: 700 }}>{row.delta}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Story / Pitch section ── */}
            <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', borderRadius: '16px', padding: '40px', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                <p style={{ fontSize: '11px', color: '#60A5FA', fontWeight: 600, letterSpacing: '2px', marginBottom: '10px' }}>BASEERAH · بصيرة</p>
                <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.5px' }}>لماذا بصيرة؟</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {[
                  { emoji: '😰', title: 'المشكلة', color: '#D97706', body: '82% من الشركات الصغيرة تفشل بسبب أزمات سيولة لم تكن تتوقعها. يكتشفون الأزمة بعد وقوع الضرر.' },
                  { emoji: '🧠', title: 'الحل',     color: '#2563EB', body: 'بصيرة تحلل تدفقاتك المالية بالذكاء الاصطناعي وتنبهك قبل 18-30 يوماً مع توصيات تمويلية فورية.' },
                  { emoji: '🚀', title: 'الأثر',    color: '#10B981', body: '92% دقة في التنبؤ، قرارات أسرع 3 مرات، وتوفير ما يصل إلى 40% من تكاليف التمويل الطارئ.' },
                ].map((s) => (
                  <div key={s.title} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '22px', textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', marginBottom: '12px' }}>{s.emoji}</div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: s.color, marginBottom: '10px' }}>{s.title}</p>
                    <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.7 }}>{s.body}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>

        <style>{`
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        `}</style>
      </SiteShell>
    </AuthGuard>
  );
}
