'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

const links = [
  { href: '/', label: 'الرئيسية' },
  { href: '/dashboard', label: 'لوحة التحكم' },
  { href: '/analytics', label: 'التحليلات' },
  { href: '/reports', label: 'التقارير' },
  { href: '/admin', label: 'الإدارة' },
  { href: '/signup', label: 'تسجيل' },
  { href: '/login', label: 'دخول' },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-700 p-2.5 text-white">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight">بصيرة</p>
              <p className="text-sm text-slate-500">ذكاء السيولة للأعمال</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition ${active ? 'text-brand-700' : 'text-slate-600 hover:text-brand-700'}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-900">
            ابدأ الآن <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-slate-200/80 bg-white/70 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 rounded-[24px] border border-slate-200 bg-slate-50 p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-700 p-2 text-white">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="font-semibold">مُصمم للشركات الصغيرة والمتوسطة الطموحة</p>
              <p className="text-sm text-slate-600">مراقبة السيولة بالذكاء الاصطناعي وتوجيهات تمويل ذكية.</p>
            </div>
          </div>
          <p className="text-sm text-slate-500">بصيرة © 2026 · نموذج قابل للعروض والهاكاثون</p>
        </div>
      </footer>
    </div>
  );
}
