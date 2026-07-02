import { FileText, LineChart, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { SiteShell } from '@/components/site-shell';

const reportHighlights = [
  { label: 'الجدول الزمني للمخاطر', value: 'نافذة حرجة تبدأ في 20 يوليو' },
  { label: 'فترة التشغيل النقدي', value: '92 يوم مع المعدل الحالي للاستهلاك' },
  { label: 'ملخص تنفيذي', value: 'الرواتب وتأخر التحصيل هي المحركات الأساسية' },
];

import { AuthGuard } from '@/components/auth-guard';

export default function ReportsPage() {
  return (
    <AuthGuard>
      <SiteShell>
        <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
                  <FileText size={16} /> تقرير شهري ذكي
                </div>
                <h1 className="text-3xl font-semibold tracking-tight">تقارير احترافية للوحة الإدارة والفريق المالي.</h1>
                <p className="mt-3 max-w-2xl text-slate-600">صدّر مستندات جاهزة مع تفسير الذكاء الاصطناعي والتنبؤات وتوصيات التمويل.</p>
              </div>
              <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white">
                عرض لوحة التحكم <Sparkles size={16} />
              </Link>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-brand-700">
                <LineChart size={18} />
                <h2 className="text-xl font-semibold">ما الذي يحتويه التقرير</h2>
              </div>
              <div className="mt-5 space-y-4">
                {reportHighlights.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.value}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[28px] border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
              <div className="flex items-center gap-2 text-brand-100">
                <ShieldCheck size={18} />
                <h2 className="text-xl font-semibold">جاهز للتصدير بصيغة PDF</h2>
              </div>
              <p className="mt-3 text-sm text-slate-300">أنشئ حزمة جاهزة للجان الإدارة بنسخة واحدة تشمل إجراءات توفير، وأسباب المخاطر، وتوصيات التمويل.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900">تصدير PDF</button>
                <button className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100">مشاركة مع المدير المالي</button>
              </div>
            </article>
          </section>
        </div>
      </main>
    </SiteShell>
  </AuthGuard>
  );
}
