'use client';

import Link from 'next/link';
import { ArrowRight, BarChart3, LineChart, ShieldCheck, Sparkles, TrendingUp, Wallet2 } from 'lucide-react';
import { SiteShell } from '@/components/site-shell';

const pillars = [
  { title: 'توقع نهائي للسيولة', description: 'نموذج تنبؤي يحدد فرص الأزمات قبل أن تؤثر على التدفق النقدي.', icon: Sparkles },
  { title: 'تحليلات قابلة للتفسير', description: 'تنبيه بالعوامل الحقيقية التي تؤثر على مستوى المخاطر لديك.', icon: LineChart },
  { title: 'خطة تمويل ذكية', description: 'اقتراحات أولوية لخطوط الائتمان، القروض وتمويل الفواتير.', icon: ShieldCheck },
];

const stats = [
  { label: 'دقة التنبؤ بالنقد', value: '92%' },
  { label: 'متوسط الإنذار قبل الأزمة', value: '18 يوم' },
  { label: 'حالات تخطيط نشطة', value: '1.2k+' },
];

const trustBadges = ['مُصمم لرجال الأعمال وفرق المالية', 'يفسّر لماذا يحدث الضغط النقدي', 'جاهز للعرض في اللجان والاجتماعات'];

const workflowSteps = [
  { title: 'ربط البيانات المالية', description: 'صل التدفقات، الفواتير، المصروفات والقروض في لوحة واحدة.' },
  { title: 'كشف مخاطر السيولة', description: 'رصد أوجه الضعف قبل أن تتحول إلى أزمة حقيقية.' },
  { title: 'نفّذ توصيات التمويل', description: 'اقتراح طريق تمويل مناسب بالحجم والتوقيت الصحيح.' },
];

export default function HomePage() {
  return (
    <SiteShell>
      <main className="bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_32%),linear-gradient(135deg,_#f8fafc_0%,_#eef4ff_100%)]">
        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center gap-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-100 bg-white/90 px-4 py-2 text-sm font-semibold text-brand-700 shadow-sm shadow-slate-200/50">
              <Sparkles size={16} /> منصة SaaS عربية لإدارة السيولة
            </div>
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                أول تجربة عربية لإدارة السيولة تُنقح قرارات التمويل قبل أن تترسب كأزمة.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                بصيرة تمنح فرق المالية والمؤسسين رؤية واضحة ومباشرة لمخاطر النقد، توصيات تمويل ذكية، وتحليلات جاهزة للتقرير أمام المستثمرين واللجان.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-900">
                سجّل الآن مجانًا <ArrowRight size={16} />
              </Link>
              <Link href="/login" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-400 hover:text-brand-700">
                دخول المستخدمين
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-3xl font-semibold text-slate-900">{stat.value}</p>
                  <p className="mt-2 text-sm text-slate-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
            <div className="rounded-[24px] border border-brand-100 bg-brand-50 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">عرض حي</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">لوحة الذكاء النقدي</p>
                </div>
                <div className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-danger">جاهز للعرض</div>
              </div>
              <div className="mt-7 grid gap-4">
                <div className="rounded-3xl bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>احتياطي النقد</span>
                    <span className="font-semibold text-slate-900">٨٫٢ مليون ش.س</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-slate-200">
                    <div className="h-2 rounded-full bg-brand-700" style={{ width: '72%' }} />
                  </div>
                </div>
                <div className="rounded-3xl bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>درجة المخاطر</span>
                    <span className="font-semibold text-slate-900">84 / 100</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-slate-200">
                    <div className="h-2 rounded-full bg-danger" style={{ width: '84%' }} />
                  </div>
                </div>
                <div className="rounded-3xl bg-slate-900 p-4 text-white shadow-sm">
                  <div className="flex items-center justify-between text-sm text-slate-200">
                    <span>التحليل الفوري</span>
                    <span className="font-semibold">مباشر</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">عرض تمثيلي للقرارات والتوصيات الموجهة لمؤسستك.</p>
                </div>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-brand-700">
                  <Wallet2 size={16} />
                  <p className="text-sm font-semibold">احتياطي النقد</p>
                </div>
                <p className="mt-3 text-2xl font-semibold text-slate-900">٨٫٢ مليون ش.س</p>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-brand-700">
                  <TrendingUp size={16} />
                  <p className="text-sm font-semibold">تحليل الأداء</p>
                </div>
                <p className="mt-3 text-2xl font-semibold text-slate-900">+18% فعالية قرارات التمويل</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8" id="features">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-brand-700">لماذا بصيرة؟</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">منصة عربية متكاملة لإدارة السيولة واتخاذ القرار المالي.</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {trustBadges.map((badge) => (
                  <div key={badge} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">{badge}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <article key={pillar.title} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
                    <Icon size={18} />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-slate-900">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{pillar.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-8">
            <div className="grid gap-6 lg:grid-cols-3">
              {workflowSteps.map((step, index) => (
                <div key={step.title} className="rounded-[24px] bg-white p-6 shadow-sm">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-700 text-base font-semibold text-white">{index + 1}</div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
