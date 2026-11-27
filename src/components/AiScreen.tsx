import { useEffect, useRef, useState } from 'react';
import { Send, Mic, MicOff, Bot } from 'lucide-react';
import { aiPopularQuestions, aiReply } from '@/lib/data';
import type { Lang, Translations } from '@/lib/i18n';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

interface Props {
  t: Translations;
  lang: Lang;
}

export default function AiScreen({ t, lang }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ role: 'ai', text: t.aiGreeting }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const ask = (question: string) => {
    const q = question.trim();
    if (!q || typing) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: q }]);
    setTyping(true);
    window.setTimeout(() => {
      setMessages((m) => [...m, { role: 'ai', text: aiReply(q, lang) }]);
      setTyping(false);
    }, 700);
  };

  const startVoice = () => {
    type SpeechWindow = Window & {
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
      SpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const w = window as SpeechWindow;
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) {
      ask(lang === 'vi' ? 'Đi Bát Tràng bằng cách nào?' : 'How do I get to Bat Trang?');
      return;
    }
    const rec = new Ctor();
    rec.lang = lang === 'vi' ? 'vi-VN' : 'en-US';
    rec.interimResults = false;
    rec.onresult = (e: SpeechEventLike) => {
      const said = e.results[0][0].transcript;
      setListening(false);
      ask(said);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    setListening(true);
    rec.start();
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-cream/25 bg-terra-900/40 px-4 py-3 backdrop-blur">
        <span className="rounded-full border border-cream/50 bg-terra-500 p-2">
          <Bot className="h-5 w-5 text-white" />
        </span>
        <div>
          <h1 className="text-sm font-extrabold text-white">{t.aiTitle}</h1>
          <p className="flex items-center gap-1.5 text-[10px] text-cream/80">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" /> {t.aiSubtitle}
          </p>
        </div>
      </div>

      <div className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex animate-fade-up ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-md ${
                m.role === 'user'
                  ? 'rounded-br-sm bg-cream font-medium text-terra-800'
                  : 'card-terra rounded-bl-sm border border-cream/70 text-white'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="card-terra flex gap-1 rounded-2xl rounded-bl-sm border border-cream/70 px-4 py-3">
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-cream/90"
                  style={{ animationDelay: `${d * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length <= 2 && (
        <div className="no-scrollbar flex shrink-0 gap-2 overflow-x-auto px-4 pb-2">
          {aiPopularQuestions.map((q) => (
            <button
              key={q.vi}
              onClick={() => ask(lang === 'vi' ? q.vi : q.en)}
              className="shrink-0 rounded-full border border-cream/50 bg-terra-900/30 px-3 py-1.5 text-[10px] font-semibold text-cream transition hover:bg-terra-900/50 active:scale-95"
            >
              {lang === 'vi' ? q.vi : q.en}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="flex shrink-0 items-center gap-2 border-t border-cream/25 bg-terra-900/40 px-3 py-3 backdrop-blur"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={listening ? t.listening : t.aiPlaceholder}
          className="min-w-0 flex-1 rounded-full border border-cream/40 bg-white/95 px-4 py-2.5 text-xs text-terra-900 placeholder-terra-900/50 outline-none focus:border-yellow-400"
        />
        <button
          type="button"
          onClick={startVoice}
          aria-label={t.voiceInput}
          className={`rounded-full p-2.5 transition-all active:scale-90 ${
            listening ? 'animate-pulse bg-red-500' : 'bg-terra-500 hover:bg-terra-400'
          }`}
        >
          {listening ? <MicOff className="h-4 w-4 text-white" /> : <Mic className="h-4 w-4 text-white" />}
        </button>
        <button
          type="submit"
          aria-label={t.send}
          className="rounded-full bg-yellow-400 p-2.5 transition-all hover:bg-yellow-300 active:scale-90"
        >
          <Send className="h-4 w-4 text-terra-900" />
        </button>
      </form>
    </div>
  );
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  onresult: (e: SpeechEventLike) => void;
  onend: () => void;
  onerror: () => void;
  start: () => void;
}

interface SpeechEventLike {
  results: { [index: number]: { [index: number]: { transcript: string } } };
}
