'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight, ShieldCheck, UserPlus } from 'lucide-react';
import { SiteShell } from '@/components/site-shell';
import { supabase } from '@/lib/supabase';

export default function SignupPage() {
  const router = useRouter();
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          company,
        },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message || 'حاول مرة أخرى لاحقًا');
      return;
    }

    setMessage('تم إنشاء الحساب! تحقق من بريدك لتأكيد الحساب، ثم سجل الدخول.');
    setEmail('');
    setPassword('');
    setCompany('');
    router.push('/login');
  };

  return (
    <SiteShell>
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_32%),linear-gradient(135deg,_#f8fafc_0%,_#eef4ff_100%)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft sm:p-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">ابدأ الآن</p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">إنشاء حساب بصيرة العربية</h1>
              <p className="mt-4 text-slate-600">سجل لتجربة الأداة الكاملة، تحضير العرض، واستعراض مؤشرات السيولة الحقيقية أمام اللجنة.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
              <UserPlus size={16} /> تسجيل سريع
            </div>
          </div>

          <div className="mt-10 grid gap-6">
            <form onSubmit={handleSubmit} className="grid gap-4">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                اسم الشركة
                <input
                  type="text"
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  placeholder="مثال: التجارة الذكية"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                البريد الإلكتروني
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="example@baseerah.ai"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                كلمة المرور
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  required
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-900 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading ? 'جاري إنشاء الحساب...' : 'أنشئ حسابك الآن'}
                <ArrowRight size={16} />
              </button>
            </form>

            {message ? <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">{message}</div> : null}
            {error ? <div className="rounded-2xl border border-danger/20 bg-danger/10 p-4 text-sm text-danger">{error}</div> : null}

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">ماذا بعد؟</p>
              <p className="mt-2">بعد التسجيل، ستتمكن من الدخول إلى صفحة لوحة التحكم، تحميل تقارير، واستكشاف توصيات السيولة كما لو أنها بيانات حقيقية.</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 rounded-[24px] border border-brand-100 bg-brand-50 p-6 text-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold">عرض خاص للهاكاثون</p>
              <p className="mt-1 text-sm text-slate-600">صممنا هذه النسخة لتكون نقطة جذب أمام لجنة التحكيم مع تجربة عربية كاملة.</p>
            </div>
            <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-900">
              اذهب إلى تسجيل الدخول <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
