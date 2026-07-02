'use client';

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

const forecastData = [
  { month: 'أبريل', cash: 120000, runway: 190 },
  { month: 'مايو', cash: 132000, runway: 205 },
  { month: 'يونيو', cash: 118000, runway: 180 },
  { month: 'يوليو', cash: 96000, runway: 145 },
  { month: 'أغسطس', cash: 87000, runway: 112 },
  { month: 'سبتمبر', cash: 76000, runway: 92 },
];

const riskDrivers = [
  { label: 'ارتفاع الرواتب', value: 72, impact: 'مرتفع', color: 'from-red-500 to-red-600' },
  { label: 'تأخر التحصيل', value: 54, impact: 'متوسط', color: 'from-orange-400 to-orange-500' },
  { label: 'تكدس المخزون', value: 41, impact: 'متوسط', color: 'from-yellow-400 to-yellow-500' },
];

const recommendations = [
  { text: 'خفض المصروفات التشغيلية بنسبة 8% خلال 30 يوما', urgency: 'عاجل' },
  { text: 'تسريع تحصيل الفواتير وعرض خصم 2% للدفع المبكر', urgency: 'مهم' },
  { text: 'استكشاف خط تمويل رأس المال العامل قبل 20 يوليو', urgency: 'استراتيجي' },
];

const financeOptions = [
  { name: 'خط رأس المال العامل', term: '12 أسبوعا', rate: '8.9%', recommended: true },
  { name: 'قرض قصير الأجل', term: '6 أشهر', rate: '11.2%', recommended: false },
  { name: 'تمويل الفواتير', term: '3 أيام', rate: '2.1%', recommended: false },
];

function RiskGauge({ score }: { score: number }) {
  const r = 52;
  const circumference = 2 * Math.PI * r;
  const dash = (score / 100) * circumference;
  const color = score >= 75 ? '#EF4444' : score >= 50 ? '#F59E0B' : '#22C55E';
  return (
    <svg width="130" height="130" viewBox="0 0 130 130" className="mx-auto">
      <circle cx="65" cy="65" r={r} fill="none" stroke="#f1f5f9" strokeWidth="10" />
      <circle
        cx="65" cy="65" r={r}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeDasharray={`${dash} ${circumference}`}
        strokeLinecap="round"
        transform="rotate(-90 65 65)"
        style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
      />
      <text x="65" y="60" textAnchor="middle" fill="#0f172a" fontSize="28" fontWeight="800">{score}</text>
      <text x="65" y="78" textAnchor="middle" fill="#94a3b8" fontSize="11">/100</text>
    </svg>
  );
}

const urgencyStyle: Record<string, string> = {
  'عاجل': 'bg-red-100 text-red-700',
  'مهم': 'bg-orange-100 text-orange-700',
  'استراتيجي': 'bg-blue-100 text-blue-700',
};

