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

/* ── Mock data ── */
const COMPANIES = [
  { name: 'مؤسسة الخليج للتجارة',   risk: 84, status: 'حرج',   runway: '18 يوم',  sector: 'تجزئة',      alert: true  },
  { name: 'شركة النجاح للمقاولات',  risk: 67, status: 'تحذير', runway: '45 يوم',  sector: 'إنشاءات',   alert: true  },
  { name: 'مجموعة الأمانة التقنية', risk: 41, status: 'مستقر', runway: '+180 يوم', sector: 'تقنية',     alert: false },
  { name: 'مؤسسة البركة الغذائية',  risk: 72, status: 'تحذير', runway: '32 يوم',  sector: 'غذاء',       alert: true  },
  { name: 'شركة الرافدين اللوجستية',risk: 29, status: 'مستقر', runway: '+180 يوم', sector: 'لوجستيات', alert: false },
  { name: 'مؤسسة الفجر للاستيراد',  risk: 91, status: 'حرج',   runway: '9 أيام',  sector: 'استيراد',   alert: true  },
];

const MRR_TREND = [
  { month: 'يناير', mrr: 3.8 }, { month: 'فبراير', mrr: 4.1 },
  { month: 'مارس',  mrr: 4.4 }, { month: 'أبريل',  mrr: 4.6 },
  { month: 'مايو',  mrr: 4.9 }, { month: 'يونيو',  mrr: 5.2 },
];

const ALERT_QUEUE = [
  { time: 'منذ 4 دقائق',  msg: 'تحذير حرج: مؤسسة الفجر — الرصيد ينفد خلال 9 أيام',   level: 'critical' },
  { time: 'منذ 18 دقيقة', msg: 'تحذير: مجموعة البركة — تأخر تحصيل يتجاوز 52 يوماً',   level: 'warning'  },
  { time: 'منذ 1 ساعة',   msg: 'تنبيه: مؤسسة الخليج — درجة خطر ارتفعت 12 نقطة',       level: 'warning'  },
  { time: 'منذ 3 ساعات',  msg: 'تحديث: شركة الرافدين — الوضع تحسّن إلى مستقر',         level: 'stable'   },
  { time: 'منذ 5 ساعات',  msg: 'اشتراك جديد: شركة النجاح للمقاولات — خطة النمو',       level: 'info'     },
];

/* ── Counter ── */
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
  s === 'حرج'   ? { color: '#92400E', bg: '#FFFBEB', border: '#FDE68A', dot: '#D97706' } :
  s === 'تحذير' ? { color: '#1E40AF', bg: '#EFF6FF', border: '#BFDBFE', dot: '#3B82F6' } :
                  { color: '#065F46', bg: '#ECFDF5', border: '#A7F3D0', dot: '#10B981' };

const alertCfg = (l: string) =>
  l === 'critical' ? { color: '#991B1B', bg: '#FEF2F2', icon: <AlertTriangle size={12} /> } :
  l === 'warning'  ? { color: '#92400E', bg: '#FFFBEB', icon: <Bell size={12} /> } :
  l === 'stable'   ? { color: '#065F46', bg: '#ECFDF5', icon: <CheckCircle2 size={12} /> } :
                     { color: '#1E40AF', bg: '#EFF6FF', icon: <Zap size={12} /> };

