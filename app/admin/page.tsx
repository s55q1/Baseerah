'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import {
  Activity, AlertTriangle, Bell, Building2, CheckCircle2,
  Clock, DollarSign, Settings, Shield, TrendingUp, Users, Zap,
} from 'lucide-react';
import {
  Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { SiteShell } from '@/components/site-shell';
import { AuthGuard } from '@/components/auth-guard';

const COMPANIES = [
  { name: 'مؤسسة الخليج للتجارة',    risk: 84, status: 'حرج',   runway: '18 يوم',   sector: 'تجزئة',     alert: true  },
  { name: 'شركة النجاح للمقاولات',   risk: 67, status: 'تحذير', runway: '45 يوم',   sector: 'إنشاءات',   alert: true  },
  { name: 'مجموعة الأمانة التقنية',  risk: 41, status: 'مستقر', runway: '+180 يوم', sector: 'تقنية',     alert: false },
  { name: 'مؤسسة البركة الغذائية',   risk: 72, status: 'تحذير', runway: '32 يوم',   sector: 'غذاء',      alert: true  },
  { name: 'شركة الرافدين اللوجستية', risk: 29, status: 'مستقر', runway: '+180 يوم', sector: 'لوجستيات',  alert: false },
  { name: 'مؤسسة الفجر للاستيراد',   risk: 91, status: 'حرج',   runway: '9 أيام',   sector: 'استيراد',   alert: true  },
];

const MRR_TREND = [
  { month: 'يناير', mrr: 3.8 }, { month: 'فبراير', mrr: 4.1 },
  { month: 'مارس',  mrr: 4.4 }, { month: 'أبريل',  mrr: 4.6 },
  { month: 'مايو',  mrr: 4.9 }, { month: 'يونيو',  mrr: 5.2 },
];

const ALERT_QUEUE = [
  { time: 'منذ 4 دقائق',  msg: 'تحذير حرج: مؤسسة الفجر — الرصيد ينفد خلال 9 أيام',  level: 'critical' },
  { time: 'منذ 18 دقيقة', msg: 'تحذير: مجموعة البركة — تأخر تحصيل يتجاوز 52 يوماً', level: 'warning'  },
  { time: 'منذ 1 ساعة',   msg: 'تنبيه: مؤسسة الخليج — درجة خطر ارتفعت 12 نقطة',     level: 'warning'  },
  { time: 'منذ 3 ساعات',  msg: 'تحديث: شركة الرافدين — الوضع تحسّن إلى مستقر',       level: 'stable'   },
  { time: 'منذ 5 ساعات',  msg: 'اشتراك جديد: شركة النجاح للمقاولات — خطة النمو',     level: 'info'     },
];

function Counter({ to, decimals = 0, suffix = '' }: { to: number; decimals?: number; suffix?: string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const s = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - s) / 1400, 1);
      setV(parseFloat((to * (1 - Math.pow(1 - p, 3))).toFixed(decimals)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [to, decimals]);
  return <>{v.toFixed(decimals)}{suffix}</>;
}

const statusCfg = (s: string) =>
  s === 'حرج'   ? { color: '#FCA5A5', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.25)',  dot: '#EF4444' } :
  s === 'تحذير' ? { color: '#FCD34D', bg: 'rgba(217,119,6,0.12)', border: 'rgba(217,119,6,0.25)', dot: '#D97706' } :
                  { color: '#6EE7B7', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)', dot: '#10B981' };

const alertCfg = (l: string) =>
  l === 'critical' ? { color: '#FCA5A5', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.2)',  icon: <AlertTriangle size={13} /> } :
  l === 'warning'  ? { color: '#FCD34D', bg: 'rgba(217,119,6,0.08)', border: 'rgba(217,119,6,0.2)', icon: <Bell size={13} /> } :
  l === 'stable'   ? { color: '#6EE7B7', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', icon: <CheckCircle2 size={13} /> } :
                     { color: '#93C5FD', bg: 'rgba(37,99,235,0.08)',  border: 'rgba(37,99,235,0.2)',  icon: <Zap size={13} /> };

/* shared dark card */
const card: React.CSSProperties = {
  borderRadius: '16px',
  background: '#1E293B',
  border: '1px solid rgba(255,255,255,0.06)',
  padding: '22px',
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'companies' | 'alerts'>('companies');

  return (
    <AuthGuard>
      <SiteShell>
        <main style={{ minHeight: '100vh', background: '#0F172A', padding: '28px 20px', fontFamily: "'Inter', system-ui, sans-serif" }} dir="rtl">
          <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {/* ── Header ── */}
            <header style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', borderRadius: '16px', padding: '28px 32px', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 4px 32px rgba(0,0,0,0.4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: '6px', padding: '4px 12px', marginBottom: '12px' }}>
                    <Shield size={11} color="#60A5FA" />
                    <span style={{ fontSize: '11px', color: '#60A5FA', fontWeight: 600 }}>لوحة إدارة المنصة</span>
                  </div>
                  <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.4px', lineHeight: 1.2 }}>مركز الإدارة 🛡️</h1>
                  <p style={{ color: '#475569', fontSize: '13px', marginTop: '8px' }}>أدر الحسابات، تابع صحة المنصة، وحافظ على نمو الاشتراكات من مكان واحد.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '12px', padding: '14px 20px', textAlign: 'center' }}>
                    <p style={{ fontSize: '10px', color: '#FCA5A5', fontWeight: 600, marginBottom: '4px' }}>تنبيهات نشطة</p>
                    <p style={{ fontSize: '30px', fontWeight: 900, color: '#F8FAFC', lineHeight: 1 }}>4</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px 20px', textAlign: 'center' }}>
                    <p style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, marginBottom: '4px' }}>شركات نشطة</p>
                    <p style={{ fontSize: '30px', fontWeight: 900, color: '#F8FAFC', lineHeight: 1 }}>6</p>
                  </div>
                </div>
              </div>
            </header>

            {/* ── KPI row ── */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
              {[
                { label: 'الشركات النشطة',      value: 1284, suffix: '',   trend: '+9.4%',  up: true,  accent: '#2563EB', icon: <Building2 size={15} /> },
                { label: 'الاشتراكات النشطة',   value: 863,  suffix: '',   trend: '+42%',   up: true,  accent: '#10B981', icon: <Users size={15} /> },
                { label: 'متوسط درجة المخاطر',  value: 71,   suffix: '/100', trend: 'اتجاه مستقر', up: true, accent: '#D97706', icon: <Activity size={15} /> },
                { label: 'MRR',                  value: 4.8,  suffix: 'M',  trend: '+8.3%',  up: true,  accent: '#6D28D9', icon: <DollarSign size={15} /> },
                { label: 'معدل التراجع',         value: 1.8,  suffix: '%',  trend: '-0.3%',  up: true,  accent: '#EC4899', icon: <TrendingUp size={15} /> },
              ].map((k) => (
                <div key={k.label} style={{ ...card, borderTop: `2px solid ${k.accent}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <p style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, letterSpacing: '0.4px' }}>{k.label}</p>
                    <div style={{ color: k.accent, background: k.accent + '20', borderRadius: '8px', padding: '6px' }}>{k.icon}</div>
                  </div>
                  <p style={{ fontSize: '26px', fontWeight: 700, color: '#F8FAFC', marginTop: '10px', letterSpacing: '-0.5px' }}>
                    <Counter to={k.value} decimals={k.suffix === 'M' || k.suffix === '%' ? 1 : 0} suffix={k.suffix} />
                  </p>
                  <div style={{ marginTop: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: k.up ? '#6EE7B7' : '#FCA5A5', background: k.up ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', padding: '2px 8px', borderRadius: '5px' }}>{k.trend}</span>
                  </div>
                </div>
              ))}
            </section>

            {/* ── MRR Chart + System health ── */}
            <section style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '14px' }}>
              <div style={card}>
                <div style={{ marginBottom: '18px' }}>
                  <p style={{ fontSize: '10px', color: '#475569', fontWeight: 600, letterSpacing: '0.7px', textTransform: 'uppercase' }}>الإيراد الشهري</p>
                  <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#F8FAFC', marginTop: '3px' }}>نبض الإيرادات 📈</h2>
                </div>
                <div style={{ height: '170px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MRR_TREND} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                      <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#475569' }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#475569' }} width={35} />
                      <Tooltip
                        contentStyle={{ borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', background: '#0F172A', fontSize: '12px', color: '#F8FAFC' }}
                        formatter={(v) => [`${v}M ر.س`, 'MRR']}
                      />
                      <Bar dataKey="mrr" fill="#2563EB" radius={[6, 6, 0, 0]} name="MRR" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {[
                    { label: 'MRR', value: '4.8M ر.س', color: '#2563EB' },
                    { label: 'معدل التراجع', value: '1.8%', color: '#10B981' },
                    { label: 'التوقعات', value: '+18% على أساس ربع سنوي', color: '#6D28D9' },
                  ].map((m) => (
                    <div key={m.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '10px 12px' }}>
                      <p style={{ fontSize: '10px', color: '#475569', marginBottom: '4px' }}>{m.label}</p>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: m.color }}>{m.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ ...card, background: '#0D1526', border: '1px solid rgba(37,99,235,0.15)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '18px' }}>
                  <Settings size={14} color="#60A5FA" />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#F8FAFC' }}>عمليات الفريق 👥</span>
                  <span style={{ marginRight: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', animation: 'pulse 2s infinite', display: 'inline-block' }} />
                    <span style={{ fontSize: '10px', color: '#6EE7B7', fontWeight: 600 }}>مباشر</span>
                  </span>
                </div>
                {[
                  { msg: 'تم تشغيل تنبيه جديد لـ 12 فاتورة متأخرة',  icon: '🔔', color: '#FCD34D' },
                  { msg: 'تم إرسال تذكير تجديد إلى 48 شركة',          icon: '📧', color: '#93C5FD' },
                  { msg: 'تم ترقية 3 حسابات إلى الخطة المميزة',       icon: '⭐', color: '#6EE7B7' },
                  { msg: 'تحديث محرك AI — دقة التنبؤ 92.4%',          icon: '🧠', color: '#C4B5FD' },
                ].map((op, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '11px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <span style={{ fontSize: '16px', flexShrink: 0 }}>{op.icon}</span>
                    <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.6 }}>{op.msg}</p>
                  </div>
                ))}
                <div style={{ marginTop: '16px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '10px', padding: '10px 14px' }}>
                  <p style={{ fontSize: '10px', color: '#6EE7B7', fontWeight: 600, marginBottom: '2px' }}>صحة النظام</p>
                  <p style={{ fontSize: '12px', color: '#94A3B8' }}>جميع الأنظمة تعمل — uptime 99.9%</p>
                </div>
              </div>
            </section>

            {/* ── Companies / Alerts tabs ── */}
            <div style={card}>
              {/* Tab bar */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '4px', border: '1px solid rgba(255,255,255,0.06)', width: 'fit-content' }}>
                {[
                  { key: 'companies', label: 'الشركات المشتركة', icon: <Building2 size={13} /> },
                  { key: 'alerts',    label: 'قائمة التنبيهات',  icon: <Bell size={13} /> },
                ].map((tab) => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key as 'companies' | 'alerts')} style={{
                    display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '7px', padding: '8px 16px', border: 'none', cursor: 'pointer',
                    background: activeTab === tab.key ? '#2563EB' : 'transparent',
                    color: activeTab === tab.key ? '#fff' : '#475569',
                    fontWeight: activeTab === tab.key ? 700 : 500, fontSize: '13px',
                    boxShadow: activeTab === tab.key ? '0 2px 8px rgba(37,99,235,0.4)' : 'none',
                    transition: 'all 0.2s',
                  }}>
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              {/* Companies table */}
              {activeTab === 'companies' && (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        {['الشركة', 'القطاع', 'درجة الخطر', 'مدة التشغيل', 'الحالة', 'تنبيه'].map((h) => (
                          <th key={h} style={{ textAlign: 'right', padding: '10px 14px', color: '#475569', fontWeight: 600, fontSize: '11px', letterSpacing: '0.4px', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {COMPANIES.map((co, i) => {
                        const cfg = statusCfg(co.status);
                        return (
                          <tr key={co.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent', transition: 'background 0.15s' }}>
                            <td style={{ padding: '13px 14px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: 'rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  <Building2 size={15} color="#60A5FA" />
                                </div>
                                <span style={{ fontWeight: 600, color: '#F1F5F9' }}>{co.name}</span>
                              </div>
                            </td>
                            <td style={{ padding: '13px 14px', color: '#64748B' }}>{co.sector}</td>
                            <td style={{ padding: '13px 14px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ height: '5px', width: '60px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px' }}>
                                  <div style={{ height: '100%', width: `${co.risk}%`, background: co.risk > 75 ? '#EF4444' : co.risk > 55 ? '#D97706' : '#10B981', borderRadius: '999px' }} />
                                </div>
                                <span style={{ fontWeight: 700, fontSize: '12px', color: co.risk > 75 ? '#FCA5A5' : co.risk > 55 ? '#FCD34D' : '#6EE7B7' }}>{co.risk}</span>
                              </div>
                            </td>
                            <td style={{ padding: '13px 14px', color: '#94A3B8', fontWeight: 500 }}>{co.runway}</td>
                            <td style={{ padding: '13px 14px' }}>
                              <span style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '5px' }}>{co.status}</span>
                            </td>
                            <td style={{ padding: '13px 14px' }}>
                              {co.alert
                                ? <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#FCD34D', fontSize: '11px', fontWeight: 600 }}><AlertTriangle size={12} /> نشط</span>
                                : <span style={{ color: '#334155', fontSize: '11px' }}>—</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Alert queue */}
              {activeTab === 'alerts' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {ALERT_QUEUE.map((a, i) => {
                    const cfg = alertCfg(a.level);
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '13px 16px', borderRadius: '10px', background: cfg.bg, border: `1px solid ${cfg.border}`, animation: 'slideDown 0.3s ease both', animationDelay: `${i * 50}ms` }}>
                        <div style={{ color: cfg.color, flexShrink: 0, marginTop: '2px' }}>{cfg.icon}</div>
                        <p style={{ flex: 1, fontSize: '13px', color: '#CBD5E1', lineHeight: 1.6 }}>{a.msg}</p>
                        <span style={{ flexShrink: 0, fontSize: '11px', color: '#475569', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Clock size={10} /> {a.time}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </main>
        <style>{`
          @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:0.4} }
          @keyframes slideDown { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        `}</style>
      </SiteShell>
    </AuthGuard>
  );
}
