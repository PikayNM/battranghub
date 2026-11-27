import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, ParkingSquare, Wrench, ConciergeBell, Plus, Pencil, Trash2, Crosshair, Loader2, X, Check } from 'lucide-react';
import type { MapSpot, SpotKind } from '@/lib/media';
import { saveMapSpot, deleteMapSpot } from '@/lib/media';
import type { Lang, Translations } from '@/lib/i18n';

interface Props {
  t: Translations;
  lang: Lang;
  spots: MapSpot[];
  onClose: () => void;
  onSaved: () => void;
}

const BAT_TRANG: [number, number] = [20.9765, 105.9135];

const emptySpot: MapSpot = {
  key: '',
  nameVi: '',
  nameEn: '',
  kind: 'spot',
  descVi: '',
  descEn: '',
  hours: '',
  lat: BAT_TRANG[0],
  lng: BAT_TRANG[1],
};

const kindOptions: { key: SpotKind; label: string }[] = [
  { key: 'spot', label: 'Điểm tham quan' },
  { key: 'workshop', label: 'Xưởng gốm' },
  { key: 'parking', label: 'Bãi đỗ xe' },
  { key: 'service', label: 'Dịch vụ' },
];

const kindIcon = { spot: MapPin, workshop: Wrench, parking: ParkingSquare, service: ConciergeBell };

const inputCls =
  'w-full rounded-lg border border-cream/40 bg-white/95 px-3 py-2 text-xs text-terra-900 placeholder-terra-900/45 outline-none focus:border-yellow-400';