const card = { borderRadius: '14px', background: '#FFF', border: '1px solid #E2E8F0', boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.05)', padding: '22px' };

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'companies' | 'alerts'>('companies');

  return (
    <AuthGuard>
      <SiteShell>
        <main style={{ minHeight: '100vh', background: '#EEF2F7', padding: '28px 20px', fontFamily: "'Inter', system-ui, sans-serif" }} dir="rtl">
          <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {/* ── Header ── */}
            <header style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', borderRadius: '16px', padding: '28px 32px', border: '1px solid rgba(255,255,255,0.04)', boxShadow: '0 4px 32px rgba(15,23,42,0.28)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: '6px', padding: '4px 12px', marginBottom: '12px' }}>
                    <Shield size={11} color="#60A5FA" />
                    <span style={{ fontSize: '11px', color: '#60A5FA', fontWeight: 600 }}>لوحة إدارة المنصة</span>
                  </div>
                  <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.4px', lineHeight: 1.2 }}>مركز إدارة بصيرة</h1>
                  <p style={{ color: '#64748B', fontSize: '13px', marginTop: '8px' }}>إشراف على جميع الشركات المشتركة والتنبيهات والأداء المالي للمنصة</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ background: 'rgba(217,119,6,0.12)', border: '1px solid rgba(217,119,6,0.3)', borderRadius: '10px', padding: '12px 18px', textAlign: 'center' }}>
                    <p style={{ fontSize: '10px', color: '#D97706', fontWeight: 600, marginBottom: '4px' }}>تنبيهات نشطة</p>
                    <p style={{ fontSize: '28px', fontWeight: 900, color: '#F8FAFC', lineHeight: 1 }}>4</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px 18px', textAlign: 'center' }}>
                    <p style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, marginBottom: '4px' }}>شركات نشطة</p>
                    <p style={{ fontSize: '28px', fontWeight: 900, color: '#F8FAFC', lineHeight: 1 }}>6</p>
                  </div>
                </div>
              </div>
            </header>

            {/* ── KPI row ── */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '14px' }}>
              {[
                { label: 'الإيراد الشهري MRR', value: 5.2, suffix: 'M', trend: '+8.3%', up: true,  accent: '#2563EB', icon: <DollarSign size={15} /> },
                { label: 'الشركات المشتركة',   value: 1284, suffix: '',   trend: '+9.4%', up: true,  accent: '#10B981', icon: <Building2 size={15} /> },
                { label: 'متوسط درجة الخطر',   value: 71,   suffix: '',   trend: '+2.1', up: false, accent: '#D97706', icon: <Activity size={15} /> },
                { label: 'التنبيهات هذا الشهر', value: 142,  suffix: '',   trend: '+18%', up: false, accent: '#EF4444', icon: <Bell size={15} /> },
                { label: 'معدل التراجع',        value: 1.8,  suffix: '%',  trend: '-0.3%', up: true, accent: '#6D28D9', icon: <TrendingUp size={15} /> },
              ].map((k) => (
                <div key={k.label} style={{ ...card, borderTop: `2px solid ${k.accent}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <p style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{k.label}</p>
                    <div style={{ color: k.accent, background: k.accent + '15', borderRadius: '7px', padding: '5px' }}>{k.icon}</div>
                  </div>
                  <p style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', marginTop: '10px', letterSpacing: '-0.5px' }}>
                    <Counter to={k.value} decimals={k.suffix === 'M' || k.suffix === '%' ? 1 : 0} suffix={k.suffix} />
                  </p>
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: k.up ? '#059669' : '#EF4444', background: k.up ? '#ECFDF5' : '#FEF2F2', padding: '2px 7px', borderRadius: '4px' }}>{k.trend}</span>
                    <span style={{ fontSize: '10px', color: '#94A3B8' }}>هذا الشهر</span>
                  </div>
                </div>
              ))}
            </section>

            {/* ── MRR Chart + System health ── */}
            <section style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '14px' }}>
              <div style={card}>
                <div style={{ marginBottom: '18px' }}>
                  <p style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.7px' }}>الإيراد الشهري</p>
                  <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginTop: '3px' }}>نمو MRR · 6 أشهر</h2>
                </div>
                <div style={{ height: '170px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MRR_TREND} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                      <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} width={35} />
                      <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '12px' }} formatter={(v) => [`${v}M ر.س`, 'MRR']} />
                      <Bar dataKey="mrr" fill="#2563EB" radius={[5, 5, 0, 0]} name="MRR" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div style={{ ...card, background: '#0F172A', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '16px' }}>
                  <Settings size={14} color="#60A5FA" />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#F8FAFC' }}>صحة المنصة</span>
                  <span style={{ marginRight: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', animation: 'pulse 2s infinite', display: 'inline-block' }} />
                    <span style={{ fontSize: '10px', color: '#6EE7B7', fontWeight: 600 }}>مباشر</span>
                  </span>
                </div>
                {[
                  { label: 'محرك التنبؤ AI',  status: 'يعمل',  val: '99.9%', color: '#10B981' },
                  { label: 'وقت الاستجابة',   status: 'طبيعي', val: '142ms', color: '#10B981' },
                  { label: 'قاعدة البيانات',  status: 'يعمل',  val: '100%',  color: '#10B981' },
                  { label: 'نظام التنبيهات', status: '4 نشط', val: 'مفعّل', color: '#D97706' },
                ].map((s) => (
                  <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.color, display: 'inline-block', flexShrink: 0 }} />
                      <span style={{ fontSize: '12px', color: '#94A3B8' }}>{s.label}</span>
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: s.color }}>{s.val}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Companies / Alerts tabs ── */}
            <div style={card}>
              {/* Tab bar */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: '#F8FAFC', borderRadius: '10px', padding: '4px', border: '1px solid #E2E8F0', width: 'fit-content' }}>
                {[
                  { key: 'companies', label: 'الشركات المشتركة', icon: <Building2 size={13} /> },
                  { key: 'alerts',    label: 'قائمة التنبيهات',  icon: <Bell size={13} /> },
                ].map((tab) => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key as 'companies' | 'alerts')} style={{ display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '7px', padding: '8px 16px', border: 'none', cursor: 'pointer', background: activeTab === tab.key ? 'white' : 'transparent', color: activeTab === tab.key ? '#0F172A' : '#64748B', fontWeight: activeTab === tab.key ? 700 : 500, fontSize: '13px', boxShadow: activeTab === tab.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s' }}>
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              {/* Companies table */}
              {activeTab === 'companies' && (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #F1F5F9' }}>
                        {['الشركة', 'القطاع', 'درجة الخطر', 'مدة التشغيل', 'الحالة', 'تنبيه'].map((h) => (
                          <th key={h} style={{ textAlign: 'right', padding: '10px 14px', color: '#64748B', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.4px', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {COMPANIES.map((co, i) => {
                        const cfg = statusCfg(co.status);
                        return (
                          <tr key={co.name} style={{ borderBottom: '1px solid #F8FAFC', background: i % 2 === 0 ? '#FAFAFA' : 'white', transition: 'background 0.15s' }}>
                            <td style={{ padding: '12px 14px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  <Building2 size={15} color="#60A5FA" />
                                </div>
                                <span style={{ fontWeight: 600, color: '#0F172A' }}>{co.name}</span>
                              </div>
                            </td>
                            <td style={{ padding: '12px 14px', color: '#64748B' }}>{co.sector}</td>
                            <td style={{ padding: '12px 14px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ height: '5px', width: '50px', background: '#F1F5F9', borderRadius: '999px' }}>
                                  <div style={{ height: '100%', width: `${co.risk}%`, background: co.risk > 75 ? '#EF4444' : co.risk > 55 ? '#D97706' : '#10B981', borderRadius: '999px' }} />
                                </div>
                                <span style={{ fontWeight: 700, fontSize: '12px', color: co.risk > 75 ? '#EF4444' : co.risk > 55 ? '#D97706' : '#10B981' }}>{co.risk}</span>
                              </div>
                            </td>
                            <td style={{ padding: '12px 14px', color: '#475569', fontWeight: 500 }}>{co.runway}</td>
                            <td style={{ padding: '12px 14px' }}>
                              <span style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '5px' }}>{co.status}</span>
                            </td>
                            <td style={{ padding: '12px 14px' }}>
                              {co.alert
                                ? <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#D97706', fontSize: '11px', fontWeight: 600 }}><AlertTriangle size={12} /> نشط</span>
                                : <span style={{ color: '#94A3B8', fontSize: '11px' }}>—</span>}
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
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '13px 16px', borderRadius: '10px', background: cfg.bg, border: `1px solid ${cfg.bg === '#FEF2F2' ? '#FECACA' : cfg.bg === '#FFFBEB' ? '#FDE68A' : cfg.bg === '#ECFDF5' ? '#A7F3D0' : '#BFDBFE'}`, animation: 'slideDown 0.3s ease both', animationDelay: `${i * 50}ms` }}>
                        <div style={{ color: cfg.color, flexShrink: 0, marginTop: '2px' }}>{cfg.icon}</div>
                        <p style={{ flex: 1, fontSize: '13px', color: '#334155', lineHeight: 1.6 }}>{a.msg}</p>
                        <span style={{ flexShrink: 0, fontSize: '11px', color: '#94A3B8', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Clock size={10} /> {a.time}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Revenue breakdown ── */}
            <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              {[
                { label: 'MRR الحالي',       value: '5.2M ر.س',   sub: '+8.3% عن الشهر السابق', color: '#2563EB', icon: <DollarSign size={15} /> },
                { label: 'معدل التراجع',     value: '1.8%',        sub: 'أقل من متوسط السوق 3.2%', color: '#10B981', icon: <TrendingUp size={15} /> },
                { label: 'التوقعات Q3',      value: '+18%',        sub: 'مبنية على نمو الاشتراكات', color: '#6D28D9', icon: <Zap size={15} /> },
              ].map((m) => (
                <div key={m.label} style={{ ...card, display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '11px', background: m.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: m.color, flexShrink: 0 }}>
                    {m.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{m.label}</p>
                    <p style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginTop: '3px', letterSpacing: '-0.3px' }}>{m.value}</p>
                    <p style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>{m.sub}</p>
                  </div>
                </div>
              ))}
            </section>

          </div>
        </main>
        <style>{`
          @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.4} }
          @keyframes slideDown{ from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        `}</style>
      </SiteShell>
    </AuthGuard>
  );
}
