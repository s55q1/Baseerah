'use client';

import { Activity, ArrowRight, BarChart3, ShieldCheck, Sparkles } from 'lucide-react';
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

const trend = [
  { month: 'يناير', cash: 180000, risk: 54 },
  { month: 'فبراير', cash: 172000, risk: 60 },
  { month: 'مارس', cash: 166000, risk: 68 },
  { month: 'أبريل', cash: 158000, risk: 74 },
  { month: 'مايو', cash: 149000, risk: 82 },
  { month: 'يونيو', cash: 138000, risk: 88 },
];

const insights = [
  'تأخر التحصيل في الذمم المدينة يرتفع بنسبة 11% شهريا',
  'تستهلك الرواتب 43% من التدفقات الخارجة أسبوعيا',
  'يبدأ المخزون في الضغط على السيولة منذ منتصف يوليو',
];

import { AuthGuard } from '@/components/auth-guard';

export default function AnalyticsPage() {
  return (
    <AuthGuard>
      <SiteShell>
        <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.1),_transparent_32%),linear-gradient(135deg,_#f8fafc_0%,_#eef4ff_100%)] px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <section className="rounded-[28px] border border-slate-200 bg-white/80 p-6 shadow-soft backdrop-blur sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
                  <Sparkles size={16} /> طبقة تحليل متقدمة
                </div>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">افهم الضغط قبل أن يصل إلى ميزانيتك.</h1>
                <p className="mt-3 max-w-2xl text-slate-600">تجمع بصيرة بين التنبؤات، سلوك الإنفاق، وتوقيت التمويل في طبقة واحدة لاتخاذ القرار.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm text-slate-500">أفق التنبؤ</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">90 يوم</p>
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">اتجاه السيولة</p>
                  <h2 className="text-xl font-semibold">الرصيد النقدي المتوقّع مقابل درجة المخاطر</h2>
                </div>
                <div className="rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">محدث كل ساعة</div>
              </div>
              <div className="mt-6 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend}>
                    <defs>
                      <linearGradient id="cash2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0A3D91" stopOpacity={0.28} />
                        <stop offset="95%" stopColor="#0A3D91" stopOpacity={0.03} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="cash" stroke="#0A3D91" fill="url(#cash2)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="rounded-[28px] border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
              <div className="flex items-center gap-2 text-brand-100">
                <Activity size={18} />
                <h2 className="text-xl font-semibold">م feed مباشر للرؤى</h2>
              </div>
              <div className="mt-5 space-y-3">
                {insights.map((insight) => (
                  <div key={insight} className="rounded-2xl border border-slate-800 bg-slate-800/70 p-3 text-sm text-slate-300">{insight}</div>
                ))}
              </div>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900">
                مراجعة الإجراءات المقترحة <ArrowRight size={16} />
              </div>
            </article>
          </section>

          <section className="grid gap-6 md:grid-cols-3">
            {[
              { title: 'احتياطي النقد', value: '١.١٤ مليون ش.س', note: 'يكفي لـ 18 يوم من التشغيل' },
              { title: 'إشارة الإجهاد', value: 'مرتفع', note: 'درجة المخاطر ترتفع أسبوعيا' },
              { title: 'جاهزية التمويل', value: 'مستعدة', note: 'الوثائق والامتداد النقدي متوافرة' },
            ].map((card) => (
              <article key={card.title} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-brand-700">
                  <BarChart3 size={16} />
                  <p className="text-sm font-semibold">{card.title}</p>
                </div>
                <p className="mt-3 text-2xl font-semibold text-slate-900">{card.value}</p>
                <p className="mt-2 text-sm text-slate-600">{card.note}</p>
              </article>
            ))}
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-brand-700">دعم القرار</p>
                <h2 className="text-2xl font-semibold">موثوق به من قادة المالية خلال الفترات المتقلبة.</h2>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-sm text-slate-600">
                <ShieldCheck size={16} className="text-success" /> آمن، قابل للتفسير، ومجهّز للمراجعة
              </div>
            </div>
          </section>
        </div>
      </main>
    </SiteShell>
  </AuthGuard>
  );
}
