import { useEffect, useState } from 'react';
import { ChevronDown, ArrowLeft } from 'lucide-react';
import HomeScreen, { type ScreenKey } from '@/components/HomeScreen';
import MapScreen from '@/components/MapScreen';
import GuideScreen from '@/components/GuideScreen';
import FoodScreen from '@/components/FoodScreen';
import ExperienceScreen from '@/components/ExperienceScreen';
import AiScreen from '@/components/AiScreen';
import MediaPanel from '@/components/MediaPanel';
import PinModal from '@/components/PinModal';
import {
  fetchMediaSlots,
  fetchSlideContent,
  fetchMapSpots,
  type MediaMap,
  type ContentMap,
  type MapSpot,
} from '@/lib/media';
import { createT, type Lang } from '@/lib/i18n';

const VietnamFlag = () => (
  <span className="flex h-4 w-6 shrink-0 flex-col overflow-hidden rounded-[2px] border border-cream/40">
    <span className="flex flex-1 items-center justify-center bg-[#DA251D]">
      <span className="h-1.5 w-1.5 text-[8px] leading-none text-yellow-300">★</span>
    </span>
  </span>
);

const UKFlag = () => (
  <span className="flex h-4 w-6 shrink-0 overflow-hidden rounded-[2px] border border-cream/40 bg-[#012169]">
    <svg viewBox="0 0 24 16" className="h-full w-full">
      <path d="M0 0 L24 16 M24 0 L0 16" stroke="white" strokeWidth="3.2" />
      <path d="M0 0 L24 16 M24 0 L0 16" stroke="#C8102E" strokeWidth="1.6" />
      <path d="M12 0 V16 M0 8 H24" stroke="white" strokeWidth="5" />
      <path d="M12 0 V16 M0 8 H24" stroke="#C8102E" strokeWidth="3" />
    </svg>
  </span>
);

export default function App() {
  const [lang, setLang] = useState<Lang>('vi');
  const [screen, setScreen] = useState<ScreenKey>('home');
  const [langOpen, setLangOpen] = useState(false);
  const [media, setMedia] = useState<MediaMap>({});
  const [slideContent, setSlideContent] = useState<ContentMap>({});
  const [spots, setSpots] = useState<MapSpot[]>([]);
  const [pinOpen, setPinOpen] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const t = createT(lang);

  useEffect(() => {
    fetchMediaSlots()
      .then(setMedia)
      .catch(() => setMedia({}));
    fetchSlideContent()
      .then(setSlideContent)
      .catch(() => setSlideContent({}));
    fetchMapSpots()
      .then(setSpots)
      .catch(() => setSpots([]));
  }, []);

  const refreshSpots = () => {
    fetchMapSpots()
      .then(setSpots)
      .catch(() => setSpots([]));
  };

  const refreshMedia = () => {
    fetchMediaSlots()
      .then(setMedia)
      .catch(() => setMedia({}));
  };

  const refreshContent = () => {
    fetchSlideContent()
      .then(setSlideContent)
      .catch(() => setSlideContent({}));
  };

  const navigate = (s: ScreenKey) => setScreen(s);
  const goBack = () => setScreen('home');

  return (
    <div className="app-bg min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col shadow-2xl shadow-terra-900/50">
        {/* Top header bar */}
        <header className="sticky top-0 z-20 border-b border-cream/25 bg-terra-900/35 backdrop-blur-md">
          <div className="flex items-center justify-between px-4 py-3">
            {screen === 'home' ? (
              <div className="animate-fade-in">
                <h1 className="text-lg font-extrabold leading-tight text-white">{t.greeting}</h1>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cream/75">
                  BatTrangHub · {t.tagline}
                </p>
              </div>
            ) : (
              <button
                onClick={goBack}
                className="flex animate-fade-in items-center gap-1.5 rounded-full border border-cream/50 bg-terra-500/40 px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-terra-500/70 active:scale-95"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> {t.back}
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => setLangOpen((o) => !o)}
                aria-label="Language switcher"
                className="flex items-center gap-2 rounded-full border border-cream/60 bg-terra-500/50 px-3 py-1.5 transition-all hover:bg-terra-500/75 active:scale-95"
              >
                {lang === 'vi' ? <VietnamFlag /> : <UKFlag />}
                <span className="text-xs font-bold text-white">
                  {lang === 'vi' ? t.vietnamese : t.english}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-white transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 z-20 mt-2 w-40 animate-fade-up overflow-hidden rounded-xl border border-cream/70 bg-terra-600 shadow-xl shadow-terra-900/50">
                    {(
                      [
                        { key: 'vi' as const, label: t.vietnamese, flag: <VietnamFlag /> },
                        { key: 'en' as const, label: t.english, flag: <UKFlag /> },
                      ]
                    ).map(({ key, label, flag }) => (
                      <button
                        key={key}
                        onClick={() => {
                          setLang(key);
                          setLangOpen(false);
                        }}
                        className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-xs font-semibold transition-colors ${
                          lang === key
                            ? 'bg-terra-700 text-yellow-300'
                            : 'text-white hover:bg-terra-500'
                        }`}
                      >
                        {flag} {label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Screen body */}
        <main className="flex-1">
          {screen === 'ai' ? (
            <div className="flex h-[calc(100vh-60px)] animate-slide-in flex-col">
              <AiScreen t={t} lang={lang} />
            </div>
          ) : screen === 'home' ? (
            <HomeScreen
              t={t}
              lang={lang}
              media={media}
              content={slideContent}
              onNavigate={navigate}
              onOpenMedia={() => setPinOpen(true)}
            />
          ) : (
            <div key={screen} className="animate-slide-in">
              {screen === 'map' && <MapScreen t={t} lang={lang} spots={spots} />}
              {screen === 'guide' && <GuideScreen t={t} lang={lang} />}
              {screen === 'food' && <FoodScreen t={t} lang={lang} />}
              {screen === 'experience' && <ExperienceScreen t={t} lang={lang} />}
            </div>
          )}
        </main>
      </div>

      <PinModal
        open={pinOpen}
        onSuccess={() => {
          setPinOpen(false);
          setMediaOpen(true);
        }}
        onClose={() => setPinOpen(false)}
      />

      <MediaPanel
        open={mediaOpen}
        t={t}
        lang={lang}
        media={media}
        content={slideContent}
        spots={spots}
        onClose={() => setMediaOpen(false)}
        onMediaUpdated={refreshMedia}
        onContentUpdated={refreshContent}
        onSpotsUpdated={refreshSpots}
      />
    </div>
  );
}
