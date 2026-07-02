'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import { SiteShell } from '@/components/site-shell';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
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

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message || 'حاول مرة أخرى لاحقًا');
      return;
    }

    setMessage('تم تسجيل الدخول بنجاح! يتم التوجيه...');
    router.push('/dashboard');
  };

  return (
    <SiteShell>
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_32%),linear-gradient(135deg,_#f8fafc_0%,_#eef4ff_100%)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft sm:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">دخول بصيرة</p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">أدخل إلى تجربة إدارة السيولة العربية.</h1>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
              <Lock size={16} /> آمن وجاهز للعرض
            </div>
          </div>

          <div className="mt-10 grid gap-6">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <div className="flex items-center gap-3 text-brand-700">
                <Mail size={18} />
                <p className="text-sm font-semibold">حساب جاهز للتجربة</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">استخدم بياناتك للدخول إلى لوحة التحكم واستعرض تحليلات السيولة فورًا.</p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4">
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
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-900 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                <ArrowRight size={16} />
              </button>
            </form>

            {message ? <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">{message}</div> : null}
            {error ? <div className="rounded-2xl border border-danger/20 bg-danger/10 p-4 text-sm text-danger">{error}</div> : null}

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
              <p>ليس لديك حساب؟</p>
              <Link href="/signup" className="mt-2 inline-flex font-semibold text-brand-700 underline underline-offset-4">
                سجّل الآن
              </Link>
            </div>
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
