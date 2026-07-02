import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'بصيرة | منصة الذكاء الاصطناعي لإدارة السيولة',
  description: 'منصة FinTech عربية ذكية لمتابعة السيولة، تحليل المخاطر، وتقديم الحلول التمويلية للمؤسسات الصغيرة والمتوسطة.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
