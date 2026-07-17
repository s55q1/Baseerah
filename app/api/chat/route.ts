import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { messages, companyData } = await req.json();

    const companyContext = companyData ? `
بيانات الشركة الحالية:
- اسم الشركة: ${companyData.name ?? 'غير محدد'}
- القطاع: ${companyData.inputs?.sector ?? 'غير محدد'}
- الرصيد النقدي: ${companyData.inputs?.currentCash ?? 'غير محدد'} مليون ر.س
- الإيرادات الشهرية: ${companyData.inputs?.monthlyRevenue ?? 'غير محدد'} مليون ر.س
- المصروفات التشغيلية: ${companyData.inputs?.operationalExpenses ?? 'غير محدد'} مليون ر.س
- معدل الاحتراق: ${companyData.inputs?.burnRate ?? 'غير محدد'}%
- تأخر التحصيل: ${companyData.inputs?.collectionDelay ?? 'غير محدد'} يوم
- ركود المخزون: ${companyData.inputs?.inventoryStagnation ?? 'غير محدد'}%
- اتجاه الرواتب: ${companyData.inputs?.salaryTrend ?? 'غير محدد'}%
- درجة الخطر المحسوبة: ${companyData.riskScore ?? 'غير محدد'} / 100
` : 'لا توجد بيانات شركة مدخلة بعد.';

    const systemPrompt = `أنت مستشار مالي ذكي داخل منصة "بصيرة" — منصة FinTech سعودية تساعد الشركات الصغيرة والمتوسطة على التنبؤ بأزمات السيولة قبل وقوعها بـ 18 يوماً.

دورك:
- تحليل وضع السيولة للشركة بناءً على بياناتها الحقيقية
- تقديم توصيات عملية ومحددة (أرقام، نسب، إجراءات)
- الإجابة على أسئلة التمويل، التحصيل، المخزون، والتكاليف
- استخدام لغة عربية واضحة ومهنية
- الردود مختصرة وعملية — لا تطيل بدون فائدة

${companyContext}

قواعد مهمة:
- اذكر أرقام الشركة الفعلية في ردودك عند الإجابة
- لو درجة الخطر > 75: أكد على الإجراء الفوري
- لو درجة الخطر 50-75: نبّه وأعط خطة واضحة
- لو درجة الخطر < 50: شجّع واقترح تحسينات
- لا تخترع أرقاماً غير موجودة في البيانات
- أنت جزء من هاكاثون امد بالشراكة بين مصرف الإنماء وأكاديمية طويق`;

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    return NextResponse.json({ reply: text });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ reply: 'عذراً، حدث خطأ في الاتصال. حاول مرة أخرى.' }, { status: 500 });
  }
}
