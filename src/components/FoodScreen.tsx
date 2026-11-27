import { Utensils, Store, Star } from 'lucide-react';
import { foods, eateries } from '@/lib/data';
import type { Lang, Translations } from '@/lib/i18n';

interface Props {
  t: Translations;
  lang: Lang;
}

export default function FoodScreen({ t, lang }: Props) {
  return (
    <div className="flex flex-col gap-5 px-4 pb-6 pt-3">
      <header className="animate-fade-up">
        <h1 className="text-xl font-extrabold text-white">{t.foodTitle}</h1>
        <p className="text-xs text-cream/80">{t.foodSubtitle}</p>
      </header>

      <section aria-label={t.mustTry} className="animate-fade-up" style={{ animationDelay: '60ms' }}>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-cream">
          <Utensils className="h-4 w-4" /> {t.mustTry}
        </h2>
        <ul className="grid grid-cols-2 gap-2.5">
          {foods.map((food) => (
            <li
              key={food.nameVi}
              className="card-terra rounded-2xl border border-cream/75 p-3.5 shadow-md shadow-terra-900/30 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <span className="text-2xl" role="img" aria-label={food.nameEn}>
                {food.emoji}
              </span>
              <h3 className="mt-1.5 text-xs font-bold leading-snug text-white">
                {lang === 'vi' ? food.nameVi : food.nameEn}
              </h3>
              <p className="mt-1 text-[10px] leading-snug text-cream/75">
                {lang === 'vi' ? food.descVi : food.descEn}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label={t.whereToEat} className="animate-fade-up" style={{ animationDelay: '120ms' }}>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-cream">
          <Store className="h-4 w-4" /> {t.whereToEat}
        </h2>
        <ul className="flex flex-col gap-2.5">
          {eateries.map((place) => (
            <li
              key={place.nameVi}
              className="rounded-2xl border border-cream/75 bg-terra-500/25 p-3.5 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-white">{lang === 'vi' ? place.nameVi : place.nameEn}</h3>
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-yellow-400/90 px-2 py-0.5">
                  <Star className="h-3 w-3 fill-terra-900 text-terra-900" />
                  <span className="text-[10px] font-extrabold text-terra-900">{place.rating}</span>
                </span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-cream/85">
                {lang === 'vi' ? place.descVi : place.descEn}
              </p>
              <p className="mt-1.5 text-[11px] font-bold text-yellow-300">
                {lang === 'vi' ? place.priceVi : place.priceEn}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