export default function MapManager({ t, spots, onClose, onSaved }: Props) {
  const [editing, setEditing] = useState<MapSpot | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(false);
  const [confirmKey, setConfirmKey] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [picking, setPicking] = useState(false);

  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Build the picker map only while the form is open
  useEffect(() => {
    if (!editing || !mapDivRef.current || mapRef.current) return;
    const map = L.map(mapDivRef.current, {
      center: [editing.lat, editing.lng],
      zoom: 16,
      zoomControl: false,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    markerRef.current = L.marker([editing.lat, editing.lng]).addTo(map);
    map.on('click', (e: L.LeafletMouseEvent) => {
      setEditing((cur) =>
        cur ? { ...cur, lat: Number(e.latlng.lat.toFixed(6)), lng: Number(e.latlng.lng.toFixed(6)) } : cur,
      );
      setPicking(false);
    });
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing !== null]);

  useEffect(() => {
    if (!editing || !mapRef.current || !markerRef.current) return;
    markerRef.current.setLatLng([editing.lat, editing.lng]);
    mapRef.current.panTo([editing.lat, editing.lng]);
  }, [editing?.lat, editing?.lng]);

  const useGps = () => {
    if (!navigator.geolocation) {
      setError(true);
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setEditing((cur) =>
          cur
            ? { ...cur, lat: Number(pos.coords.latitude.toFixed(6)), lng: Number(pos.coords.longitude.toFixed(6)) }
            : cur,
        );
        setLocating(false);
      },
      () => {
        setLocating(false);
        setError(true);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const save = async () => {
    if (!editing || !editing.nameVi.trim() || !editing.nameEn.trim()) {
      setError(true);
      return;
    }
    setBusy(true);
    setError(false);
    try {
      const { saveMapSpot } = await import('@/lib/media');
      const key = editing.key || `spot-${Date.now()}`;
      await saveMapSpot({ ...editing, key });
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
      onSaved();
      setEditing(null);
      setIsNew(false);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (key: string) => {
    if (confirmKey !== key) {
      setConfirmKey(key);
      return;
    }
    setBusy(true);
    try {
      await deleteMapSpot(key);
      setConfirmKey(null);
      onSaved();
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="animate-fade-up space-y-3">
      <button
        onClick={() => {
          setEditing({ ...emptySpot });
          setIsNew(true);
          setError(false);
        }}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-yellow-400 py-2.5 text-[11px] font-extrabold text-terra-900 transition hover:bg-yellow-300 active:scale-95"
      >
        <Plus className="h-3.5 w-3.5" /> {t.addSpot}
      </button>

      {isNew && editing && editing.key === '' ? null : null}

      {editing ? (
        <div className="rounded-2xl border border-yellow-400/60 bg-terra-600/60 p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-extrabold text-white">{isNew ? t.addSpot : t.editSpot}</p>
            <button
              onClick={() => {
                setEditing(null);
                setIsNew(false);
              }}
              aria-label="Đóng"
              className="rounded-full bg-white/15 p-1 transition hover:bg-white/30"
            >
              <X className="h-3.5 w-3.5 text-white" />
            </button>
          </div>

          <div className="space-y-2">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-cream/80">{t.spotNameVi}</label>
              <input
                value={editing.nameVi}
                onChange={(e) => setEditing({ ...editing, nameVi: e.target.value })}
                className={inputCls}
                placeholder="VD: Xưởng gốm mới"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-cream/80">{t.spotNameEn}</label>
              <input
                value={editing.nameEn}
                onChange={(e) => setEditing({ ...editing, nameEn: e.target.value })}
                className={inputCls}
                placeholder="e.g. New Pottery Studio"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-cream/80">{t.category}</label>
              <div className="grid grid-cols-4 gap-1.5">
                {kindOptions.map(({ key, label }) => {
                  const Icon = kindIcon[key];
                  return (
                    <button
                      key={key}
                      onClick={() => setEditing({ ...editing, kind: key })}
                      className={`flex flex-col items-center gap-0.5 rounded-lg border px-1 py-1.5 text-[9px] font-bold transition active:scale-95 ${
                        editing.kind === key
                          ? 'border-yellow-400 bg-yellow-400/20 text-white'
                          : 'border-cream/40 text-cream/80 hover:bg-white/10'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-cream/80">{t.spotDescVi}</label>
              <textarea
                value={editing.descVi}
                onChange={(e) => setEditing({ ...editing, descVi: e.target.value })}
                rows={2}
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-cream/80">{t.spotDescEn}</label>
              <textarea
                value={editing.descEn}
                onChange={(e) => setEditing({ ...editing, descEn: e.target.value })}
                rows={2}
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-cream/80">{t.openingHours}</label>
              <input
                value={editing.hours ?? ''}
                onChange={(e) => setEditing({ ...editing, hours: e.target.value })}
                placeholder="8:00–17:00"
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-cream/80">{t.coordinates}</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  step="0.000001"
                  value={editing.lat}
                  onChange={(e) => setEditing({ ...editing, lat: Number(e.target.value) })}
                  className={inputCls}
                />
                <input
                  type="number"
                  step="0.000001"
                  value={editing.lng}
                  onChange={(e) => setEditing({ ...editing, lng: Number(e.target.value) })}
                  className={inputCls}
                />
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPicking((p) => !p)}
                  className={`flex items-center justify-center gap-1 rounded-lg border py-2 text-[10px] font-bold transition active:scale-95 ${
                    picking ? 'border-yellow-400 bg-yellow-400/20 text-white' : 'border-cream/40 text-white hover:bg-white/10'
                  }`}
                >
                  <MapPin className="h-3.5 w-3.5" /> {t.pickOnMap}
                </button>
                <button
                  onClick={useGps}
                  disabled={locating}
                  className="flex items-center justify-center gap-1 rounded-lg border border-cream/40 py-2 text-[10px] font-bold text-white transition hover:bg-white/10 active:scale-95"
                >
                  {locating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Crosshair className="h-3.5 w-3.5" />}
                  {locating ? '...' : t.useMyGps}
                </button>
              </div>
              {picking && (
                <p className="mt-1.5 animate-fade-in text-center text-[10px] font-bold text-yellow-300">{t.pickHint}</p>
              )}
              <div
                ref={mapDivRef}
                className={`mt-2 h-44 w-full overflow-hidden rounded-lg border border-cream/40 ${picking ? '' : 'hidden'}`}
              />
            </div>
          </div>

          {error && (
            <p className="mt-2 text-[10px] font-bold text-red-200">
              {t.errorGeneric}
            </p>
          )}
          {saved && (
            <p className="mt-2 flex items-center gap-1 text-[10px] font-bold text-green-300">
              <Check className="h-3 w-3" /> {t.spotSaved}
            </p>
          )}

          <button
            onClick={save}
            disabled={busy}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-cream py-2.5 text-[11px] font-extrabold text-terra-700 transition hover:bg-white active:scale-95 disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
            {busy ? '...' : t.saveSpot}
          </button>
        </div>
      ) : null}

      {spots.map((spot) => {
        const Icon = kindIcon[spot.kind] ?? MapPin;
        return (
          <div key={spot.key} className="rounded-2xl border border-cream/50 bg-terra-600/60 p-3">
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-terra-700 p-1.5">
                <Icon className="h-4 w-4 text-white" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-white">{spot.nameVi}</p>
                <p className="truncate text-[10px] text-cream/70">
                  {spot.lat.toFixed(5)}, {spot.lng.toFixed(5)}
                </p>
              </div>
              <button
                onClick={() => {
                  setEditing({ ...spot });
                  setIsNew(false);
                  setError(false);
                }}
                aria-label={t.editSpot}
                className="rounded-full bg-white/15 p-1.5 transition hover:bg-white/30 active:scale-90"
              >
                <Pencil className="h-3.5 w-3.5 text-white" />
              </button>
              <button
                onClick={() => remove(spot.key)}
                disabled={busy}
                aria-label={t.deleteSpot}
                className={`rounded-full p-1.5 transition active:scale-90 disabled:opacity-50 ${
                  confirmKey === spot.key ? 'bg-red-500' : 'bg-red-500/70 hover:bg-red-500'
                }`}
              >
                <Trash2 className="h-3.5 w-3.5 text-white" />
              </button>
            </div>
            {confirmKey === spot.key && (
              <p className="mt-1.5 animate-fade-in text-[10px] font-bold text-red-200">{t.confirmDelete}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
