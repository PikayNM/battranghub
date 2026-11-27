import { useEffect, useRef, useState } from 'react';
import { X, Upload, Trash2, Image as ImageIcon, Loader2, Save, Check, Map as MapIcon } from 'lucide-react';
import {
  uploadImage,
  deleteMedia,
  saveSlideContent,
  SLOTS,
  type MediaMap,
  type ContentMap,
  type SlideContent,
  type MapSpot,
} from '@/lib/media';
import MapManager from './MapManager';
import type { Lang, Translations } from '@/lib/i18n';

interface Props {
  open: boolean;
  t: Translations;
  lang: Lang;
  media: MediaMap;
  content: ContentMap;
  spots: MapSpot[];
  onClose: () => void;
  onMediaUpdated: () => void;
  onContentUpdated: () => void;
  onSpotsUpdated: () => void;
}

const SLOT_LABELS: { slot: string; label: string }[] = [
  { slot: SLOTS.slide1, label: 'Banner 1' },
  { slot: SLOTS.slide2, label: 'Banner 2' },
  { slot: SLOTS.slide3, label: 'Banner 3' },
  { slot: SLOTS.slide4, label: 'Banner 4' },
  { slot: SLOTS.slide5, label: 'Banner 5' },
];

const emptyContent: SlideContent = { badge: '', titleVi: '', titleEn: '', subVi: '', subEn: '' };

const inputCls =
  'w-full rounded-lg border border-cream/40 bg-white/95 px-3 py-2 text-xs text-terra-900 placeholder-terra-900/45 outline-none focus:border-yellow-400';

