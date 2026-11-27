import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { slides } from '@/lib/data';
import { SLOTS, type MediaMap, type ContentMap } from '@/lib/media';
import type { Lang } from '@/lib/i18n';

interface Props {
  lang: Lang;
  media: MediaMap;
  content: ContentMap;
}

export default function Carousel({ lang, media, content }: Props) {
  const slideImages = slides.map(
    (s, i) =>
      media[SLOTS[`slide${i + 1}` as keyof typeof SLOTS]] ?? s.image,
  );
  const slideContent = slides.map(
    (s, i) => content[SLOTS[`slide${i + 1}` as keyof typeof SLOTS]],
  );
  const [index, setIndex] = useState(0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    timer.current = window.setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      4500,
    );
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, []);

  const goTo = (i: number) => {
    setIndex((i + slides.length) % slides.length);
    if (timer.current) window.clearInterval(timer.current);
    timer.current = window.setInterval(
      () => setIndex((cur) => (cur + 1) % slides.length),
      4500,
    );
  };

  const slide = slides[index];
  const override = slideContent[index];
  const badge = override?.badge || (lang === 'vi' ? 'Quảng cáo' : 'Featured');
  const title =
    (lang === 'vi' ? override?.titleVi : override?.titleEn) ||
    (lang === 'vi' ? slide.titleVi : slide.titleEn);
  const sub =
    (lang === 'vi' ? override?.subVi : override?.subEn) ||
    (lang === 'vi' ? slide.subVi : slide.subEn);

  return (
    <section className="animate-fade-up" aria-label="Featured">
      <div className="relative aspect-video max-h-60 w-full overflow-hidden rounded-2xl border border-cream/80 shadow-lg shadow-terra-900/30">
        {slideImages.map((image, i) => (
          <img
            key={image}
            src={image}
            alt={lang === 'vi' ? slides[i].titleVi : slides[i].titleEn}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-terra-900/85 via-terra-900/20 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
          <div key={index} className="animate-fade-up min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cream/80">
              {badge}
            </p>
            <h2 className="mt-1 truncate text-lg font-bold leading-tight text-white">
              {title}
            </h2>
            <p className="mt-0.5 truncate text-xs text-cream/85">
              {sub}
            </p>
          </div>
          <div className="flex shrink-0 gap-1.5">
            <button
              onClick={() => goTo(index - 1)}
              aria-label="Previous slide"
              className="rounded-full bg-white/20 p-1.5 backdrop-blur transition hover:bg-white/35 active:scale-90"
            >
              <ChevronLeft className="h-4 w-4 text-white" />
            </button>
            <button
              onClick={() => goTo(index + 1)}
              aria-label="Next slide"
              className="rounded-full bg-white/20 p-1.5 backdrop-blur transition hover:bg-white/35 active:scale-90"
            >
              <ChevronRight className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>

        <div className="absolute inset-x-0 top-3 flex justify-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