export default function DashboardPage() {
  return (
    <AuthGuard>
      <SiteShell>
        <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8" dir="rtl">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">

            {/* ===== الهيدر ===== */}
            <header className="relative overflow-hidden rounded-[28px] bg-[#020B1E] p-6 sm:p-8 text-white shadow-xl">
              <div className="absolute top-0 left-0 w-[400px] h-[300px] rounded-full bg-blue-600/15 blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none" />

              <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs text-blue-300 mb-4">
                    <Brain size={12} /> ذكاء اصطناعي لقياس السيولة · يتجدد كل 24 ساعة
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl leading-tight">
                    بصيرة تساعدك على رؤية<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-l from-cyan-300 to-blue-400">
                      أزمة السيولة قبل 18 يوماً
                    </span>
                  </h1>
                  <p className="mt-3 max-w-xl text-slate-400 text-sm leading-relaxed">
                    راقب حالة النقد، افهم ما يضغط على ميزانيتك، واحصل على إجراءات واضحة قبل أن تتفاقم.
                  </p>
                </div>

                {/* بطاقة التنبيه */}
                <div className="flex-shrink-0 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-center backdrop-blur-sm">
                  <div className="flex items-center justify-center gap-2 text-red-400 text-xs font-medium mb-2">
                    <CircleAlert size={13} /> تنبيه حرج
                  </div>
                  <div className="text-5xl font-black text-white">18</div>
                  <div className="text-red-300 text-sm mt-1">يوم حتى بداية الضغط</div>
                  <div className="mt-3 h-1.5 w-full rounded-full bg-red-900/50">
                    <div className="h-1.5 w-[30%] rounded-full bg-gradient-to-r from-red-400 to-red-600 animate-pulse" />
                  </div>
                </div>
              </div>
            </header>

            {/* ===== بطاقات KPI ===== */}
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: 'التدفق النقدي',
                  value: '٨.٢ مليون',
                  sub: 'ريال سعودي',
                  delta: '+12.4%',
                  deltaColor: 'text-green-600 bg-green-50',
                  icon: Wallet,
                  iconBg: 'bg-blue-100 text-blue-700',
                  border: 'border-t-blue-500',
                },
                {
                  title: 'درجة المخاطر AI',
                  value: '84 / 100',
                  sub: 'مستوى حرج',
                  delta: 'خطر',
                  deltaColor: 'text-red-600 bg-red-50',
                  icon: CircleAlert,
                  iconBg: 'bg-red-100 text-red-600',
                  border: 'border-t-red-500',
                },
                {
                  title: 'تاريخ الأزمة',
                  value: '20 يوليو',
                  sub: 'بعد 18 يوم',
                  delta: 'قريب',
                  deltaColor: 'text-orange-600 bg-orange-50',
                  icon: Clock3,
                  iconBg: 'bg-orange-100 text-orange-600',
                  border: 'border-t-orange-500',
                },
                {
                  title: 'فترة التشغيل',
                  value: '92 يوم',
                  sub: 'runway',
                  delta: 'مستقر',
                  deltaColor: 'text-green-600 bg-green-50',
                  icon: BarChart3,
                  iconBg: 'bg-green-100 text-green-600',
                  border: 'border-t-green-500',
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className={`rounded-[20px] border border-slate-200 border-t-4 ${item.border} bg-white p-5 shadow-sm`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{item.title}</p>
                        <p className="mt-2 text-2xl font-bold text-slate-900">{item.value}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
                      </div>
                      <div className={`rounded-xl p-2.5 ${item.iconBg}`}>
                        <Icon size={18} />
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${item.deltaColor}`}>
                        {item.delta}
                      </span>
                    </div>
                  </article>
                );
              })}
            </section>

            {/* ===== الرسم البياني + الذكاء التفسيري ===== */}
            <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
              <article className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">توقعات مستقبلية</p>
                    <h2 className="text-lg font-bold text-slate-900 mt-0.5">اتجاه الرصيد النقدي · 6 أشهر</h2>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                    <Zap size={11} /> مباشر
                  </div>
                </div>
                <div className="h-64">
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
                      <Tooltip
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="cash"
                        stroke="#0A3D91"
                        fill="url(#cashGrad)"
                        strokeWidth={2.5}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </article>

              {/* مقياس المخاطر */}
              <article className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-brand-700" />
                  <h2 className="text-lg font-bold text-slate-900">AI Risk Score</h2>
                </div>
                <p className="text-xs text-slate-400 mb-5">مؤشر المخاطر المحسوب بالذكاء الاصطناعي</p>

                <RiskGauge score={84} />

                <div className="mt-5 space-y-3">
                  {riskDrivers.map((driver) => (
                    <div key={driver.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-slate-700">{driver.label}</span>
                        <span className="text-xs font-bold text-slate-900">{driver.value}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-100">
                        <div
                          className={`h-1.5 rounded-full bg-gradient-to-r ${driver.color} transition-all`}
                          style={{ width: `${driver.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            {/* ===== التوصيات + خيارات التمويل ===== */}
            <section className="grid gap-6 xl:grid-cols-2">
              <article className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <TrendingDown size={16} className="text-red-500" />
                  <h2 className="text-lg font-bold text-slate-900">الإجراءات المقترحة</h2>
                </div>
                <div className="space-y-3">
                  {recommendations.map((item, i) => (
                    <div
                      key={item.text}
                      className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 hover:bg-slate-100 transition"
                    >
                      <div className="flex-shrink-0 rounded-xl bg-brand-700 w-7 h-7 flex items-center justify-center text-white text-xs font-bold">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-800 leading-relaxed">{item.text}</p>
                      </div>
                      <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${urgencyStyle[item.urgency]}`}>
                        {item.urgency}
                      </span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <Landmark size={16} className="text-brand-700" />
                  <h2 className="text-lg font-bold text-slate-900">خيارات التمويل المقترحة</h2>
                </div>
                <div className="space-y-3">
                  {financeOptions.map((option) => (
                    <div
                      key={option.name}
                      className={`rounded-2xl border p-4 transition ${
                        option.recommended
                          ? 'border-brand-200 bg-gradient-to-l from-brand-50 to-blue-50'
                          : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-900 text-sm">{option.name}</p>
                          {option.recommended && (
                            <span className="rounded-full bg-brand-700 px-2 py-0.5 text-xs font-bold text-white">
                              الأفضل
                            </span>
                          )}
                        </div>
                        <span className="rounded-full bg-white border border-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                          {option.term}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-xs text-slate-500">معدل الفائدة</p>
                        <p className="text-sm font-bold text-brand-700">{option.rate}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-4 w-full rounded-2xl bg-brand-700 py-3 text-sm font-bold text-white flex items-center justify-center gap-2 hover:bg-brand-900 transition shadow-lg shadow-blue-900/15">
                  <TrendingUp size={15} /> طلب تمويل الآن
                  <ArrowLeft size={14} />
                </button>
              </article>
            </section>

          </div>
        </main>
      </SiteShell>
    </AuthGuard>
  );
}