export default function MediaPanel({
  open,
  t,
  lang,
  media,
  content,
  spots,
  onClose,
  onMediaUpdated,
  onContentUpdated,
  onSpotsUpdated,
}: Props) {
  const [tab, setTab] = useState<'banners' | 'map'>('banners');
  const [busySlot, setBusySlot] = useState<string | null>(null);
  const [savingSlot, setSavingSlot] = useState<string | null>(null);
  const [savedSlot, setSavedSlot] = useState<string | null>(null);
  const [errorSlot, setErrorSlot] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, SlideContent>>({});
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      const next: Record<string, SlideContent> = {};
      for (const { slot } of SLOT_LABELS) {
        next[slot] = { ...emptyContent, ...content[slot] };
      }
      setDrafts(next);
      setErrorSlot(null);
      setSavedSlot(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const updateDraft = (slot: string, field: keyof SlideContent, value: string) => {
    setDrafts((d) => ({ ...d, [slot]: { ...d[slot], [field]: value } }));
  };

  const pick = async (slot: string, file: File | undefined) => {
    if (!file) return;
    setBusySlot(slot);
    setErrorSlot(null);
    try {
      await uploadImage(slot, file);
      onMediaUpdated();
    } catch (err) {
      const code = err instanceof Error ? err.message : '';
      setErrorSlot(code === 'TOO_LARGE' ? 'too-large' : code === 'INVALID_TYPE' ? 'invalid-type' : 'failed');
    } finally {
      setBusySlot(null);
    }
  };

  const remove = async (slot: string) => {
    setBusySlot(slot);
    setErrorSlot(null);
    try {
      await deleteMedia(slot);
      onMediaUpdated();
    } catch {
      setErrorSlot('failed');
    } finally {
      setBusySlot(null);
    }
  };

  const saveContent = async (slot: string) => {
    setSavingSlot(slot);
    setErrorSlot(null);
    setSavedSlot(null);
    try {
      await saveSlideContent(slot, drafts[slot] ?? emptyContent);
      onContentUpdated();
      setSavedSlot(slot);
      window.setTimeout(() => setSavedSlot(null), 2000);
    } catch {
      setErrorSlot('save-failed');
    } finally {
      setSavingSlot(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-terra-900/70 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div
        ref={panelRef}
        className="relative mx-auto max-h-[88vh] w-full max-w-[430px] animate-fade-up overflow-y-auto rounded-t-3xl border-t border-cream/40 bg-terra-700 p-4 pb-6 shadow-2xl"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-white">
            <ImageIcon className="h-4 w-4" /> Quản lý ảnh & nội dung
          </h2>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="rounded-full bg-white/15 p-1.5 transition hover:bg-white/30 active:scale-90"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>

        <div className="mb-3 grid grid-cols-2 gap-2">
          <button
            onClick={() => setTab('banners')}
            className={`flex items-center justify-center gap-1.5 rounded-full border py-2 text-[11px] font-extrabold transition active:scale-95 ${
              tab === 'banners'
                ? 'border-cream bg-terra-500 text-white shadow-md'
                : 'border-cream/50 text-cream/90 hover:bg-terra-600/50'
            }`
          }
          >
            <ImageIcon className="h-3.5 w-3.5" /> Banner
          </button>
          <button
            onClick={() => setTab('map')}
            className={`flex items-center justify-center gap-1.5 rounded-full border py-2 text-[11px] font-extrabold transition active:scale-95 ${
              tab === 'map'
                ? 'border-cream bg-terra-500 text-white shadow-md'
                : 'border-cream/50 text-cream/90 hover:bg-terra-600/50'
            }`
          }
          >
            <MapIcon className="h-3.5 w-3.5" /> Quản lý Bản đồ
          </button>
        </div>

        {tab === 'map' ? (
          <MapManager t={t} lang={lang} spots={spots} onClose={onClose} onSaved={onSpotsUpdated} />
        ) : (
        <div className="space-y-3">
          {SLOT_LABELS.map(({ slot, label }) => {
            const url = media[slot];
            const draft = drafts[slot] ?? emptyContent;
            return (
              <div key={slot} className="rounded-2xl border border-cream/50 bg-terra-600/60 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-white">{label}</p>
                  {url && (
                    <button
                      onClick={() => remove(slot)}
                      disabled={busySlot === slot || savingSlot === slot}
                      aria-label="Xóa ảnh"
                      className="rounded-full bg-red-500/80 p-1.5 transition hover:bg-red-500 active:scale-90 disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-white" />
                    </button>
                  )}
                </div>

                <div className="mt-2 aspect-[4/3] w-full overflow-hidden rounded-xl border border-cream/60 bg-terra-900/40">
                  {url ? (
                    <img src={url} alt={label} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-cream/50">
                      <ImageIcon className="h-6 w-6" />
                      <span className="text-[10px] font-semibold">Ảnh mặc định</span>
                    </div>
                  )}
                </div>

                <label
                  className={`mt-2 flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-yellow-400 py-2 text-[11px] font-extrabold text-terra-900 transition hover:bg-yellow-300 active:scale-95 ${
                    busySlot === slot ? 'pointer-events-none opacity-60' : ''
                  }`}
                >
                  {busySlot === slot ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Upload className="h-3.5 w-3.5" />
                  )}
                  {busySlot === slot ? 'Đang tải lên...' : 'Chọn ảnh từ máy'}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      pick(slot, e.target.files?.[0]);
                      e.target.value = '';
                    }}
                  />
                </label>

                <div className="mt-3 space-y-2">
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-cream/80">
                      Nhãn / Badge (không bắt buộc)
                    </label>
                    <input
                      value={draft.badge}
                      onChange={(e) => updateDraft(slot, 'badge', e.target.value)}
                      placeholder="QUẢNG CÁO hoặc NỔI BẬT"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-cream/80">
                      Tiêu đề quảng cáo (Tiếng Việt)
                    </label>
                    <input
                      value={draft.titleVi}
                      onChange={(e) => updateDraft(slot, 'titleVi', e.target.value)}
                      placeholder="VD: Bảo tàng gốm Bát Tràng"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-cream/80">
                      Banner Title (English)
                    </label>
                    <input
                      value={draft.titleEn}
                      onChange={(e) => updateDraft(slot, 'titleEn', e.target.value)}
                      placeholder="e.g. Bat Trang Ceramic Museum"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-cream/80">
                      Mô tả phụ / Subhead (Tiếng Việt)
                    </label>
                    <input
                      value={draft.subVi}
                      onChange={(e) => updateDraft(slot, 'subVi', e.target.value)}
                      placeholder="VD: Kiến trúc độc đáo & cổ vật 700 năm"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-cream/80">
                      Subhead (English)
                    </label>
                    <input
                      value={draft.subEn}
                      onChange={(e) => updateDraft(slot, 'subEn', e.target.value)}
                      placeholder="e.g. Iconic architecture & relics"
                      className={inputCls}
                    />
                  </div>
                </div>

                {errorSlot === slot && (
                  <p className="mt-2 text-[10px] font-bold text-red-200">
                    {errorSlot === 'too-large'
                      ? 'Ảnh vượt quá 5 MB.'
                      : errorSlot === 'invalid-type'
                        ? 'Chỉ nhận JPG, PNG hoặc WebP.'
                        : 'Không thể lưu. Thử lại nhé.'}
                  </p>
                )}

                <button
                  onClick={() => saveContent(slot)}
                  disabled={savingSlot === slot}
                  className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg py-2.5 text-[11px] font-extrabold transition-all active:scale-95 ${
                    savedSlot === slot
                      ? 'bg-green-500 text-white'
                      : 'bg-cream text-terra-700 hover:bg-white'
                  } ${savingSlot === slot ? 'pointer-events-none opacity-60' : ''}`}
                >
                  {savingSlot === slot ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : savedSlot === slot ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Save className="h-3.5 w-3.5" />
                  )}
                  {savingSlot === slot
                    ? 'Đang lưu...'
                    : savedSlot === slot
                      ? 'Đã lưu!'
                      : 'Lưu thay đổi'}
                </button>
              </div>
            );
          })}
        </div>
        )}

        <p className="mt-3 text-center text-[10px] text-cream/60">
          Ảnh và nội dung lưu trên đám mây, cập nhật ngay trên trang chủ.
        </p>
      </div>
    </div>
  );
}
