'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  Brain,
  CircleAlert,
  Clock3,
  Landmark,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wallet,
  Zap,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { SiteShell } from '@/components/site-shell';
import { AuthGuard } from '@/components/auth-guard';

/* ── Count-up hook ─────────────────────────────────── */
function useCountUp(target: number, duration = 1600, delay = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setValue(Math.round(target * ease));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);
  return value;
}

/* ── بيانات ────────────────────────────────────────── */
const forecastData = [
  { month: 'أبريل', cash: 120000, runway: 190 },
  { month: 'مايو',  cash: 132000, runway: 205 },
  { month: 'يونيو', cash: 118000, runway: 180 },
  { month: 'يوليو', cash: 96000,  runway: 145 },
  { month: 'أغسطس', cash: 87000,  runway: 112 },
  { month: 'سبتمبر',cash: 76000,  runway: 92  },
];

const riskDrivers = [
  { label: 'ارتفاع الرواتب',  value: 72, color: 'from-red-500 to-red-600' },
  { label: 'تأخر التحصيل',    value: 54, color: 'from-orange-400 to-orange-500' },
  { label: 'تكدس المخزون',    value: 41, color: 'from-yellow-400 to-yellow-500' },
];

const recommendations = [
  { text: 'خفض المصروفات التشغيلية بنسبة 8% خلال 30 يوماً', urgency: 'عاجل',       urgencyColor: '#b91c1c', urgencyBg: '#fef2f2' },
  { text: 'تسريع تحصيل الفواتير وعرض خصم 2% للدفع المبكر',  urgency: 'مهم',        urgencyColor: '#c2410c', urgencyBg: '#fff7ed' },
  { text: 'استكشاف خط تمويل رأس المال العامل قبل 20 يوليو',  urgency: 'استراتيجي', urgencyColor: '#1d4ed8', urgencyBg: '#eff6ff' },
];

const financeOptions = [
  { name: 'خط رأس المال العامل', term: '12 أسبوعاً', rate: '8.9%',  recommended: true  },
  { name: 'قرض قصير الأجل',      term: '6 أشهر',    rate: '11.2%', recommended: false },
  { name: 'تمويل الفواتير',       term: '3 أيام',    rate: '2.1%',  recommended: false },
];

const liveInsights = [
  '⚡ تم رصد ارتفاع في فواتير الموردين بنسبة 14% هذا الأسبوع',
  '📊 الرواتب ستستهلك 43% من السيولة في الدورة القادمة',
  '🔔 3 فواتير متأخرة تجاوزت 30 يوم — يُنصح بالمتابعة الفورية',
  '📈 مؤشر السيولة انخفض 6 نقاط منذ الأسبوع الماضي',
  '💡 التمويل عبر الفواتير متاح بمعدل 2.1% — الأقل تكلفةً حالياً',
];

/* ── مقياس المخاطر SVG ─────────────────────────────── */
function RiskGauge({ score }: { score: number }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1600, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplayed(Math.round(score * ease));
      if (p < 1) requestAnimationFrame(tick);
    };
    const id = setTimeout(() => requestAnimationFrame(tick), 300);
    return () => clearTimeout(id);
  }, [score]);

  const r = 52;
  const circumference = 2 * Math.PI * r;
  const dash = (displayed / 100) * circumference;
  const color = '#EF4444';

  return (
    <svg width="130" height="130" viewBox="0 0 130 130" className="mx-auto">
      <circle cx="65" cy="65" r={r} fill="none" stroke="#f1f5f9" strokeWidth="10" />
      <circle
        cx="65" cy="65" r={r} fill="none"
        stroke={color} strokeWidth="10"
        strokeDasharray={`${dash} ${circumference}`}
        strokeLinecap="round"
        transform="rotate(-90 65 65)"
        style={{ filter: `drop-shadow(0 0 8px ${color}80)`, transition: 'stroke-dasharray 0.05s linear' }}
      />
      <text x="65" y="60" textAnchor="middle" fill="#0f172a" fontSize="28" fontWeight="800">{displayed}</text>
      <text x="65" y="78" textAnchor="middle" fill="#94a3b8" fontSize="11">/100</text>
    </svg>
  );
}

/* ── شريط الأخبار المتحرك ──────────────────────────── */
function LiveTicker() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % liveInsights.length);
        setVisible(true);
      }, 400);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #020B1E, #031430)',
      borderRadius: '14px', padding: '12px 18px',
      display: 'flex', alignItems: 'center', gap: '12px',
      marginBottom: '4px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: '#22c55e',
          boxShadow: '0 0 8px #22c55e',
          animation: 'livePulse 1.5s infinite',
        }} />
        <span style={{ color: '#4ade80', fontSize: '11px', fontWeight: 700, letterSpacing: '1px' }}>LIVE</span>
      </div>
      <span style={{
        color: '#cbd5e1', fontSize: '13px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(6px)',
        transition: 'opacity 0.4s, transform 0.4s',
        flex: 1,
      }}>
        {liveInsights[index]}
      </span>
    </div>
  );
}

