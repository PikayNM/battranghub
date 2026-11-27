import { useState } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Translations } from '@/lib/i18n';

export default function StarRating({ t }: { t: Translations }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [sent, setSent] = useState(false);

  const rate = async (value: number) => {
    setRating(value);
    setSent(true);
    await supabase.from('site_ratings').insert({ rating: value });
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px] font-medium leading-snug text-cream">{t.rateLabel}</p>
      <div className="flex items-center gap-0.5" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((value) => {
          const active = value <= (hover || rating);
          return (
            <button
              key={value}
              onClick={() => rate(value)}
              onMouseEnter={() => setHover(value)}
              aria-label={`Rate ${value} stars`}
              className="p-0.5 transition-transform duration-150 hover:scale-125 active:scale-95"
            >
              <Star
                className={`h-6 w-6 transition-colors duration-150 ${
                  active ? 'fill-yellow-400 text-yellow-400' : 'fill-terra-900/70 text-terra-900/70'
                }`}
              />
            </button>
          );
        })}
      </div>
      {sent && (
        <span className="animate-fade-in text-[11px] font-semibold text-yellow-300">
          {rating >= 4 ? '❤️' : '🙏'} Cảm ơn bạn! / Thank you!
        </span>
      )}
    </div>
  );
}
