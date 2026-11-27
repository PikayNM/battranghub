import { useEffect, useRef, useState } from 'react';
import { LockKeyhole, Delete } from 'lucide-react';

interface Props {
  open: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

const PIN = '2026';

export default function PinModal({ open, onSuccess, onClose }: Props) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setValue('');
      setError(false);
      window.setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  if (!open) return null;

  const submit = (pin: string) => {
    if (pin === PIN) {
      setError(false);
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      window.setTimeout(() => setShake(false), 400);
      window.setTimeout(() => setValue(''), 250);
    }
  };

  const onChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 4);
    setValue(digits);
    setError(false);
    if (digits.length === 4) {
      submit(digits);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-terra-900/80 px-6 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div
        className={`relative w-full max-w-[340px] rounded-3xl border border-cream/40 bg-terra-700 p-6 shadow-2xl ${shake ? 'animate-pop' : 'animate-fade-up'}`}
      >
        <div className="flex flex-col items-center text-center">
          <span className="rounded-full border border-cream/50 bg-terra-500 p-3">
            <LockKeyhole className="h-6 w-6 text-white" />
          </span>
          <h2 className="mt-3 text-base font-extrabold text-white">Nhập mã PIN</h2>
          <p className="mt-1 text-[11px] text-cream/75">
            Khu vực dành cho quản trị viên Herico
          </p>
        </div>

        <input
          ref={inputRef}
          type="password"
          inputMode="numeric"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Mã PIN"
          className="sr-only"
        />

        <button
          type="button"
          onClick={() => inputRef.current?.focus()}
          aria-hidden
          tabIndex={-1}
          className="sr-only"
        />

        <div className="mt-5 flex justify-center gap-3">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`flex h-12 w-11 items-center justify-center rounded-xl border-2 text-xl font-extrabold transition-colors ${
                error
                  ? 'border-red-400 bg-red-500/20'
                  : value[i]
                    ? 'border-yellow-400 bg-yellow-400/15'
                    : 'border-cream/40 bg-terra-900/40'
              }`}
            >
              {value[i] ? (
                <span className="text-yellow-300">•</span>
              ) : (
                <span className="text-cream/30">·</span>
              )}
            </span>
          ))}
        </div>

        {error && (
          <p className="mt-3 animate-fade-in text-center text-xs font-bold text-red-300">
            Mã PIN không đúng
          </p>
        )}

        <div className="mt-5 grid grid-cols-3 gap-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
            <button
              key={d}
              onClick={() => onChange(value + d)}
              className="rounded-xl border border-cream/30 bg-terra-600/70 py-3 text-base font-extrabold text-white transition hover:bg-terra-500 active:scale-95"
            >
              {d}
            </button>
          ))}
          <span />
          <button
            onClick={() => onChange(value + '0')}
            className="rounded-xl border border-cream/30 bg-terra-600/70 py-3 text-base font-extrabold text-white transition hover:bg-terra-500 active:scale-95"
          >
            0
          </button>
          <button
            onClick={() => {
              setValue((v) => v.slice(0, -1));
              setError(false);
            }}
            aria-label="Xóa"
            className="flex items-center justify-center rounded-xl border border-cream/30 bg-terra-600/70 py-3 transition hover:bg-terra-500 active:scale-95"
          >
            <Delete className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
