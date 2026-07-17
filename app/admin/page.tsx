'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Bell, Building2, CheckCircle2, RefreshCw, Settings, Shield, Trash2, User } from 'lucide-react';
import { SiteShell } from '@/components/site-shell';
import { AuthGuard } from '@/components/auth-guard';
import { loadCompany, saveCompany, clearCompany } from '@/lib/company-store';

const SECTORS = ['تجزئة', 'إنشاءات', 'تقنية', 'غذاء وضيافة', 'لوجستيات', 'استيراد وتصدير', 'خدمات مهنية', 'صحة', 'تعليم', 'أخرى'];

export default function AdminPage() {
  const [tab, setTab]       = useState<'profile' | 'alerts' | 'data'>('profile');
  const [saved, setSaved]   = useState(false);
  const [company, setCompany] = useState<ReturnType<typeof loadCompany>>(null);

  const [name,   setName]   = useState('');
  const [sector, setSector] = useState('');
  const [size,   setSize]   = useState('');

  const [alertWhatsapp, setAlertWhatsapp] = useState(true);
  const [alertEmail,    setAlertEmail]    = useState(true);
  const [alertThreshold, setAlertThreshold] = useState(70);

  useEffect(() => {
    const c = loadCompany();
    setCompany(c);
    if (c) {
      setName(c.name ?? '');
      setSector((c as { sector?: string }).sector ?? '');
      setSize((c as { size?: string }).size ?? '');
    }
  }, []);

  const handleSave = () => {
    if (!company) return;
    saveCompany({ ...company, name });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    if (!confirm('هل أنت متأكد؟ ستُحذف جميع البيانات المدخلة.')) return;
    clearCompany();
    window.location.href = '/setup';
  };

  const card: React.CSSProperties = {
    background: '#1E293B', borderRadius: '14px',
    border: '1px solid rgba(255,255,255,0.07)',
    padding: '24px',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.05)',
    color: '#F8FAFC', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
    fontFamily: "'Inter', system-ui, sans-serif",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '12px', color: '#64748B', fontWeight: 600,
    marginBottom: '7px', display: 'block',
  };

  const tabs = [
    { key: 'profile', label: 'ملف الشركة',   icon: <Building2 size={13} /> },
    { key: 'alerts',  label: 'إعدادات التنبيهات', icon: <Bell size={13} /> },
    { key: 'data',    label: 'البيانات والخصوصية', icon: <Shield size={13} /> },
  ] as const;

  return (
    <AuthGuard>
      <SiteShell>
        <main style={{ minHeight: '100vh', background: '#0F172A', padding: '28px 20px', fontFamily: "'Inter', system-ui, sans-serif" }} dir="rtl">
          <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Settings size={18} color="#60A5FA" />
              </div>
              <div>
                <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#F8FAFC' }}>إعدادات الحساب</h1>
                <p style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>{company?.name ?? 'لا توجد بيانات مدخلة'}</p>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '5px' }}>
              {tabs.map(t => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    padding: '9px 14px', borderRadius: '9px', border: 'none', cursor: 'pointer',
                    background: tab === t.key ? '#1E293B' : 'transparent',
                    color: tab === t.key ? '#F8FAFC' : '#475569',
                    fontSize: '12px', fontWeight: tab === t.key ? 700 : 500,
                    boxShadow: tab === t.key ? '0 1px 6px rgba(0,0,0,0.3)' : 'none',
                    transition: 'all 0.2s',
                  }}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {/* ── Tab: Profile ── */}
            {tab === 'profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={card}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '20px' }}>
                    <User size={14} color="#60A5FA" />
                    <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#F8FAFC' }}>بيانات الشركة</h2>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={labelStyle}>اسم الشركة / المؤسسة</label>
                      <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} placeholder="اسم الشركة" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={labelStyle}>القطاع</label>
                        <select value={sector} onChange={e => setSector(e.target.value)}
                          style={{ ...inputStyle, cursor: 'pointer' }}>
                          <option value="" style={{ background: '#1E293B' }}>اختر...</option>
                          {SECTORS.map(s => <option key={s} value={s} style={{ background: '#1E293B' }}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>حجم الشركة</label>
                        <input value={size} onChange={e => setSize(e.target.value)} style={inputStyle} placeholder="مثال: 10-50 موظف" />
                      </div>
                    </div>
                    <button onClick={handleSave}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', background: saved ? '#10B981' : '#2563EB', border: 'none', borderRadius: '10px', padding: '12px', color: 'white', fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: 'background 0.3s' }}>
                      {saved ? <><CheckCircle2 size={14} /> تم الحفظ</> : 'حفظ التغييرات'}
                    </button>
                  </div>
                </div>

                {/* Summary card */}
                {company?.inputs && (
                  <div style={card}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '16px' }}>
                      <RefreshCw size={13} color="#60A5FA" />
                      <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#F8FAFC' }}>ملخص البيانات الحالية</h2>
                      <span style={{ marginRight: 'auto', fontSize: '11px', color: '#475569' }}>
                        آخر تحديث: {company.savedAt ? new Date(company.savedAt).toLocaleDateString('ar-SA') : '—'}
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                      {[
                        { label: 'الرصيد النقدي', value: `${Math.round(company.inputs.currentCash * 1000).toLocaleString('ar-SA')} ألف ر.س` },
                        { label: 'الإيراد الشهري', value: `${Math.round(company.inputs.monthlyRevenue * 1000).toLocaleString('ar-SA')} ألف ر.س` },
                        { label: 'المصروفات الثابتة', value: `${Math.round(company.inputs.operationalExpenses * 1000).toLocaleString('ar-SA')} ألف ر.س` },
                        { label: 'تأخر التحصيل', value: `${company.inputs.collectionDelay} يوم` },
                        { label: 'ركود المخزون', value: `${company.inputs.inventoryStagnation}%` },
                        { label: 'ضغط الرواتب', value: `${company.inputs.salaryTrend}%` },
                      ].map(k => (
                        <div key={k.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <p style={{ fontSize: '10px', color: '#64748B', marginBottom: '5px' }}>{k.label}</p>
                          <p style={{ fontSize: '14px', fontWeight: 700, color: '#F8FAFC' }}>{k.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Tab: Alerts ── */}
            {tab === 'alerts' && (
              <div style={card}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '20px' }}>
                  <Bell size={14} color="#60A5FA" />
                  <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#F8FAFC' }}>إعدادات التنبيهات</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { label: 'تنبيهات واتساب', sub: 'استقبل تحذيرات السيولة عبر واتساب', val: alertWhatsapp, set: setAlertWhatsapp },
                    { label: 'تنبيهات البريد الإلكتروني', sub: 'تقارير أسبوعية وتحذيرات فورية', val: alertEmail, set: setAlertEmail },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '14px 16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: '#F8FAFC' }}>{item.label}</p>
                        <p style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>{item.sub}</p>
                      </div>
                      <button onClick={() => item.set(!item.val)}
                        style={{ width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer', background: item.val ? '#2563EB' : '#334155', position: 'relative', transition: 'background 0.2s' }}>
                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'white', position: 'absolute', top: '3px', transition: 'right 0.2s', right: item.val ? '3px' : '23px' }} />
                      </button>
                    </div>
                  ))}

                  <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#F8FAFC' }}>عتبة التنبيه</p>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#60A5FA' }}>{alertThreshold}%</span>
                    </div>
                    <p style={{ fontSize: '11px', color: '#475569', marginBottom: '10px' }}>أرسل تنبيهاً عندما تتجاوز درجة الخطر هذه القيمة</p>
                    <input type="range" min="30" max="90" value={alertThreshold}
                      onChange={e => setAlertThreshold(parseInt(e.target.value))}
                      style={{ width: '100%', accentColor: '#2563EB' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#334155', marginTop: '4px' }}>
                      <span>30% تبكير</span><span>90% حرج فقط</span>
                    </div>
                  </div>

                  <button style={{ background: '#2563EB', border: 'none', borderRadius: '10px', padding: '12px', color: 'white', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                    حفظ إعدادات التنبيهات
                  </button>
                </div>
              </div>
            )}

            {/* ── Tab: Data & Privacy ── */}
            {tab === 'data' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={card}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '16px' }}>
                    <Shield size={14} color="#10B981" />
                    <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#F8FAFC' }}>الخصوصية والأمان</h2>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { icon: '🔒', title: 'بياناتك على جهازك فقط', desc: 'لا تُرسل أي بيانات مالية لأي خادم خارجي' },
                      { icon: '🛡️', title: 'تشفير محلي', desc: 'البيانات مخزنة في localStorage مشفرة' },
                      { icon: '👁️', title: 'لا مشاركة مع أطراف ثالثة', desc: 'بيانات شركتك لن تُشارك مع أي جهة' },
                    ].map(item => (
                      <div key={item.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.12)', borderRadius: '10px', padding: '14px' }}>
                        <span style={{ fontSize: '20px', flexShrink: 0 }}>{item.icon}</span>
                        <div>
                          <p style={{ fontSize: '13px', fontWeight: 600, color: '#F8FAFC' }}>{item.title}</p>
                          <p style={{ fontSize: '11px', color: '#475569', marginTop: '3px' }}>{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ ...card, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '12px' }}>
                    <Trash2 size={14} color="#EF4444" />
                    <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#FCA5A5' }}>حذف البيانات</h2>
                  </div>
                  <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '16px', lineHeight: 1.6 }}>
                    حذف جميع بيانات شركتك من الجهاز وإعادة التوجيه لصفحة الإعداد. لا يمكن التراجع عن هذا الإجراء.
                  </p>
                  <button onClick={handleReset}
                    style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '11px 18px', color: '#FCA5A5', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                    <Trash2 size={13} /> حذف جميع البيانات
                  </button>
                </div>
              </div>
            )}

          </div>
        </main>
      </SiteShell>
    </AuthGuard>
  );
}
