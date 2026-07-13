import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0F172A',
};

export const metadata: Metadata = {
  title: 'بصيرة | ذكاء السيولة للشركات الصغيرة والمتوسطة',
  description: 'منصة FinTech ذكية تنبئك بأزمة السيولة قبل 18 يوماً من وقوعها. تحليل مخاطر مالية بالذكاء الاصطناعي، توصيات تمويلية فورية، ومحرك تنبؤ 6 أشهر.',
  keywords: ['سيولة', 'ذكاء اصطناعي', 'FinTech', 'مخاطر مالية', 'شركات صغيرة', 'تمويل', 'بصيرة'],
  authors: [{ name: 'فريق بصيرة · هاكاثون أمد 2026' }],
  creator: 'بصيرة',
  publisher: 'بصيرة',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    title: 'بصيرة — اعرف أزمة السيولة قبلها بـ 18 يوم',
    description: 'محرك ذكاء اصطناعي يحلل تدفقاتك المالية ويعطيك درجة خطر دقيقة مع توصيات تمويلية فورية. مصمم للشركات الصغيرة والمتوسطة في السوق السعودي.',
    siteName: 'بصيرة',
    images: [
      {
        url: '/mascot.png',
        width: 512,
        height: 512,
        alt: 'بصيرة — ذكاء السيولة',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'بصيرة — ذكاء السيولة للأعمال',
    description: 'اعرف أزمة السيولة قبلها بـ 18 يوم. مدعوم بالذكاء الاصطناعي.',
    images: ['/mascot.png'],
  },
  icons: {
    icon: '/mascot.png',
    apple: '/mascot.png',
    shortcut: '/mascot.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
