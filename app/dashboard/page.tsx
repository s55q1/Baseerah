'use client';

import {
  ArrowRight,
  BarChart3,
  CircleAlert,
  Clock3,
  Landmark,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wallet,
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

const forecastData = [
  { month: 'أبريل', cash: 120000, runway: 190 },
  { month: 'مايو', cash: 132000, runway: 205 },
  { month: 'يونيو', cash: 118000, runway: 180 },
  { month: 'يوليو', cash: 96000, runway: 145 },
  { month: 'أغسطس', cash: 87000, runway: 112 },
  { month: 'سبتمبر', cash: 76000, runway: 92 },
];

const riskDrivers = [
  { label: 'ارتفاع الرواتب', value: '72%', impact: 'مرتفع' },
  { label: 'تأخر التحصيل', value: '54%', impact: 'متوسط' },
  { label: 'تكدس المخزون', value: '41%', impact: 'متوسط' },
];

const recommendations = [
  'خفض المصروفات التشغيلية بنسبة 8% خلال 30 يوما',
  'تسريع تحصيل الفواتير وعرض خصم 2% للدفع المبكر',
  'استكشاف خط تمويل رأس المال العامل قبل 20 يوليو',
];

const financeOptions = [
  { name: 'خط رأس المال العامل', term: '12 أسبوعا', rate: '8.9%' },
  { name: 'قرض قصير الأجل', term: '6 أشهر', rate: '11.2%' },
  { name: 'تمويل الفواتير', term: '3 أيام', rate: '2.1%' },
];

import { AuthGuard } from '@/components/auth-guard';

export default function DashboardPage() {
  return (
    <AuthGuard>
      <SiteShell>
        <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_32%),linear-gradient(135deg,_#f8fafc_0%,_#eef4ff_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <header className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 shadow-soft backdrop-blur sm:p-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
                  <Sparkles size={16} /> ذكاء اصطناعي لقياس السيولة في الأعمال الصغيرة
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                  بصيرة تساعدك على رؤية أزمة السيولة قبل 18 يوما من وقوعها.
                </h1>
                <p className="mt-3 max-w-2xl text-base text-slate-600 sm:text-lg">
                  راقب حالة النقد، افهم ما يضغط على ميزانيتك، واحصل على إجراءات واضحة للتعامل مع التحديات قبل أن تتفاقم.
                </p>
              </div>
              <div className="rounded-2xl border border-brand-100 bg-brand-700 p-4 text-white">
                <div className="text-sm text-brand-100">تنبيه حرج</div>
                <div className="mt-1 text-3xl font-semibold">18 يوم</div>
                <div className="text-sm text-brand-100">حتى بداية الضغط على السيولة</div>
              </div>
            </div>
          </header>

          <section className="grid gap-4 lg:grid-cols-4">
            {[
              { title: 'التدفق النقدي', value: '٨.٢ مليون ش.س', delta: '+12.4%', icon: Wallet, tone: 'text-brand-700' },
              { title: 'درجة المخاطر', value: '84 / 100', delta: 'حرجة', icon: CircleAlert, tone: 'text-danger' },
              { title: 'تاريخ الأزمة', value: '20 يوليو', delta: '18 يوم', icon: Clock3, tone: 'text-warning' },
              { title: 'فترة التشغيل', value: '92 يوم', delta: 'مستقر', icon: BarChart3, tone: 'text-success' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-500">{item.title}</p>
                      <p className="mt-2 text-2xl font-semibold">{item.value}</p>
                    </div>
                    <div className={`rounded-xl bg-slate-50 p-3 ${item.tone}`}>
                      <Icon size={20} />
                    </div>
                  </div>
                  <p className="mt-4 text-sm font-medium text-slate-600">{item.delta}</p>
                </article>
              );
            })}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.55fr_0.95fr]">
            <article className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">توقعات المستقبل</p>
                  <h2 className="text-xl font-semibold">اتجاه الرصيد النقدي وفترة التشغيل</h2>
                </div>
                <div className="rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">تقدير مباشر</div>
              </div>
              <div className="mt-6 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={forecastData}>
                    <defs>
                      <linearGradient id="cash" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0A3D91" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#0A3D91" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="cash" stroke="#0A3D91" fill="url(#cash)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-2 text-brand-700">
                <Sparkles size={18} />
                <h2 className="text-xl font-semibold">الذكاء التفسيري</h2>
              </div>
              <div className="mt-4 space-y-4">
                {riskDrivers.map((driver) => (
                  <div key={driver.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-slate-800">{driver.label}</p>
                      <span className="text-sm font-semibold text-danger">{driver.value}</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-slate-200">
                      <div className="h-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-700" style={{ width: driver.value }} />
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{driver.impact} التأثير على ضغط السيولة</p>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <article className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-2">
                <TrendingDown className="text-danger" size={18} />
                <h2 className="text-xl font-semibold">الإجراءات المقترحة</h2>
              </div>
              <div className="mt-5 space-y-3">
                {recommendations.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="mt-0.5 rounded-full bg-brand-50 p-2 text-brand-700">
                      <ArrowRight size={14} />
                    </div>
                    <p className="text-sm text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-2">
                <Landmark className="text-brand-700" size={18} />
                <h2 className="text-xl font-semibold">خيارات التمويل</h2>
              </div>
              <div className="mt-5 space-y-3">
                {financeOptions.map((option) => (
                  <div key={option.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-800">{option.name}</p>
                      <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">{option.term}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">التكلفة التقديرية: {option.rate}</p>
                  </div>
                ))}
              </div>
            </article>
          </section>
        </div>
      </main>
    </SiteShell>
  </AuthGuard>
  );
}
