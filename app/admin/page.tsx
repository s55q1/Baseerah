export const dynamic = 'force-dynamic';

import { Activity, Users, Wallet2 } from 'lucide-react';
import { SiteShell } from '@/components/site-shell';

const metrics = [
  { label: 'الشركات النشطة', value: '1,284', detail: '+9.4% هذا الشهر' },
  { label: 'الاشتراكات النشطة', value: '863', detail: 'خطة النمو: 42%' },
  { label: 'متوسط درجة المخاطر', value: '71/100', detail: 'اتجاه مستقر' },
];

const recentActions = [
  'تم تشغيل تنبيه جديد لـ 12 فاتورة متأخرة',
  'تم إرسال تذكير تجديد إلى 48 شركة',
  'تم ترقية 3 حسابات إلى الخطة المميزة',
];

import { AuthGuard } from '@/components/auth-guard';

export default function AdminPage() {
  return (
    <AuthGuard>
      <SiteShell>
        <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-2 text-brand-700">
              <Activity size={18} />
              <h1 className="text-3xl font-semibold tracking-tight">مركز الإدارة</h1>
            </div>
            <p className="mt-3 max-w-2xl text-slate-600">أدر الحسابات، تابع صحة المنصة، وحافظ على نمو الاشتراكات من مكان واحد.</p>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {metrics.map((item) => (
              <article key={item.label} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</p>
                <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-brand-700" />
                <h2 className="text-xl font-semibold">عمليات الفريق</h2>
              </div>
              <div className="mt-5 space-y-3">
                {recentActions.map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">{item}</div>
                ))}
              </div>
            </article>

            <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Wallet2 size={18} className="text-success" />
                <h2 className="text-xl font-semibold">نبض الإيرادات</h2>
              </div>
              <div className="mt-5 space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <span>MRR</span>
                  <strong className="text-slate-900">٤.٨ مليون ش.س</strong>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <span>معدل التراجع</span>
                  <strong className="text-slate-900">1.8%</strong>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <span>التوقعات</span>
                  <strong className="text-slate-900">+18% على أساس ربع سنوي</strong>
                </div>
              </div>
            </article>
          </section>
        </div>
      </main>
    </SiteShell>
  </AuthGuard>
  );
}
