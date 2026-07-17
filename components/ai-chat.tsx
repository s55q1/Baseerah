'use client';

import { useEffect, useRef, useState } from 'react';
import { loadCompany } from '@/lib/company-store';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  'وش أسوي عشان أحسّن وضع السيولة؟',
  'متى تنفد السيولة لو ما غيّرت شي؟',
  'وش أفضل خيار تمويل لوضعي؟',
  'كيف أقلل تأخر التحصيل؟',
];

export function AiChat() {
  const [open, setOpen]       = useState(false);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'مرحباً! أنا مستشارك المالي في بصيرة. أسألني عن وضع سيولتك وسأعطيك توصيات مبنية على أرقامك الحقيقية 📊' },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: Message = { role: 'user', content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const companyData = loadCompany();
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.slice(1), // exclude initial greeting
          companyData,
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'حدث خطأ، حاول مرة أخرى.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: '24px', left: '24px', zIndex: 1000,
          width: '56px', height: '56px', borderRadius: '50%',
          background: open ? '#1E293B' : 'linear-gradient(135deg, #2563EB, #1d4ed8)',
          border: open ? '2px solid #334155' : 'none',
          boxShadow: '0 4px 20px rgba(37,99,235,0.4)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '22px', transition: 'all 0.2s',
        }}
        title="المستشار المالي AI"
      >
        {open ? '✕' : '🧠'}
      </button>

      {/* Unread dot */}
      {!open && (
        <div style={{
          position: 'fixed', bottom: '70px', left: '62px', zIndex: 1001,
          width: '10px', height: '10px', borderRadius: '50%',
          background: '#10B981', border: '2px solid white',
          boxShadow: '0 0 6px #10B981',
        }} />
      )}

      {/* Chat panel */}
      {open && (
        <div
          dir="rtl"
          style={{
            position: 'fixed', bottom: '90px', left: '16px', zIndex: 999,
            width: '360px', maxWidth: 'calc(100vw - 32px)',
            background: '#0F172A', borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
            display: 'flex', flexDirection: 'column',
            fontFamily: "'Inter', system-ui, sans-serif",
            animation: 'chatPop 0.2s ease-out',
          }}
        >
          <style>{`
            @keyframes chatPop {
              from { opacity: 0; transform: translateY(12px) scale(0.97); }
              to   { opacity: 1; transform: translateY(0) scale(1); }
            }
            .chat-msg-user   { background: #2563EB; color: white; border-radius: 14px 14px 4px 14px; margin-right: auto; }
            .chat-msg-ai     { background: #1E293B; color: #E2E8F0; border-radius: 14px 14px 14px 4px; margin-left: auto; border: 1px solid rgba(255,255,255,0.06); }
            .chat-suggestion { background: rgba(37,99,235,0.1); border: 1px solid rgba(37,99,235,0.25); color: #60A5FA; border-radius: 8px; padding: 7px 12px; font-size: 12px; cursor: pointer; text-align: right; transition: background 0.15s; }
            .chat-suggestion:hover { background: rgba(37,99,235,0.2); }
          `}</style>

          {/* Header */}
          <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg,#2563EB,#1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>🧠</div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#F8FAFC', lineHeight: 1 }}>مستشار بصيرة AI</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 4px #10B981' }} />
                <span style={{ fontSize: '11px', color: '#10B981' }}>متصل · يعرف بياناتك</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px' }}>
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'chat-msg-user' : 'chat-msg-ai'} style={{ padding: '10px 14px', fontSize: '13px', lineHeight: 1.6, maxWidth: '85%', whiteSpace: 'pre-wrap' }}>
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="chat-msg-ai" style={{ padding: '10px 14px', fontSize: '13px', maxWidth: '85%' }}>
                <span style={{ opacity: 0.6 }}>يكتب</span>
                <span style={{ animation: 'pulse 1s infinite' }}> ···</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions (only at start) */}
          {messages.length <= 1 && (
            <div style={{ padding: '0 14px 10px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {SUGGESTIONS.map(s => (
                <button key={s} className="chat-suggestion" onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="اسأل عن السيولة أو التمويل..."
              style={{
                flex: 1, background: '#1E293B', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px', padding: '9px 13px', color: '#F8FAFC',
                fontSize: '13px', outline: 'none',
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              style={{
                background: input.trim() && !loading ? '#2563EB' : '#1E293B',
                border: 'none', borderRadius: '10px', width: '38px', height: '38px',
                color: 'white', fontSize: '16px', cursor: input.trim() ? 'pointer' : 'default',
                transition: 'background 0.15s', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  );
}
