'use client';

export const dynamic = 'force-dynamic';

import { useRef, useState } from 'react';
import {
  AlertTriangle, Brain, CheckCircle2, Download,
  FileText, Landmark, Printer, Share2, Sparkles, TrendingDown,
} from 'lucide-react';
import { SiteShell } from '@/components/site-shell';
import { AuthGuard } from '@/components/auth-guard';
import { loadCompany } from '@/lib/company-store';

/* ── Report data ── */
const REPORT_DATE = new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });

const FORECAST_TABLE = [
  { month: 'يناير 2025', revenue: '3.5M',  expenses: '3.82M', net: '-0.32M', cash: '7.88M', risk: 84, status: 'حرج' },
  { month: 'فبراير 2025', revenue: '3.5M', expenses: '3.88M', net: '-0.38M', cash: '7.50M', risk: 87, status: 'حرج' },
  { month: 'مارس 2025',  revenue: '3.6M',  expenses: '3.85M', net: '-0.25M', cash: '7.25M', risk: 89, status: 'حرج' },
  { month: 'أبريل 2025', revenue: '3.8M',  expenses: '3.80M', net: '0.00M',  cash: '7.25M', risk: 82, status: 'تحذير' },
  { month: 'مايو 2025',  revenue: '4.0M',  expenses: '3.75M', net: '+0.25M', cash: '7.50M', risk: 74, status: 'تحذير' },
  { month: 'يونيو 2025', revenue: '4.2M',  expenses: '3.70M', net: '+0.50M', cash: '8.00M', risk: 65, status: 'تحذير' },
];

const RISK_DRIVERS = [
  { driver: 'ارتفاع الرواتب',    score: 78, weight: '40%', impact: 'مرتفع',  action: 'مراجعة هيكل الرواتب وتحديد بنود التخفيض الممكنة' },
  { driver: 'تأخر التحصيل',      score: 54, weight: '35%', impact: 'متوسط', action: 'تسريع التحصيل عبر تمويل الفواتير أو خصم الدفع المبكر' },
  { driver: 'تكدس المخزون',      score: 65, weight: '25%', impact: 'مرتفع',  action: 'تصفية المخزون الراكد وتحريك السيولة المجمّدة' },
];

const RECS = [
  { priority: 1, action: 'تقليل التكاليف التشغيلية بنسبة 12-15% خلال 30 يوماً',         type: 'critical', savings: '420K ر.س' },
  { priority: 2, action: 'التقدم لخط تمويل فواتير بمعدل 2.1% — تحرير سيولة فورية',     type: 'urgent',   savings: '850K ر.س' },
  { priority: 3, action: 'التفاوض مع الموردين لتمديد شروط الدفع 30-45 يوماً',            type: 'moderate', savings: '280K ر.س' },
  { priority: 4, action: 'تسريع دوران المخزون — تصفية المخزون الراكد منذ 60+ يوم',      type: 'moderate', savings: '340K ر.س' },
];

const FINANCE_OPTIONS = [
  { name: 'تمويل الفواتير',       rate: '2.1%',  term: '3-7 أيام',    amount: 'حتى 2M ر.س',  best: true  },
  { name: 'خط رأس المال العامل', rate: '8.9%',  term: '12 أسبوعاً',  amount: 'حتى 5M ر.س',  best: false },
  { name: 'قرض قصير الأجل',      rate: '11.2%', term: '6 أشهر',       amount: 'حتى 10M ر.س', best: false },
];

