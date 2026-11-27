import { useState } from 'react';
import { HandMetal, Camera, Hand, Footprints, MessagesSquare, Leaf, Landmark } from 'lucide-react';
import { etiquette, history, halfDayItinerary, fullDayItinerary } from '@/lib/data';
import type { Lang, Translations } from '@/lib/i18n';

interface Props {
  t: Translations;
  lang: Lang;
}

const etiquetteIcons = {
  respect: HandMetal,
  camera: Camera,
  hands: Hand,
  walk: Footprints,
  bargain: MessagesSquare,
  green: Leaf,
};

export default function GuideScreen({ t, lang }: Props) {
  const [tab, setTab] = useState<'half' | 'full'>('half');
  const itinerary = tab === 'half' ? halfDayItinerary : fullDayItinerary;

  return (
    <div className="flex flex-col gap-5 px-4 pb-6 pt-3">
      <header className="animate-fade-up">
        <h1 className="text-xl font-extrabold text-white">{t.guideTitle}</h1>
        <p className="text-xs text-cream/80">{t.guideSubtitle}</p>
      </header>

      <section className="animate-fade-up rounded-2xl border border-cream/80 bg-terra-900/25 p-4 backdrop-blur-sm" style={{ animationDelay: '60ms' }}>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-cream">{t.etiquetteTitle}</h2>
        <ul className="grid grid-cols-2 gap-2.5">
          {etiquette.map((item) => {
            const Icon = etiquetteIcons[item.icon];
            return (
              <li
                key={item.icon}
                className="card-terra rounded-xl border border-cream/70 p-3 shadow-md shadow-terra-900/30"
              >
                <Icon className="h-5 w-5 text-white" strokeWidth={1.8} />
                <h3 className="mt-1.5 text-xs font-bold leading-snug text-white">
                  {lang === 'vi' ? item.titleVi : item.titleEn}
                </h3>
                <p className="mt-1 text-[10px] leading-snug text-cream/75">
                  {lang === 'vi' ? item.descVi : item.descEn}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="animate-fade-up rounded-2xl border border-cream/80 card-terra p-4 shadow-lg shadow-terra-900/30" style={{ animationDelay: '120ms' }}>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-cream">
          <Landmark className="h-4 w-4" /> {t.historyTitle}
        </h2>
        <ol className="relative space-y-3 border-l border-cream/30 pl-4">
          {history.map((h) => (
            <li key={h.year} className="relative">
              <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border border-cream bg-yellow-400" />
              <p className="text-xs font-extrabold text-yellow-300">{h.year}</p>
              <p className="text-[11px] leading-relaxed text-cream/90">{lang === 'vi' ? h.textVi : h.textEn}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="animate-fade-up rounded-2xl border border-cream/80 bg-terra-900/25 p-4 backdrop-blur-sm" style={{ animationDelay: '180ms' }}>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-cream">{t.itineraryTitle}</h2>
        <div className="mb-3 grid grid-cols-2 gap-2">
          {(
            [
              { key: 'half' as const, label: t.itineraryTab1 },
              { key: 'full' as const, label: t.itineraryTab2 },
            ]
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${
                tab === key
                  ? 'border-cream bg-terra-500 text-white shadow-md shadow-terra-900/40'
                  : 'border-cream/50 text-cream/90 hover:bg-terra-900/30'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <ol key={tab} className="animate-fade-in space-y-2">
          {itinerary.map((stop) => (
            <li key={stop.time} className="flex items-start gap-3 rounded-xl border border-cream/60 bg-terra-500/20 p-2.5">
              <span className="shrink-0 rounded-lg bg-cream px-2 py-1 text-[10px] font-extrabold text-terra-700">
                {stop.time}
              </span>
              <span className="pt-0.5 text-xs font-semibold leading-snug text-white">
                {lang === 'vi' ? stop.titleVi : stop.titleEn}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