/* ── AnimatedBar ───────────────────────────────────── */
function AnimatedBar({ value, color, delay }: { value: number; color: string; delay: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return (
    <div style={{ height: '6px', borderRadius: '999px', background: '#f1f5f9', overflow: 'hidden' }}>
      <div style={{
        height: '100%', borderRadius: '999px',
        background: `linear-gradient(90deg, ${color})`,
        width: `${width}%`,
        transition: 'width 1.2s cubic-bezier(0.22,1,0.36,1)',
      }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   الصفحة الرئيسية
══════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const cash    = useCountUp(820,  1800, 200);
  const risk    = useCountUp(84,   1600, 300);
  const days    = useCountUp(18,   1200, 100);
  const runway  = useCountUp(92,   1400, 400);

  return (
    <AuthGuard>
      <SiteShell>
        <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '32px 16px' }} dir="rtl">
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* ── شريط LIVE ── */}
            <LiveTicker />

            {/* ── الهيدر الداكن ── */}
            <header style={{
              position: 'relative', overflow: 'hidden',
              borderRadius: '24px',
              background: 'linear-gradient(145deg, #010C1F 0%, #031430 60%, #020B1E 100%)',
              padding: '32px', color: 'white',
              boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
            }}>
              <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(30,80,200,0.18), transparent 70%)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: '-60px', right: '5%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,180,220,0.10), transparent 70%)', pointerEvents: 'none' }} />

              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', borderRadius: '999px', border: '1px solid rgba(91,141,238,0.3)', background: 'rgba(91,141,238,0.1)', padding: '5px 14px', color: '#7ba7f5', fontSize: '12px', marginBottom: '16px' }}>
                    <Brain size={12} /> ذكاء اصطناعي · يتجدد كل 24 ساعة
                  </div>
                  <h1 style={{ fontSize: '36px', fontWeight: 900, lineHeight: 1.15, letterSpacing: '-0.5px' }}>
                    بصيرة تساعدك على رؤية<br />
                    <span style={{ background: 'linear-gradient(90deg, #60c8ff, #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      أزمة السيولة قبل {days} يوماً
                    </span>
                  </h1>
                  <p style={{ color: '#7d95b5', fontSize: '14px', marginTop: '12px', maxWidth: '480px', lineHeight: 1.7 }}>
                    راقب حالة النقد، افهم ما يضغط على ميزانيتك، واحصل على إجراءات واضحة قبل أن تتفاقم.
                  </p>
                </div>

                {/* بطاقة التنبيه */}
                <div style={{
                  borderRadius: '18px', border: '1px solid rgba(239,68,68,0.3)',
                  background: 'rgba(239,68,68,0.08)', padding: '20px 28px', textAlign: 'center',
                  minWidth: '160px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#f87171', fontSize: '11px', fontWeight: 700, marginBottom: '8px' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ef4444', animation: 'livePulse 1.2s infinite' }} />
                    تنبيه حرج
                  </div>
                  <div style={{ fontSize: '52px', fontWeight: 900, color: 'white', lineHeight: 1 }}>{days}</div>
                  <div style={{ color: '#fca5a5', fontSize: '13px', marginTop: '6px' }}>يوم حتى الأزمة</div>
                  <div style={{ marginTop: '12px', height: '4px', borderRadius: '999px', background: 'rgba(239,68,68,0.2)' }}>
                    <div style={{ height: '100%', width: '30%', borderRadius: '999px', background: 'linear-gradient(90deg, #f87171, #ef4444)', animation: 'livePulse 2s infinite' }} />
                  </div>
                </div>
              </div>
            </header>

            {/* ── بطاقات KPI ── */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
              {[
                { title: 'التدفق النقدي', value: `${cash / 10 >= 10 ? (cash / 10).toFixed(1) : cash}`, unit: 'مليون ر.س', badge: '+12.4%', badgeColor: '#166534', badgeBg: '#f0fdf4', borderColor: '#3b82f6', icon: <Wallet size={18} />, iconBg: '#dbeafe', iconColor: '#1d4ed8' },
                { title: 'درجة المخاطر AI', value: `${risk}`, unit: '/ 100', badge: 'حرج', badgeColor: '#991b1b', badgeBg: '#fef2f2', borderColor: '#ef4444', icon: <CircleAlert size={18} />, iconBg: '#fee2e2', iconColor: '#dc2626' },
                { title: 'تاريخ الأزمة', value: '20 يوليو', unit: `بعد ${days} يوم`, badge: 'قريب', badgeColor: '#9a3412', badgeBg: '#fff7ed', borderColor: '#f97316', icon: <Clock3 size={18} />, iconBg: '#ffedd5', iconColor: '#ea580c' },
                { title: 'فترة التشغيل', value: `${runway}`, unit: 'يوم', badge: 'مستقر', badgeColor: '#166534', badgeBg: '#f0fdf4', borderColor: '#22c55e', icon: <BarChart3 size={18} />, iconBg: '#dcfce7', iconColor: '#16a34a' },
              ].map((item) => (
                <div key={item.title} style={{
                  borderRadius: '18px', background: 'white',
                  border: '1px solid #e2e8f0', borderTop: `4px solid ${item.borderColor}`,
                  padding: '20px', boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.title}</p>
                      <p style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', marginTop: '8px', letterSpacing: '-0.5px' }}>{item.value}</p>
                      <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{item.unit}</p>
                    </div>
                    <div style={{ background: item.iconBg, color: item.iconColor, borderRadius: '12px', padding: '10px' }}>
                      {item.icon}
                    </div>
                  </div>
                  <div style={{ marginTop: '14px' }}>
                    <span style={{ background: item.badgeBg, color: item.badgeColor, fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '999px' }}>
                      {item.badge}
                    </span>
                  </div>
                </div>
              ))}
            </section>

            {/* ── الرسم البياني + مقياس المخاطر ── */}
            <section style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '16px' }}>
              <div style={{ borderRadius: '20px', background: 'white', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>توقعات مستقبلية</p>
                    <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>اتجاه الرصيد النقدي · 6 أشهر</h2>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#eff6ff', borderRadius: '999px', padding: '5px 12px', fontSize: '11px', color: '#0A3D91', fontWeight: 700 }}>
                    <Zap size={11} /> مباشر
                  </div>
                </div>
                <div style={{ height: '220px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={forecastData}>
                      <defs>
                        <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0A3D91" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#0A3D91" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                      <Area type="monotone" dataKey="cash" stroke="#0A3D91" fill="url(#cashGrad)" strokeWidth={2.5} animationDuration={2000} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* مقياس المخاطر */}
              <div style={{ borderRadius: '20px', background: 'white', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Sparkles size={15} color="#0A3D91" />
                  <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>AI Risk Score</h2>
                </div>
                <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '16px' }}>مؤشر المخاطر بالذكاء الاصطناعي</p>
                <RiskGauge score={84} />
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {riskDrivers.map((d, i) => (
                    <div key={d.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>{d.label}</span>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>{d.value}%</span>
                      </div>
                      <AnimatedBar value={d.value} color={d.color.replace('from-', '').replace(' to-', ', ')} delay={600 + i * 200} />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── التوصيات + التمويل ── */}
            <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ borderRadius: '20px', background: 'white', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
                  <TrendingDown size={15} color="#ef4444" />
                  <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>الإجراءات المقترحة</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {recommendations.map((item, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '12px',
                      borderRadius: '14px', border: '1px solid #f1f5f9', background: '#f8fafc', padding: '14px',
                    }}>
                      <div style={{ flexShrink: 0, width: '26px', height: '26px', borderRadius: '8px', background: '#0A3D91', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 800 }}>
                        {i + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6 }}>{item.text}</p>
                      </div>
                      <span style={{ flexShrink: 0, background: item.urgencyBg, color: item.urgencyColor, fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '999px' }}>
                        {item.urgency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ borderRadius: '20px', background: 'white', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
                  <Landmark size={15} color="#0A3D91" />
                  <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>خيارات التمويل</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {financeOptions.map((option) => (
                    <div key={option.name} style={{
                      borderRadius: '14px', padding: '14px',
                      border: option.recommended ? '1px solid #bfdbfe' : '1px solid #f1f5f9',
                      background: option.recommended ? 'linear-gradient(135deg, #eff6ff, #f0f9ff)' : '#f8fafc',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{option.name}</p>
                          {option.recommended && (
                            <span style={{ background: '#0A3D91', color: 'white', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '999px' }}>الأفضل</span>
                          )}
                        </div>
                        <span style={{ fontSize: '11px', color: '#64748b', background: 'white', border: '1px solid #e2e8f0', borderRadius: '999px', padding: '2px 10px' }}>{option.term}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>معدل الفائدة</span>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#0A3D91' }}>{option.rate}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button style={{
                  marginTop: '14px', width: '100%', borderRadius: '14px',
                  background: 'linear-gradient(135deg, #1a56db, #0A3D91)',
                  padding: '13px', fontSize: '13px', fontWeight: 800, color: 'white',
                  border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: '0 4px 16px rgba(10,61,145,0.25)',
                }}>
                  <TrendingUp size={14} /> طلب تمويل الآن <ArrowLeft size={13} />
                </button>
              </div>
            </section>

          </div>
        </main>

        <style>{`
          @keyframes livePulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50%       { opacity: 0.5; transform: scale(0.85); }
          }
        `}</style>
      </SiteShell>
    </AuthGuard>
  );
}
