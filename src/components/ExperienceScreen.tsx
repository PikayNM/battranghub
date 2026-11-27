import { useState } from 'react';
import { Disc3, Paintbrush, Bus, Tent, Clock, Wallet, CalendarCheck, CheckCircle2 } from 'lucide-react';
import { experiences } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import type { Lang, Translations } from '@/lib/i18n';

interface Props {
  t: Translations;
  lang: Lang;
}

const icons = { wheel: Disc3, paint: Paintbrush, cart: Bus, eco: Tent } as const;

export default function ExperienceScreen({ t, lang }: Props) {
  const [booking, setBooking] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', date: '', people: 2 });
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const selected = experiences.find((e) => e.id === booking);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setStatus('sending');
    const { error } = await supabase.from('bookings').insert({
      name: form.name,
      phone: form.phone,
      experience: lang === 'vi' ? selected.titleVi : selected.titleEn,
      date: form.date,
      people: form.people,
    });
    if (error) {
      setStatus('error');
    } else {
      setStatus('done');
    }
  };

  return (
    <div className="flex flex-col gap-5 px-4 pb-6 pt-3">
      <header className="animate-fade-up">
        <h1 className="text-xl font-extrabold text-white">{t.expTitle}</h1>
        <p className="text-xs text-cream/80">{t.expSubtitle}</p>
      </header>

      <ul className="flex animate-fade-up flex-col gap-2.5" style={{ animationDelay: '60ms' }}>
        {experiences.map((exp) => {
          const Icon = icons[exp.icon];
          return (
            <li
              key={exp.id}
              className="card-terra rounded-2xl border border-cream/80 p-4 shadow-lg shadow-terra-900/30"
            >
              <div className="flex items-start gap-3">
                <span className="rounded-xl border border-cream/40 bg-white/10 p-2">
                  <Icon className="h-6 w-6 text-white" strokeWidth={1.7} />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-bold leading-snug text-white">
                    {lang === 'vi' ? exp.titleVi : exp.titleEn}
                  </h2>
                  <p className="mt-0.5 text-[11px] text-cream/80">
                    {lang === 'vi' ? exp.descVi : exp.descEn}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1 rounded-full bg-yellow-400/90 px-2 py-0.5 text-[10px] font-extrabold text-terra-900">
                      <Wallet className="h-3 w-3" /> {lang === 'vi' ? exp.priceVi : exp.priceEn}
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold text-white">
                      <Clock className="h-3 w-3" /> {lang === 'vi' ? exp.durationVi : exp.durationEn}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setBooking(exp.id);
                  setStatus('idle');
                }}
                className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-extrabold transition-all active:scale-95 ${
                  booking === exp.id
                    ? 'bg-cream text-terra-700'
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                <CalendarCheck className="h-4 w-4" /> {t.bookNow}
              </button>

              {booking === exp.id && status !== 'done' && (
                <form onSubmit={submit} className="mt-3 animate-fade-up space-y-2.5 rounded-xl border border-cream/40 bg-terra-900/40 p-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-cream">{t.bookingTitle}</p>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={t.yourName}
                    className="w-full rounded-lg border border-cream/40 bg-white/95 px-3 py-2 text-xs text-terra-900 placeholder-terra-900/50 outline-none focus:border-yellow-400"
                  />
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder={t.phone}
                    className="w-full rounded-lg border border-cream/40 bg-white/95 px-3 py-2 text-xs text-terra-900 placeholder-terra-900/50 outline-none focus:border-yellow-400"
                  />
                  <div className="grid grid-cols-2 gap-2.5">
                    <input
                      required
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full rounded-lg border border-cream/40 bg-white/95 px-3 py-2 text-xs text-terra-900 outline-none focus:border-yellow-400"
                    />
                    <input
                      required
                      type="number"
                      min={1}
                      max={30}
                      value={form.people}
                      onChange={(e) => setForm({ ...form, people: Number(e.target.value) })}
                      className="w-full rounded-lg border border-cream/40 bg-white/95 px-3 py-2 text-xs text-terra-900 outline-none focus:border-yellow-400"
                    />
                  </div>
                  {status === 'error' && (
                    <p className="rounded-lg bg-red-900/60 px-3 py-2 text-[11px] font-semibold text-red-100">
                      {t.bookingError}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full rounded-lg bg-yellow-400 py-2.5 text-xs font-extrabold text-terra-900 transition-all hover:bg-yellow-300 active:scale-95 disabled:opacity-60"
                  >
                    {status === 'sending' ? '...' : t.submit}
                  </button>
                </form>
              )}
              {booking === exp.id && status === 'done' && (
                <div className="mt-3 flex animate-pop items-center gap-2 rounded-xl border border-yellow-400/60 bg-terra-900/40 p-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-yellow-400" />
                  <p className="text-xs font-bold text-yellow-300">{t.bookingSuccess}</p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