export default function ReportsPage() {
  const printRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  /* Load real company data */
  const company    = typeof window !== 'undefined' ? loadCompany() : null;
  const inp        = company?.inputs;
  const companyName = company?.name ?? 'شركتك';

  /* Derive live risk score and summary from inputs */
  const liveRiskScore = inp
    ? Math.min(100, Math.round(inp.salaryTrend * 0.40 + Math.min((inp.collectionDelay / 60) * 100, 100) * 0.35 + inp.inventoryStagnation * 0.25))
    : 84;
  const liveStatus = liveRiskScore >= 75 ? 'حرج — يستوجب إجراءً فورياً' : liveRiskScore >= 50 ? 'تحذير — مراقبة مستمرة' : 'مستقر — وضع جيد';
  const liveStatusColor = liveRiskScore >= 75 ? '#D97706' : liveRiskScore >= 50 ? '#3B82F6' : '#10B981';

  /* Derive live risk drivers */
  const liveDrivers = inp ? [
    { driver: 'ارتفاع الرواتب',  score: inp.salaryTrend,        weight: '40%', impact: inp.salaryTrend > 60 ? 'مرتفع' : 'متوسط', action: 'مراجعة هيكل الرواتب وتحديد بنود التخفيض الممكنة' },
    { driver: 'تأخر التحصيل',    score: Math.min(Math.round((inp.collectionDelay / 60) * 100), 100), weight: '35%', impact: inp.collectionDelay > 35 ? 'مرتفع' : 'متوسط', action: 'تسريع التحصيل عبر تمويل الفواتير أو خصم الدفع المبكر' },
    { driver: 'تكدس المخزون',    score: inp.inventoryStagnation, weight: '25%', impact: inp.inventoryStagnation > 50 ? 'مرتفع' : 'متوسط', action: 'تصفية المخزون الراكد وتحريك السيولة المجمّدة' },
  ] : RISK_DRIVERS;

  /* Derive 6-month forecast */
  const liveForecast = inp ? (() => {
    const MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو'];
    const totalExp = inp.operationalExpenses + inp.monthlyRevenue * (inp.burnRate / 100);
    const collEff  = Math.max(0, 1 - inp.collectionDelay / 90);
    const inflow   = inp.monthlyRevenue * collEff;
    const net      = inflow - totalExp;
    let cash = inp.currentCash;
    return MONTHS.map((month) => {
      cash = Math.max(0, cash + net);
      const risk = Math.min(100, liveRiskScore + Math.random() * 4 - 2);
      const riskRnd = Math.round(risk);
      return {
        month: `${month} 2025`,
        revenue:  `${inp.monthlyRevenue.toFixed(1)}M`,
        expenses: `${totalExp.toFixed(1)}M`,
        net:      `${net >= 0 ? '+' : ''}${net.toFixed(2)}M`,
        cash:     `${cash.toFixed(1)}M`,
        risk:     riskRnd,
        status:   riskRnd >= 75 ? 'حرج' : riskRnd >= 50 ? 'تحذير' : 'مستقر',
      };
    });
  })() : FORECAST_TABLE;

  const handlePrint = () => window.print();

  const handleShare = async () => {
    const url  = window.location.href;
    const text = 'تقرير السيولة المالية — بصيرة AI\n\nتقرير تفصيلي لتقييم مخاطر السيولة مع توصيات تمويلية فورية.';
    if (navigator.share) {
      try { await navigator.share({ title: 'تقرير بصيرة', text, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleExport = () => {
    // Trigger browser print dialog — user can save as PDF
    handlePrint();
  };

  return (
    <AuthGuard>
      <SiteShell>
        {/* Print-specific styles */}
        <style>{`
          @media print {
            .no-print { display: none !important; }
            body, main { background: white !important; color: #0f172a !important; }
            header, footer, nav { display: none !important; }
            * { color-adjust: exact; -webkit-print-color-adjust: exact; }
            .print-page { margin: 0; padding: 0; }
            /* force dark cards to be white on print */
            [style*="background: #0F172A"],
            [style*="background: #1E293B"],
            [style*="background: linear-gradient"] {
              background: #f8fafc !important;
              border: 1px solid #e2e8f0 !important;
            }
            /* force all text visible */
            [style*="color: #F8FAFC"],
            [style*="color: #CBD5E1"],
            [style*="color: #94A3B8"] {
              color: #0f172a !important;
            }
            [style*="color: #64748B"],
            [style*="color: #475569"] {
              color: #374151 !important;
            }
          }
          @keyframes slideDown { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        `}</style>

        <main className="print-page" style={{ minHeight: '100vh', background: '#EEF2F7', padding: '28px 20px', fontFamily: "'Inter', system-ui, sans-serif" }} dir="rtl">
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {/* ── Action bar (hidden on print) ── */}
            <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', background: '#0F172A', borderRadius: '12px', padding: '14px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={14} color="#60A5FA" />
                <span style={{ color: '#F8FAFC', fontSize: '13px', fontWeight: 600 }}>تقرير السيولة الشهري · {REPORT_DATE}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '8px 16px', color: '#CBD5E1', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                  <Printer size={13} /> طباعة
                </button>
                <button onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#2563EB', border: 'none', borderRadius: '8px', padding: '8px 16px', color: 'white', fontSize: '12px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 12px rgba(37,99,235,0.35)' }}>
                  <Download size={13} /> تصدير PDF
                </button>
                <button onClick={handleShare} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.08)', border: copied ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '8px 16px', color: copied ? '#6EE7B7' : '#CBD5E1', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                  <Share2 size={13} /> {copied ? 'تم النسخ ✓' : 'مشاركة'}
                </button>
              </div>
            </div>

            {/* ══════════════════════════════════════════
                PRINTABLE REPORT STARTS HERE
                ══════════════════════════════════════════ */}
            <div ref={printRef}>

              {/* ── Cover / Header ── */}
              <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', borderRadius: '16px', padding: '40px', color: 'white', marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <div style={{ background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(37,99,235,0.4)', borderRadius: '8px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Sparkles size={11} color="#60A5FA" />
                        <span style={{ fontSize: '11px', color: '#60A5FA', fontWeight: 600 }}>مُولَّد بالذكاء الاصطناعي</span>
                      </div>
                      <span style={{ fontSize: '11px', color: '#475569' }}>{REPORT_DATE}</span>
                    </div>
                    <h1 style={{ fontSize: '30px', fontWeight: 800, letterSpacing: '-0.5px', color: '#F8FAFC', lineHeight: 1.2 }}>
                      تقرير تقييم السيولة<br />
                      <span style={{ color: '#60A5FA' }}>{companyName}</span>
                    </h1>
                    <p style={{ color: '#64748B', fontSize: '13px', marginTop: '10px' }}>مُعدّ لإدارة الشركة والمدير المالي</p>
                  </div>
                  {/* Summary score */}
                  <div style={{ textAlign: 'center', background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.3)', borderRadius: '14px', padding: '22px 28px' }}>
                    <p style={{ fontSize: '11px', color: liveStatusColor, fontWeight: 600, marginBottom: '8px', letterSpacing: '0.5px' }}>مؤشر الخطر الإجمالي</p>
                    <p style={{ fontSize: '52px', fontWeight: 900, color: '#F8FAFC', lineHeight: 1, letterSpacing: '-2px' }}>{liveRiskScore}</p>
                    <p style={{ fontSize: '11px', color: liveStatusColor, fontWeight: 700, marginTop: '4px' }}>{liveStatus}</p>
                  </div>
                </div>

                {/* KPI strip */}
                <div style={{ marginTop: '28px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                  {[
                    { label: 'الرصيد النقدي',  value: '8.2M ر.س',  sub: 'منخفض' },
                    { label: 'مدة التشغيل',    value: '92 يوم',     sub: 'ينفد سبتمبر' },
                    { label: 'وقت التحذير',    value: '18 يوم',     sub: 'قبل الأزمة' },
                    { label: 'الفجوة الشهرية', value: '-0.32M',     sub: 'خسارة صافية' },
                  ].map((k) => (
                    <div key={k.label} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '14px' }}>
                      <p style={{ fontSize: '10px', color: '#64748B', marginBottom: '6px' }}>{k.label}</p>
                      <p style={{ fontSize: '18px', fontWeight: 800, color: '#F8FAFC' }}>{k.value}</p>
                      <p style={{ fontSize: '10px', color: '#D97706', marginTop: '3px' }}>{k.sub}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Executive Summary ── */}
              <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '24px', marginBottom: '18px', boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '16px' }}>
                  <Brain size={14} color="#2563EB" />
                  <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>الملخص التنفيذي</h2>
                </div>
                <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '10px', padding: '16px', marginBottom: '14px', display: 'flex', gap: '12px' }}>
                  <AlertTriangle size={16} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ fontSize: '13px', color: '#92400E', lineHeight: 1.75, fontWeight: 500 }}>
                    يكشف محرك بصيرة للذكاء الاصطناعي عن <strong>خطر حرج</strong> في السيولة يستوجب اتخاذ إجراء خلال <strong>18 يوماً</strong>. الرصيد النقدي في مسار تنازلي بمعدل 320K ر.س شهرياً، وإذا استمر هذا المسار، ستنفد السيولة التشغيلية بحلول <strong>سبتمبر 2025</strong>.
                  </p>
                </div>
                <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.8 }}>
                  المحركات الأساسية: ارتفاع تكاليف الرواتب (+43% من التدفقات الخارجة)، وتأخر التحصيل (متوسط 52 يوماً)، وتكدس مخزون بقيمة 1.2M ر.س. التوصية العاجلة: مزيج من تمويل الفواتير (سيولة فورية) وتفاوض مع الموردين (تأجيل مدفوعات 30-45 يوماً).
                </p>
              </div>

              {/* ── Risk Drivers Table ── */}
              <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '24px', marginBottom: '18px', boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '18px' }}>
                  <TrendingDown size={14} color="#D97706" />
                  <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>تحليل عوامل الخطر</h2>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                      {['عامل الخطر', 'الدرجة', 'الوزن', 'مستوى التأثير', 'الإجراء المقترح'].map((h) => (
                        <th key={h} style={{ textAlign: 'right', padding: '10px 14px', color: '#64748B', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {liveDrivers.map((row, i) => (
                      <tr key={row.driver} style={{ borderBottom: '1px solid #F1F5F9', background: i % 2 === 0 ? '#FAFAFA' : 'white' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0F172A' }}>{row.driver}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ height: '5px', width: '60px', background: '#F1F5F9', borderRadius: '999px' }}>
                              <div style={{ height: '100%', width: `${row.score}%`, background: row.score > 70 ? '#EF4444' : row.score > 50 ? '#D97706' : '#10B981', borderRadius: '999px' }} />
                            </div>
                            <span style={{ fontWeight: 700, color: row.score > 70 ? '#EF4444' : row.score > 50 ? '#D97706' : '#10B981' }}>{row.score}</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px', color: '#64748B' }}>{row.weight}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ background: row.impact === 'مرتفع' ? '#FEF2F2' : '#FFFBEB', color: row.impact === 'مرتفع' ? '#991B1B' : '#92400E', fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '5px' }}>
                            {row.impact}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', color: '#475569', fontSize: '12px' }}>{row.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ── 6-Month Forecast Table ── */}
              <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '24px', marginBottom: '18px', boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '18px' }}>
                  <Sparkles size={14} color="#2563EB" />
                  <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>توقعات 6 أشهر القادمة</h2>
                  <span style={{ marginRight: 'auto', fontSize: '11px', color: '#2563EB', background: '#EFF6FF', padding: '3px 10px', borderRadius: '5px', fontWeight: 600 }}>محرك التنبؤ AI</span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                        {['الشهر', 'الإيرادات', 'المصروفات', 'صافي الشهر', 'الرصيد التراكمي', 'الخطر', 'الحالة'].map((h) => (
                          <th key={h} style={{ textAlign: 'center', padding: '10px 12px', color: '#64748B', fontWeight: 600, fontSize: '11px', letterSpacing: '0.4px', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {liveForecast.map((row, i) => (
                        <tr key={row.month} style={{ borderBottom: '1px solid #F1F5F9', background: i % 2 === 0 ? '#FAFAFA' : 'white' }}>
                          <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap' }}>{row.month}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'center', color: '#059669', fontWeight: 600 }}>{row.revenue}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'center', color: '#EF4444', fontWeight: 600 }}>{row.expenses}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700, color: row.net.startsWith('-') ? '#EF4444' : '#059669' }}>{row.net}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600, color: '#0F172A' }}>{row.cash}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                              <div style={{ height: '4px', width: '40px', background: '#F1F5F9', borderRadius: '999px' }}>
                                <div style={{ height: '100%', width: `${row.risk}%`, background: row.risk > 75 ? '#EF4444' : row.risk > 60 ? '#D97706' : '#10B981', borderRadius: '999px' }} />
                              </div>
                              <span style={{ fontSize: '11px', fontWeight: 700, color: row.risk > 75 ? '#EF4444' : row.risk > 60 ? '#D97706' : '#10B981' }}>{row.risk}</span>
                            </div>
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                            <span style={{ background: row.status === 'حرج' ? '#FEF2F2' : '#EFF6FF', color: row.status === 'حرج' ? '#991B1B' : '#1E40AF', fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '5px' }}>{row.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── Recommendations ── */}
              <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '24px', marginBottom: '18px', boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '18px' }}>
                  <CheckCircle2 size={14} color="#059669" />
                  <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>خطة الإجراءات المقترحة</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {RECS.map((rec) => {
                    const cfg = rec.type === 'critical'
                      ? { color: '#991B1B', bg: '#FEF2F2', border: '#FECACA', label: 'فوري' }
                      : rec.type === 'urgent'
                      ? { color: '#92400E', bg: '#FFFBEB', border: '#FDE68A', label: 'عاجل' }
                      : { color: '#1E40AF', bg: '#EFF6FF', border: '#BFDBFE', label: 'مهم' };
                    return (
                      <div key={rec.priority} style={{ display: 'flex', alignItems: 'center', gap: '14px', borderRadius: '10px', border: `1px solid ${cfg.border}`, background: cfg.bg, padding: '14px 16px' }}>
                        <div style={{ flexShrink: 0, width: '26px', height: '26px', borderRadius: '7px', background: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 800 }}>{rec.priority}</div>
                        <p style={{ flex: 1, fontSize: '13px', color: '#334155', fontWeight: 500, lineHeight: 1.6 }}>{rec.action}</p>
                        <div style={{ flexShrink: 0, textAlign: 'center' }}>
                          <span style={{ display: 'block', fontSize: '10px', color: '#94A3B8', marginBottom: '2px' }}>توفير متوقع</span>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: '#059669' }}>{rec.savings}</span>
                        </div>
                        <span style={{ flexShrink: 0, background: cfg.color, color: 'white', fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '5px' }}>{cfg.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Financing Options ── */}
              <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '24px', marginBottom: '18px', boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '18px' }}>
                  <Landmark size={14} color="#2563EB" />
                  <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>خيارات التمويل المتاحة</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  {FINANCE_OPTIONS.map((opt) => (
                    <div key={opt.name} style={{ borderRadius: '12px', padding: '18px', border: opt.best ? '2px solid #BFDBFE' : '1px solid #E2E8F0', background: opt.best ? '#F0F7FF' : '#FAFAFA', position: 'relative' }}>
                      {opt.best && (
                        <div style={{ position: 'absolute', top: '-10px', right: '14px', background: '#1E40AF', color: 'white', fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '5px' }}>الأفضل حالياً</div>
                      )}
                      <p style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>{opt.name}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {[
                          { l: 'معدل الفائدة', v: opt.rate,   vc: '#1E40AF' },
                          { l: 'مدة الحصول',  v: opt.term,   vc: '#475569' },
                          { l: 'الحد الأقصى', v: opt.amount, vc: '#059669' },
                        ].map((r) => (
                          <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '11px', color: '#94A3B8' }}>{r.l}</span>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: r.vc }}>{r.v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Report footer ── */}
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ background: '#0F172A', borderRadius: '7px', padding: '5px' }}>
                    <Sparkles size={12} color="#60A5FA" />
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>مُولَّد بواسطة بصيرة AI</p>
                    <p style={{ fontSize: '10px', color: '#94A3B8' }}>هاكاثون أمد 2026 · محرك التنبؤ المالي</p>
                  </div>
                </div>
                <p style={{ fontSize: '11px', color: '#94A3B8' }}>هذا التقرير للأغراض التوضيحية · {REPORT_DATE}</p>
              </div>

            </div>
            {/* ══════════ END PRINTABLE REPORT ══════════ */}

          </div>
        </main>
      </SiteShell>
    </AuthGuard>
  );
}
