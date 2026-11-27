import { useRef } from 'react';
import { Map, Info, UtensilsCrossed, CalendarDays, Bot } from 'lucide-react';
import Carousel from './Carousel';
import StarRating from './StarRating';
import type { MediaMap, ContentMap } from '@/lib/media';
import type { Lang, Translations } from '@/lib/i18n';

export type ScreenKey = 'home' | 'map' | 'guide' | 'food' | 'experience' | 'ai';

interface Props {
  t: Translations;
  lang: Lang;
  media: MediaMap;
  content: ContentMap;
  onNavigate: (screen: ScreenKey) => void;
  onOpenMedia: () => void;
}

const bentoCards = [
  { key: 'map' as const, icon: Map, labelKey: 'map' as const, subKey: 'mapSub' as const },
  { key: 'guide' as const, icon: Info, labelKey: 'guide' as const, subKey: 'guideSub' as const },
  { key: 'food' as const, icon: UtensilsCrossed, labelKey: 'food' as const, subKey: 'foodSub' as const },
  { key: 'experience' as const, icon: CalendarDays, labelKey: 'experience' as const, subKey: 'expSub' as const },
];

export default function HomeScreen({ t, lang, media, content, onNavigate, onOpenMedia }: Props) {
  const tapCount = useRef(0);
  const tapTimer = useRef<number | null>(null);

  const handleFooterTap = () => {
    tapCount.current += 1;
    if (tapTimer.current) window.clearTimeout(tapTimer.current);
    tapTimer.current = window.setTimeout(() => {
      tapCount.current = 0;
    }, 1500);
    if (tapCount.current >= 5) {
      tapCount.current = 0;
      if (tapTimer.current) window.clearTimeout(tapTimer.current);
      onOpenMedia();
    }
  };

  return (
    <div className="flex flex-col gap-5 px-4 pb-6 pt-3">
      <Carousel lang={lang} media={media} content={content} />

      <section className="grid animate-fade-up grid-cols-2 gap-3" style={{ animationDelay: '80ms' }} aria-label="Menu">
        {bentoCards.map(({ key, icon: Icon, labelKey, subKey }) => (
          <button
            key={key}
            onClick={() => onNavigate(key)}
            className="card-terra group flex aspect-[4/3.4] flex-col items-center justify-center gap-2 rounded-2xl border border-cream/90 p-3 text-center shadow-lg shadow-terra-900/30 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-terra-900/40 active:scale-95"
          >
            <Icon className="h-10 w-10 text-white transition-transform duration-200 group-hover:scale-110" strokeWidth={1.6} />
            <span className="text-sm font-bold leading-tight text-white">{t[labelKey]}</span>
            <span className="text-[10px] font-medium leading-tight text-cream/70">{t[subKey]}</span>
          </button>
        ))}
      </section>

      <section
        className="grid animate-fade-up grid-cols-[1.1fr_0.9fr] items-stretch gap-3"
        style={{ animationDelay: '160ms' }}
        aria-label="Feedback and AI"
      >
        <div className="flex flex-col justify-center rounded-2xl border border-cream/80 bg-terra-900/25 p-3 backdrop-blur-sm">
          <StarRating t={t} />
        </div>
        <button
          onClick={() => onNavigate('ai')}
          className="card-terra group relative flex flex-col items-center justify-center gap-1.5 rounded-2xl rounded-bl-md rounded-tr-md border border-cream/90 p-3 shadow-lg shadow-terra-900/30 transition-all duration-200 hover:-translate-y-1 active:scale-95"
        >
          <span className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-[9px] border-t-[10px] border-x-transparent border-t-cream/90" />
          <Bot className="h-8 w-8 text-white transition-transform duration-200 group-hover:scale-110" strokeWidth={1.7} />
          <span className="text-sm font-extrabold tracking-wide text-white">{t.aiAssistant}</span>
          <span className="text-[10px] font-medium text-cream/75">{t.aiSlogan}</span>
        </button>
      </section>

      <footer className="animate-fade-up mt-2 space-y-2 pb-2 text-center" style={{ animationDelay: '240ms' }}>
        <p className="text-[11px] font-medium text-cream/90">{t.supportEmail}</p>
        <p className="text-[11px] font-medium text-cream/90">{t.hotline}</p>
        <button
          onClick={handleFooterTap}
          className="pt-1 text-[10px] font-semibold tracking-widest text-cream/60 transition-colors hover:text-cream/90"
        >
          © Herico
        </button>
      </footer>
    </div>
  );
}
