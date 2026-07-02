'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Brain, Shield, TrendingUp, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      return;
    }
    router.push('/dashboard');
  };

  const fillDemo = () => {
    setEmail('demo@baseerah.ai');
    setPassword('Baseerah2026!');
  };

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* ===== الجانب الأيمن: اللوحة الداكنة ===== */}
      <div className="hidden lg:flex lg:w-3/5 bg-[#020B1E] relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full bg-blue-700/15 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[110px] pointer-events-none" />

        {/* شعار */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="rounded-2xl bg-brand-700 p-3 shadow-lg shadow-blue-900/60">
            <Brain size={22} className="text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white tracking-tight">بصيرة</p>
            <p className="text-xs text-blue-300 mt-0.5">ذكاء السيولة للأعمال</p>
          </div>
        </div>

        {/* المحتوى المركزي */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-300 mb-8">
            <Zap size={13} /> مدعوم بالذكاء الاصطناعي · هاكاثون أمد 2026
          </div>

          <h1 className="text-5xl font-bold text-white leading-[1.15]">
            اعرف أزمة<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-cyan-300 to-blue-400">السيولة قبلها</span><br />
            بـ 18 يوم
          </h1>
          <p className="mt-6 text-base text-slate-400 max-w-md leading-relaxed">
            بصيرة تحلل تدفقاتك المالية في الوقت الفعلي وتنبهك قبل وقوع الأزمة، مع توصيات تمويلية فورية من جهات معتمدة.
          </p>

          {/* إحصائيات */}
          <div className="mt-10 grid grid-cols-3 gap-3">
            {[
              { value: '18', label: 'يوم تنبيه مسبق', color: 'text-cyan-400' },
              { value: '92%', label: 'دقة التنبؤ', color: 'text-green-400' },
              { value: '3x', label: 'سرعة القرار', color: 'text-blue-400' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/8 bg-white/5 p-4 backdrop-blur-sm">
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="mt-1 text-xs text-slate-500 leading-tight">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* ميزات */}
          <div className="mt-8 space-y-3">
            {[
              { Icon: TrendingUp, text: 'تنبؤ بالتدفقات النقدية قبل 6 أشهر' },
              { Icon: Shield, text: 'تحليل أسباب الخطر بالذكاء الاصطناعي' },
              { Icon: Zap, text: 'توصيات تمويلية فورية من بنوك معتمدة' },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-slate-300">
                <div className="rounded-xl bg-blue-900/50 p-2 border border-blue-800/50">
                  <Icon size={13} className="text-blue-400" />
                </div>
                <span className="text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-slate-700">بصيرة © 2026 · جميع الحقوق محفوظة</p>
      </div>

      {/* ===== الجانب الأيسر: نموذج الدخول ===== */}
      <div className="w-full lg:w-2/5 flex items-center justify-center bg-white px-8 py-12">
        <div className="w-full max-w-sm">
          {/* شعار للجوال */}
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <div className="rounded-2xl bg-brand-700 p-2.5 text-white">
              <Brain size={20} />
            </div>
            <p className="text-xl font-bold text-slate-900">بصيرة</p>
          </div>

          <h2 className="text-3xl font-bold text-slate-900">مرحباً بك 👋</h2>
          <p className="mt-2 text-slate-500 text-sm">سجّل دخولك للوصول إلى لوحة التحكم</p>

          {/* زر الديمو */}
          <button
            type="button"
            onClick={fillDemo}
            className="mt-6 w-full rounded-2xl border-2 border-dashed border-brand-200 bg-gradient-to-l from-brand-50 to-blue-50 p-4 text-right transition hover:border-brand-400 hover:from-brand-100 hover:to-blue-100 active:scale-[0.99]"
          >
            <p className="text-sm font-bold text-brand-700">⚡ تجربة سريعة — اضغط لملء بيانات الديمو</p>
            <p className="mt-1 text-xs text-brand-400 font-mono">demo@baseerah.ai · Baseerah2026!</p>
          </button>

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">أو أدخل بياناتك</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="demo@baseerah.ai"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 text-sm outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 text-sm outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100"
                required
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-brand-700 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition hover:bg-brand-900 active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? 'جاري الدخول...' : 'دخول إلى بصيرة ←'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            ليس لديك حساب؟{' '}
            <Link href="/signup" className="font-bold text-brand-700 hover:underline underline-offset-4">
              سجّل الآن
            </Link>
          </p>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Shield size={12} />
            <span>آمن ومشفر · بصيرة 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
